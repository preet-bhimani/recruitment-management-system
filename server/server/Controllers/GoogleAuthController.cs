using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models.Dto;
using server.Models.Entities;
using System.Text.Json;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoogleAuthController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        private readonly IHttpClientFactory httpClientFactory;
        private readonly IConfiguration configuration;

        public GoogleAuthController(AppDbContext dbContext, IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            this.dbContext = dbContext;
            this.httpClientFactory = httpClientFactory;
            this.configuration = configuration;
        }

        // Create token and OAuth
        [HttpPost("exchange")]
        public async Task<IActionResult> ExchangeGoogleCode(GoogleIntegrationSettingsDto gsDto)
        {
            // Model validation
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Fetch client details
            var clientId = configuration["GoogleOAuth:ClientId"];
            var clientSecret = configuration["GoogleOAuth:ClientSecret"];
            var redirectUri = configuration["GoogleOAuth:RedirectUri"];

            if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
                return BadRequest("Google OAuth configuration missing.");

            var form = new Dictionary<string, string>
            {
                ["code"] = gsDto.Code,
                ["client_id"] = clientId!,
                ["client_secret"] = clientSecret!,
                ["redirect_uri"] = redirectUri!,
                ["grant_type"] = "authorization_code",
                ["access_type"] = "offline",
                ["prompt"] = "consent"
            };

            var client = httpClientFactory.CreateClient();
            var response = await client.PostAsync("https://oauth2.googleapis.com/token", new FormUrlEncodedContent(form));

            // If response is not Scuccessded
            if (!response.IsSuccessStatusCode)
            {
                var errorText = await response.Content.ReadAsStringAsync();
                return BadRequest("Something went wrong");
            }

            // Convert response to JSON
            var json = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());
            var refreshToken = json.RootElement.GetProperty("refresh_token").GetString();

            if (string.IsNullOrEmpty(refreshToken))
                return BadRequest("No refresh token received. Try logging again.");

            // Save or update DB both logic
            var existing = await dbContext.GoogleIntegrationSettings.FirstOrDefaultAsync();

            if (existing == null)
            {
                var setting = new GoogleIntegrationSettings
                {
                    RefreshToken = refreshToken
                };

                await dbContext.GoogleIntegrationSettings.AddAsync(setting);
            }
            else
            {
                existing.RefreshToken = refreshToken;
                existing.UpdatedAt = DateTime.UtcNow;

                dbContext.GoogleIntegrationSettings.Update(existing);
            }

            await dbContext.SaveChangesAsync();

            return Ok( "Google account connected successfully and refresh token saved.");
        }
    }
}
