using MentorHup.APPLICATION.DTOs.Admin;
using MentorHup.APPLICATION.DTOs.Pagination;
using MentorHup.APPLICATION.Service.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MentorHup.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkillsController : ControllerBase
    {

        private readonly IAdminService adminService;

        public SkillsController(IAdminService adminService)
        {
            this.adminService = adminService;
        }

        // GET: api/skills
        [HttpGet("")]
        public async Task<IActionResult> GetAll([FromQuery] SkillsPaginationDto skillsPaginationDto)
        {
            var skills = await adminService.GetAllSkillsAsync(skillsPaginationDto.PageSize,
                skillsPaginationDto.PageNumber, skillsPaginationDto.Name);

            return Ok(skills);
        }

        // GET: api/skills/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSkillById(int id)
        {
            var skill = await adminService.GetSkillByIdAsync(id);

            if (skill.Exist == false)
                return NotFound("Skill not found.");

            return Ok(new { skill.Id, skill.SkillName });
        }

        // POST: api/skills/add-skill
        [HttpPost("add-skill")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateSkill([FromBody] AdminSkillRequest request)
        {
            var skill = await adminService.AddSkillAsync(request);

            if (skill == null)
            {
                return BadRequest("Skill already exists.");
            }

            return Created($"api/skills/{skill.Id}", new { skill.Id, skill.SkillName }); // or: return Created(nameof(GetSkillById), new { skill.Id, skill.SkillName });
        }

        // PUT: api/skills/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateSkill(int id, [FromBody] AdminSkillRequest request)
        {
            var updatedSkill = await adminService.UpdateSkillAsync(id, request);

            if (updatedSkill == null)
                return NotFound("Skill not found.");

            return Ok(new { updatedSkill.Id, updatedSkill.SkillName });
        }


        // DELETE: api/skills/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteSkill(int id)
        {
            var deleted = await adminService.DeleteSkillAsync(id);

            if (!deleted)
                return NotFound("Skill not found.");

            return NoContent(); // 204 (Succeed without content)
        }

    }
}
