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
                CreatedAt = DateTime.UtcNow
            };

            dbContext.Add(newSkill);
            await dbContext.SaveChangesAsync();

            return Ok("Skill added Successfully");
        }

        // Get all skills
        [HttpGet]
        public async Task<IActionResult> GetAllSkills()
        {
            return Ok(dbContext.Skills.ToList());
        }

        // Get skills based on Id
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

            dbContext.Skills.Update(skill);
            await dbContext.SaveChangesAsync();

            return Ok("Skill updated successfully");
        }

        // Delete logic
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
            dbContext.Skills.Remove(skill);
            await dbContext.SaveChangesAsync();

            return Ok("Skill deleted successfully");
        }
    }
}
