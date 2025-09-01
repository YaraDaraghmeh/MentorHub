using AutoMapper;
using MentorHup.APPLICATION.DTOs.Mentor;
using MentorHup.Domain.Entities;
using MentorHup.Infrastructure.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MentorHup.APPLICATION.Service
{
    public class MentorAuthService : IMentorAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _context;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public MentorAuthService(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ApplicationDbContext context,
            ITokenService tokenService,
            IMapper mapper)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
            _tokenService = tokenService;
            _mapper = mapper;
        }

        public async Task<MentorLoginRegistrationResult> RegisterAsync(MentorRegisterRequest request)
        {
            var existing = await _userManager.FindByEmailAsync(request.Email);
            if (existing != null)
                return new MentorLoginRegistrationResult { IsSuccess = false, Errors = new[] { "Email is already registered." } };

            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
                return new MentorLoginRegistrationResult
                {
                    IsSuccess = false,
                    Errors = result.Errors.Select(e => e.Description).ToArray()
                };

            if (!await _roleManager.RoleExistsAsync("Mentor"))
                await _roleManager.CreateAsync(new IdentityRole("Mentor"));

            await _userManager.AddToRoleAsync(user, "Mentor");

            var mentor = new Mentor
            {
                Name = request.Name,
                Description = request.Description,
                Experiences = request.Experiences,
                Price = request.Price,
                ApplicationUserId = user.Id
            };

            _context.Mentors.Add(mentor);
            await _context.SaveChangesAsync();

            foreach (var skillId in request.SkillIds)
            {
                var skillExists = await _context.Skills.AnyAsync(s => s.Id == skillId);
                if (!skillExists)
                    return new MentorLoginRegistrationResult
                    {
                        IsSuccess = false,
                        Errors = new string[] { $"Skill with Id {skillId} does not exist" }
                    };

                _context.MentorSkills.Add(new MentorSkill
                {
                    MentorId = mentor.Id,
                    SkillId = skillId
                });
            }
            await _context.SaveChangesAsync();

            var token = await _tokenService.CreateTokenAsync(user);
            var roles = await _userManager.GetRolesAsync(user);

            var skills = await _context.MentorSkills
                            .Where(ms => ms.MentorId == mentor.Id)
                            .Include(ms => ms.Skill)
                            .Select(ms => ms.Skill.SkillName)
                            .ToListAsync();

            return new MentorLoginRegistrationResult
            {
                IsSuccess = true,
                Mentor = new MentorResponse
                {
                    Id = mentor.Id,
                    Name = mentor.Name,
                    Description = mentor.Description,
                    Experiences = mentor.Experiences,
                    Price = mentor.Price,
                    Email = user.Email!,
                    Roles = roles.ToList(),
                    Skills = skills,
                    AccessToken = token,
                    Expires = DateTime.UtcNow.AddHours(3)
                }
            };
        }

        public async Task<MentorLoginRegistrationResult> LoginAsync(MentorLoginRequest request)
        {
            var user = await _userManager.Users
                .Include(u => u.Mentor)
                .ThenInclude(m => m.MentorSkills)
                .ThenInclude(ms => ms.Skill)
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
            {
                return new MentorLoginRegistrationResult
                {
                    IsSuccess = false,
                    Errors = new[] { "Invalid email or password" }
                };
            }

            var token = await _tokenService.CreateTokenAsync(user);
            var roles = await _userManager.GetRolesAsync(user);

            var skills = user.Mentor!.MentorSkills.Select(ms => ms.Skill.SkillName).ToList();

            return new MentorLoginRegistrationResult
            {
                IsSuccess = true,
                Mentor = new MentorResponse
                {
                    Id = user.Mentor.Id,
                    Name = user.Mentor.Name,
                    Description = user.Mentor.Description,
                    Experiences = user.Mentor.Experiences,
                    Price = user.Mentor.Price,
                    Email = user.Email!,
                    Roles = roles.ToList(),
                    Skills = skills,
                    AccessToken = token,
                    Expires = DateTime.UtcNow.AddHours(3)
                }
            };
        }
    }
}
