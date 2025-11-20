using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models.Dto;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public EmployeeController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // Get all Employees
        [HttpGet]
        public async Task<IActionResult> GetAllEmployees()
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}/User_Upload_Photos/";

            var employees = await dbContext.Employees
                .Select(e => new
                {
                    e.EmployeeId,
                    e.FullName,
                    e.Email,
                    e.PhoneNumber,
                    Photo = !string.IsNullOrEmpty(e.User.Photo) ? baseUrl + e.User.Photo : null,
                    e.City,
                    e.JobTitle,
                    e.JoiningDate,
                    e.EmploymentStatus,
                })
                .ToListAsync();

            return Ok(employees);
        }

        // Get Employees by Id
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetEmployeeById(Guid id)
        {
            var employee = await dbContext.Employees
                .FirstOrDefaultAsync(e => e.EmployeeId == id);

            if (employee == null)
                return NotFound("Employee not found");

            return Ok(employee);
        }
    }
}
