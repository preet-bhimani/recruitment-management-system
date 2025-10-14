using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models;
using server.Models.Dto;
using server.Models.Entities;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public AuthController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost("register")]
        public IActionResult Register(UserDto userDto)
        {
            var hashedPassword = new PasswordHasher<User>()
                .HashPassword(user, userDto.Password);

            var user = new User()
            {
                FullName = userDto.FullName,
                Email = userDto.Email,
                Password = hashedPassword,
                PhoneNumber = userDto.PhoneNumber,
                City = userDto.City,
                DOB = userDto.DOB,
                Photo = userDto.Photo,
                Reference = userDto.Reference,
            };
        }
    }
}
