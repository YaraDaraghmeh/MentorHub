using MentorHup.APPLICATION.DTOs.Mentor;
using MentorHup.Domain.Entities;
using MentorHup.Infrastructure.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
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
        private readonly IEmailSender emailSender = emailSender;
        private readonly IHttpContextAccessor httpContextAccessor = httpContextAccessor;

        public async Task<MentorLoginRegistrationResult> RegisterAsync(MentorRegisterRequest request)
        {
            var existing = await _userManager.FindByEmailAsync(request.Email);
            if (existing != null)
                return new MentorLoginRegistrationResult { IsSuccess = false, Errors = new[] { "Email is already registered." } };

            var user = new ApplicationUser
            {
                UserName = request.Name,
                Email = request.Email,
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
            var confirmUrl = $"{httpContextAccessor.HttpContext.Request.Scheme}://{httpContextAccessor.HttpContext.Request.Host}/api/auth/confirm-email?userId={user.Id}&token={encodedToken}";

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
                var duration = (int)(availabilityDto.EndTime - availabilityDto.StartTime).TotalMinutes;
                // validation of StartTime, EndTime is made on Validators folder

                _context.MentorAvailabilities.Add(new MentorAvailability
                {
                    MentorId = mentor.Id,
                    StartTime = availabilityDto.StartTime,
                    EndTime = availabilityDto.EndTime,
                    DurationInMinutes = duration,
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
                    Expires = DateTime.UtcNow.AddHours(3)
                }
            };
        }


   

        


    }
}
