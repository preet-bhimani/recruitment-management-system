using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models.Dto;
using server.Models.Entities;
using System.Collections;
using System.Collections.Generic;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TechnicalInterviewController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        private readonly IHttpClientFactory http;
        private readonly IConfiguration cfg;

        public TechnicalInterviewController(AppDbContext dbContext, IHttpClientFactory http, IConfiguration cfg)
        {
            this.dbContext = dbContext;
            this.http = http;
            this.cfg = cfg;
        }

        private async Task<string> GetAccessToken(string refreshToken)
        {
            var form = new Dictionary<string, string>
            {
                ["client_id"] = cfg["GoogleOAuth:ClientId"]!,
                ["client_secret"] = cfg["GoogleOAuth:ClientSecret"]!,
                ["refresh_token"] = refreshToken,
                ["grant_type"] = "refresh_token"
            };

            var client = http.CreateClient();
            var res = await client.PostAsync("https://oauth2.googleapis.com/token", new FormUrlEncodedContent(form));
            res.EnsureSuccessStatusCode();

            var json = await res.Content.ReadAsStringAsync();
            var token = JsonSerializer.Deserialize<GoogleTokenResponse>(json);
            return token!.access_token;
        }

        [HttpPost("schedule")]
        public async Task<IActionResult> ScheduleMeeting(ScheduleTechnicalInterviewDto stiDto)
        {
            // Model validation
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Ensure Google is connected
            var setting = await dbContext.GoogleIntegrationSettings.FirstOrDefaultAsync();
            if (setting == null || string.IsNullOrWhiteSpace(setting.RefreshToken))
            {
                return BadRequest("Google is not connected. Click on Meet Setting and connect Google first.");
            }

            // Get last round if there
            var lastRoundCheck = await dbContext.TechnicalInterviews
                .Where(t => t.JAId == stiDto.JAId)
                .OrderByDescending(t => t.NoOfRound)
                .FirstOrDefaultAsync();

            // If last round is not cleared then do not create a meeting
            var nextRound = (lastRoundCheck?.NoOfRound ?? 0) + 1;
            if (lastRoundCheck != null && lastRoundCheck.TechIsClear != "Clear")
            {
                return BadRequest("Previous round is not marked as Clear. You cannot schedule the next round.");
            }

            // Get candidate details
            var candidate = await dbContext.Users.FirstOrDefaultAsync(u => u.UserId == stiDto.UserId);
            if (candidate == null)
            {
                return NotFound("Candidate not found.");
            }

            // Get access token from abive GetAccessToken method
            var accessToken = await GetAccessToken(setting.RefreshToken);

            // Basic info for meeting schedule
            var istZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Kolkata");

            var startLocal = new DateTime(
                stiDto.TechDate.Year, stiDto.TechDate.Month, stiDto.TechDate.Day,
                stiDto.TechTime.Hour, stiDto.TechTime.Minute, 0, DateTimeKind.Unspecified
            );

            var startUtc = TimeZoneInfo.ConvertTimeToUtc(startLocal, istZone);
            var endUtc = startUtc.AddMinutes(stiDto.DurationMinutes);

            // Create event body for meeting
            var eventBody = new
            {
                summary = stiDto.MeetingSubject,
                description = $"Technical Interview Round {nextRound}",
                start = new { dateTime = startUtc.ToString("yyyy-MM-ddTHH:mm:ssZ"), timeZone = "Asia/Kolkata" },
                end = new { dateTime = endUtc.ToString("yyyy-MM-ddTHH:mm:ssZ"), timeZone = "Asia/Kolkata" },
                attendees = new[]
                    {
                        new { email = candidate.Email, displayName = candidate.FullName },
                        new { email = stiDto.InterviewerEmail, displayName = stiDto.InterviewerName }
                    },
                conferenceData = new
                {
                    createRequest = new
                    {
                        requestId = Guid.NewGuid().ToString("N"),
                        conferenceSolutionKey = new { type = "hangoutsMeet" }
                    }
                }
            };

            // Create request for event in calander
            var createReq = new HttpRequestMessage(
                    HttpMethod.Post,
                    "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1");

            createReq.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            createReq.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
            createReq.Content = new StringContent(JsonSerializer.Serialize(eventBody), Encoding.UTF8, "application/json");

            var client = http.CreateClient();
            var createRes = await client.SendAsync(createReq);

            // If calander is not set show error
            if (!createRes.IsSuccessStatusCode)
            {
                var err = await createRes.Content.ReadAsStringAsync();
                return BadRequest($"Google Calendar error: {err}");
            }

            // Convert google event into JSON
            var resJson = await createRes.Content.ReadAsStringAsync();
            var created = JsonSerializer.Deserialize<GoogleEventCreateResponse>(resJson);

            var meetingLink = created?.conferenceData?.entryPoints?.FirstOrDefault()?.uri;
            var googleEventId = created?.id;

            if (string.IsNullOrWhiteSpace(meetingLink) || string.IsNullOrWhiteSpace(googleEventId))
            {
                return BadRequest("Meeting created but response missing link or event id.");
            }

            var entity = new TechnicalInterview
            {
                JOId = stiDto.JOId,
                JAId = stiDto.JAId,
                UserId = stiDto.UserId,
                MeetingSubject = stiDto.MeetingSubject,
                TechDate = stiDto.TechDate,
                TechTime = stiDto.TechTime,
                MeetingLink = meetingLink,
                InterviewerName = stiDto.InterviewerName,
                InterviewerEmail = stiDto.InterviewerEmail,
                NoOfRound = nextRound,
                GoogleEventId = googleEventId,
                CreatedAt = DateTime.UtcNow
            };

            await dbContext.TechnicalInterviews.AddAsync(entity);
            await dbContext.SaveChangesAsync();

            return Ok(new
            {
                message = "Technical interview scheduled successfully",
                round = nextRound,
                meetingLink,
                googleEventId
            });
        }

        // Fetch candidate whose overallstatus is Technical Interview
        [HttpGet("waitinterview")]
        public async Task<IActionResult> GetAllCandidatesIsTechnicalInterview()
        {
            // Fetch candidates whoes OverallStatus is Technical Interview
            var candidates = await dbContext.JobApplications
                .Where(j => j.OverallStatus == "Technical Interview")
                .Select(j => new
                {
                    j.JAId,
                    j.UserId,
                    j.JOId,
                    j.OverallStatus,
                })
                .ToListAsync();

            if (!candidates.Any())
            {
                return NotFound("No candidates pending for technical interview scheduling.");
            }

            var baseUrl = $"{Request.Scheme}://{Request.Host}/User_Upload_Photos/";

            var result = new List<object>();

            foreach (var item in candidates)
            {
                var user = await dbContext.Users.FirstOrDefaultAsync(u => u.UserId == item.UserId);
                var job = await dbContext.JobOpenings.FirstOrDefaultAsync(o => o.JOId == item.JOId);

                // Find last round
                var lastRound = await dbContext.TechnicalInterviews
                    .Where(t => t.JAId == item.JAId)
                    .OrderByDescending(t => t.NoOfRound)
                    .FirstOrDefaultAsync();

                // Add data into result list
                result.Add(new
                {
                    item.JAId,
                    item.UserId,
                    item.JOId,
                    FullName = user?.FullName,
                    Email = user?.Email,
                    Title = job?.Title,
                    Photo = !string.IsNullOrEmpty(user.Photo) ? baseUrl + user.Photo : null,
                    lastRound,
                    Feedback = lastRound?.TechFeedback
                });
            }

            return Ok(result);
        }

        // Get token response
        public class GoogleTokenResponse
        {
            public string access_token { get; set; }
            public int expires_in { get; set; }
            public string token_type { get; set; }
        }

        // Get event create response
        public class GoogleEventCreateResponse
        {
            public string id { get; set; }
            public ConferenceData conferenceData { get; set; }
        }

        // Get conference Data
        public class ConferenceData
        {
            public EntryPoint[] entryPoints { get; set; }
        }

        // Get meeting ID
        public class EntryPoint
        {
            public string uri { get; set; }
        }
    }
}
