using MentorHup.APPLICATION.DTOs.Mentor;
using MentorHup.Domain.Entities;
using MentorHup.Infrastructure.Context;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text;

namespace MentorHup.APPLICATION.Service.AuthServices
{
    public class MentorAuthService( // Primary Constructor
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        ApplicationDbContext context,
        ITokenService tokenService,
        IEmailSender emailSender,
        IHttpContextAccessor httpContextAccessor,
        IWebHostEnvironment webHostEnvironment
            ) : IMentorAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly RoleManager<IdentityRole> _roleManager = roleManager;
        private readonly ApplicationDbContext _context = context;
        private readonly ITokenService _tokenService = tokenService;
        private readonly IEmailSender emailSender = emailSender;
        private readonly IHttpContextAccessor httpContextAccessor = httpContextAccessor;
        private readonly IWebHostEnvironment _webHostEnvironment = webHostEnvironment;

        public async Task<MentorLoginRegistrationResult> RegisterAsync(MentorRegisterRequest request)
        {
            var existing = await _userManager.FindByEmailAsync(request.Email);
            if (existing != null)
                return new MentorLoginRegistrationResult { IsSuccess = false, Errors = new[] { "Email is already registered." } };

            var user = new ApplicationUser
            {
                UserName = request.Name,
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

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var confirmUrl = $"{httpContextAccessor.HttpContext.Request.Scheme}://{httpContextAccessor.HttpContext.Request.Host}/api/mentors/confirm-email?userId={user.Id}&token={encodedToken}";

            string email = user.Email;
            string subject = "Welcome to MentorHub – Thank You for Joining as a Mentor";
            string htmlMessage = $@"
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset='UTF-8' />
                </head>
                <body style='font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;'>
                  <div style='max-width:600px;margin:auto;background:#fff;border-radius:10px;padding:30px;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>
                    <h2 style='color:#16a34a;'>Welcome {user.UserName} to MentorHub 🌟</h2>
                    <p>Hello Mentor,</p>
                    <p>
                      We’re honored to welcome you as a <strong>Mentor</strong> at MentorHub!  
                      Your knowledge, guidance, and experience will play a key role in helping mentees grow, 
                      achieve their goals, and unlock new opportunities.
                    </p>
                    <p>
                      You can now log in to your account, complete your mentor profile, and start connecting with mentees who need your expertise.
                    </p>
                    <a href='{confirmUrl}' 
                       style='display:inline-block;margin-top:20px;padding:12px 20px;background:#4f46e5;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;'>
                       Confirm Email
                    </a>
                    <div style='margin-top:30px;font-size:13px;color:#6b7280;'>
                      <p>Thank you for becoming part of the MentorHub community. Together, we build brighter futures ✨</p>
                      <p>&copy; 2025 MentorHub Team</p>
                    </div>
                  </div>
                </body>
                </html>";

            await emailSender.SendEmailAsync(email, subject, htmlMessage);



            var mentor = new Domain.Entities.Mentor
            {
                Name = request.Name,
                Description = request.Description,
                Experiences = request.Experiences,
                Price = request.Price,
                Field = request.Field,
                ApplicationUserId = user.Id,
                StripeAccountId = request.StripeAccountId, 
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

            foreach (var availabilityDto in request.Availabilities)
            {
                _context.MentorAvailabilities.Add(new MentorAvailability
                {
                    MentorId = mentor.Id,
                    StartTime = availabilityDto.StartTime,
                    EndTime = availabilityDto.EndTime,
                    DurationInMinutes = availabilityDto.DurationInMinutes,
                    IsBooked = false
                });
            }
            await _context.SaveChangesAsync();

            var roles = await _userManager.GetRolesAsync(user);

            var skills = await _context.MentorSkills
                            .Where(ms => ms.MentorId == mentor.Id)
                            .Include(ms => ms.Skill)
                            .Select(ms => ms.Skill.SkillName)
                            .ToListAsync();

            //var availabilities = await _context.MentorAvailabilities
            //                        .Where(ma => ma.MentorId == mentor.Id)
            //                        .Select(ma => new MentorAvailabilityResponse
            //                        {
            //                            StartTime = ma.StartTime,
            //                            EndTime = ma.EndTime,
            //                            DurationInMinutes = ma.DurationInMinutes,
            //                            IsBooked = ma.IsBooked
            //                        })
            //                        .ToListAsync();

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
                    ImageLink = mentor.ImageUrl,
                    Email = user.Email!,
                    Roles = roles.ToList(),
                    Skills = skills,
                    Field = mentor.Field,
                    // Availabilities = availabilities,
                    AccessToken = token,
                    Expires = DateTime.UtcNow.AddHours(3)
                }
            };
        }



        public async Task<UploadImageResult> UploadImageAsync(IFormFile image)
        {
            var userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return new UploadImageResult { IsSuccess = false, Errors = new[] { "User is not authenticated." } };
            }

            var mentor = await _context.Mentors.FirstOrDefaultAsync(m => m.ApplicationUserId == userId);
            if (mentor == null)
            {
                return new UploadImageResult { IsSuccess = false, Errors = new[] { "Mentor profile not found." } };
            }

            if (image != null && image.Length > 0)
            {
                var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images/mentors");
                Directory.CreateDirectory(uploadsFolder);

                // delete the old one from server (if exist)
                if (!string.IsNullOrEmpty(mentor.ImageUrl))
                {
                    var oldFileName = Path.GetFileName(new Uri(mentor.ImageUrl).LocalPath);
                    var oldFilePath = Path.Combine(uploadsFolder, oldFileName);
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

                // upload new image
                var uniqueFileName = $"{Guid.NewGuid()}_{image.FileName}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using var fileStream = new FileStream(filePath, FileMode.Create);
                await image.CopyToAsync(fileStream);

                var baseUrl = $"{httpContextAccessor.HttpContext.Request.Scheme}://{httpContextAccessor.HttpContext.Request.Host}";
                mentor.ImageUrl = $"{baseUrl}/images/mentors/{uniqueFileName}";
            }

            await _context.SaveChangesAsync();

            return new UploadImageResult { IsSuccess = true, ImageUrl = mentor.ImageUrl };
        }

        public async Task<bool> ConfirmEmailAsync(string userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            var decodedBytes = WebEncoders.Base64UrlDecode(token);
            var decodedToken = Encoding.UTF8.GetString(decodedBytes);
            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

            return result.Succeeded;
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

            if (!await _userManager.IsEmailConfirmedAsync(user))
            {
                return new MentorLoginRegistrationResult
                {
                    IsSuccess = false,
                    Errors = new[] { "Please confirm your email before logging in." }
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
                    Field = user.Mentor.Field,
                    Price = user.Mentor.Price,
                    Email = user.Email!,
                    Roles = roles.ToList(),
                    Skills = skills,
                    AccessToken = token,
                    Expires = DateTime.UtcNow.AddHours(3)
                }
            };
        }

        public async Task<bool> UpdateAsync(MentorUpdateRequest request)
        {
            var userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var mentor = await _context.Mentors
                .Include(m => m.Availabilities)
                .Include(m => m.MentorSkills)
                .FirstOrDefaultAsync(m => m.ApplicationUserId == userId);

            if (mentor == null)
                return false;

            if (!string.IsNullOrEmpty(request.Name))
                mentor.Name = request.Name;

            if (!string.IsNullOrEmpty(request.Field))
                mentor.Field = request.Field;

            if (!string.IsNullOrEmpty(request.Description))
                mentor.Description = request.Description;

            if (request.Experiences.HasValue)
                mentor.Experiences = request.Experiences.Value;

            if (request.Price.HasValue)
                mentor.Price = request.Price.Value;

            if (!string.IsNullOrEmpty(request.StripeAccountId))
                mentor.StripeAccountId = request.StripeAccountId;

            if (request.SkillIds != null)
            {
                _context.MentorSkills.RemoveRange(mentor.MentorSkills);

                foreach (var skillId in request.SkillIds)
                {
                    var skillExists = await _context.Skills.AnyAsync(s => s.Id == skillId);
                    if (!skillExists)
                    {
                        return false;
                    }
                    _context.MentorSkills.Add(new MentorSkill
                    {
                        MentorId = mentor.Id,
                        SkillId = skillId
                    });
                }
            }

            if (request.Availabilities != null)
            {
                _context.MentorAvailabilities.RemoveRange(mentor.Availabilities);

                foreach (var availabilityDto in request.Availabilities)
                {
                    _context.MentorAvailabilities.Add(new MentorAvailability
                    {
                        MentorId = mentor.Id,
                        StartTime = availabilityDto.StartTime,
                        EndTime = availabilityDto.EndTime,
                        DurationInMinutes = availabilityDto.DurationInMinutes,
                        IsBooked = false
                    });
                }
            }


            await _context.SaveChangesAsync();
            return true;
        }
    }
}
