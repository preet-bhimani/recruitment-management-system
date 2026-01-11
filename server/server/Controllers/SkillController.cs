using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models.Dto;
using server.Models.Entities;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkillController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        public SkillController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // Add skills logic
        [Authorize(Roles = "Admin,Recruiter")]
        [HttpPost]
        public async Task<IActionResult> AddSkill(SkillDto skillDto)
        {
            // If skill is empty
            if (string.IsNullOrWhiteSpace(skillDto.SkillName))
            {
                return BadRequest("Skill name is required");
            }

            // Check if skill already exist or not
            var existingskill = dbContext.Skills.FirstOrDefault(s => s.SkillName.ToLower() == skillDto.SkillName.ToLower());
            if (existingskill != null)
            {
                return Conflict("Skill already exist");
            }

            // Add skill name and date
            var newSkill = new Skill
            {
                SkillName = skillDto.SkillName,
                SkillStatus = skillDto.SkillStatus,
                CreatedAt = DateTime.UtcNow
            };

            dbContext.Add(newSkill);
            await dbContext.SaveChangesAsync();

            return Ok("Skill added Successfully");
        }

        // Get all skills
        [Authorize(Roles = "Admin,Viewer,Recruiter")]
        [HttpGet]
        public async Task<IActionResult> GetAllSkills()
        {
            return Ok(dbContext.Skills.ToList());
        }

        // Get skills based on Id
        [Authorize(Roles = "Admin,Recruiter,Viewer")]
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetSkillById(Guid id)
        {
            var skill = await dbContext.Skills.FindAsync(id);

            if (skill == null)
            {
                return NotFound("Skill not found");
            }

            return Ok(skill);
        }

        // Update skill logic
        [Authorize(Roles = "Admin,Recruiter")]
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateSkill(Guid id, SkillDto skillDto)
        {
            // If skill is empty
            if (string.IsNullOrWhiteSpace(skillDto.SkillName))
            {
                return BadRequest("Skill data is required it cannot be empty");
            }

            // Find skill if exist in db or not
            var skill = await dbContext.Skills.FindAsync(id);
            if (skill == null)
            {
                return NotFound("Skill not found");
            }

            // Check if new skill name already exist or not
            var existingskill = await dbContext.Skills.FirstOrDefaultAsync(s => s.SkillName.ToLower() == skillDto.SkillName.ToLower() && s.SkillId != id);
            if (existingskill != null)
            {
                return Conflict($"{skillDto.SkillName} already exist");
            }

            // If everything perfect then update skill
            skill.SkillName = skillDto.SkillName;
            skill.UpdatedAt = DateTime.UtcNow;
            skill.SkillStatus = skillDto.SkillStatus;

            dbContext.Skills.Update(skill);
            await dbContext.SaveChangesAsync();

            return Ok("Skill updated successfully");
        }

        // Delete logic
        [Authorize(Roles = "Admin,Recruiter")]
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteSkill(Guid id)
        {
            // Find skill exist or not
            var skill = await dbContext.Skills.FindAsync(id);

            if (skill == null)
            {
                return NotFound("Skill not found");
            }

            // delete skill
            skill.SkillStatus = false;
            skill.UpdatedAt = DateTime.Now;
            await dbContext.SaveChangesAsync();

            return Ok("Skill deleted successfully");
        }
    }
}
