using AutoMapper;
using MentorHup.APPLICATION.Dtos.Mentee;
using MentorHup.Domain.Entities;
using MentorHup.Extensions;
using MentorHup.Infrastructure.Context;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;

namespace MentorHup.APPLICATION.Service.AuthServices
{
    public class MenteeAuthService : IMenteeAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _context;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly IEmailSender emailSender;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IUrlHelper urlHelper;

        public MenteeAuthService(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ApplicationDbContext context,
            ITokenService tokenService,
            IEmailSender emailSender,
            IUrlHelperFactory urlHelperFactory,
            IActionContextAccessor actionContextAccessor,
            IHttpContextAccessor httpContextAccessor,
            IWebHostEnvironment _webHostEnvironment
            )
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
            _tokenService = tokenService;
            this.emailSender = emailSender;
            this.httpContextAccessor = httpContextAccessor;
            this._webHostEnvironment = _webHostEnvironment;
            this.urlHelper = urlHelperFactory.GetUrlHelper(actionContextAccessor.ActionContext!);
        }

        public async Task<MenteeRegisterResult> RegisterAsync(MenteeRegisterRequest request)
        {
            var existing = await _userManager.FindByEmailAsync(request.Email);
            if (existing != null)
                return new MenteeRegisterResult { IsSuccess = false, Errors = new[] { "Email is already registered." } };

            var user = new ApplicationUser
            {
                UserName = request.Name,
                Email = request.Email
            };


            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
                return new MenteeRegisterResult { IsSuccess = false, Errors = result.Errors.Select(e => e.Description).ToArray() };

            if (!await _roleManager.RoleExistsAsync("Mentee"))
                await _roleManager.CreateAsync(new IdentityRole("Mentee"));

            await _userManager.AddToRoleAsync(user, "Mentee");


            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var encodedToken = System.Web.HttpUtility.UrlEncode(token);

            var confirmUrl = urlHelper.Action(
                "ConfirmEmail",       // action name
                "Mentees",               // controller name
                new { userId = user.Id, token = encodedToken },  // route values
                httpContextAccessor.HttpContext.Request.Scheme        // protocol (http/https)
            );


            string email = user.Email;
            string subject = "Welcome to MentorHub – Your Learning Journey Begins";
            string htmlMessage = $@"
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset='UTF-8' />
                </head>
                <body style='font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;'>
                  <div style='max-width:600px;margin:auto;background:#fff;border-radius:10px;padding:30px;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>
                    <h2 style='color:#4f46e5;'>Welcome {user.UserName} to MentorHub 🎉</h2>
                    <p>Hi there,</p>
                    <p>
                      We’re excited to have you on board as a <strong>Mentee</strong>!  
                      MentorHub is here to support you in connecting with experienced mentors, 
                      enhancing your skills, and achieving your career goals.
                    </p>
                    <p>
                      You can now log in to your account, explore mentors, and start your learning journey.
                    </p>
                    <a href='{confirmUrl}' 
                       style='display:inline-block;margin-top:20px;padding:12px 20px;background:#4f46e5;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;'>
                       Confirm Email
                    </a>
                    <div style='margin-top:30px;font-size:13px;color:#6b7280;'>
                      <p>Thank you for joining MentorHub. Let’s grow together 🚀</p>
                      <p>&copy; 2025 MentorHub Team</p>
                    </div>
                  </div>
                </body>
                </html>";

            await emailSender.SendEmailAsync(email, subject, htmlMessage);

            
            var mentee = new MentorHup.Domain.Entities.Mentee
            {
                Name = request.Name,
                Gender = request.Gender,
                ApplicationUserId = user.Id
            };


            var request2 = httpContextAccessor.HttpContext.Request;
            if (request.Image != null && request.Image.Length > 0)
            {
                var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images/mentees");
                Directory.CreateDirectory(uploadsFolder);
                var uniqueFileName = $"{Guid.NewGuid()}_{request.Image.FileName}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using var fileStream = new FileStream(filePath, FileMode.Create);
                await request.Image.CopyToAsync(fileStream);

                var baseUrl = $"{request2.Scheme}://{request2.Host}";
                mentee.ImageUrl = $"{baseUrl}/images/mentees/{uniqueFileName}"; // var mentee = new Mentee must be before this line
            }


            _context.Mentees.Add(mentee);
            await _context.SaveChangesAsync();

            var roles = await _userManager.GetRolesAsync(user);

            return new MenteeRegisterResult
            {
                IsSuccess = true,
                Mentee = new MenteeResponse
                {
                    Id = mentee.Id,
                    Name = mentee.Name,
                    Gender = mentee.Gender,
                    ImageLink = mentee.ImageUrl,
                    Email = user.Email!,
                    AccessToken = token,
                    Roles = roles.ToList(),
                    Expires = DateTime.UtcNow.AddHours(3) 
                }
            };
        }


        public async Task<bool> ConfirmEmailAsync(string userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            var decodedToken = System.Web.HttpUtility.UrlDecode(token);
            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

            return result.Succeeded;
        }

        public async Task<MenteeLoginResult> LoginAsync(MenteeLoginRequest request)
        {
            var user = await _userManager.Users
                .Include(u => u.Mentee)
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
            {
                return new MenteeLoginResult
                {
                    IsSuccess = false,
                    Errors = new[] { "Invalid email or password" }
                };
            }

            if (!await _userManager.IsEmailConfirmedAsync(user))
            {
                return new MenteeLoginResult
                {
                    IsSuccess = false,
                    Errors = new[] { "Please confirm your email before logging in." }
                };
            }

            var token = await _tokenService.CreateTokenAsync(user);
            var roles = await _userManager.GetRolesAsync(user);

            return new MenteeLoginResult
            {
                IsSuccess = true,
                Mentee = new MenteeResponse
                {
                    Id = user.Mentee!.Id,
                    Name = user.Mentee.Name,
                    Gender = user.Mentee.Gender,
                    Email = user.Email!,
                    Roles = roles.ToList() ,
                    AccessToken = token,
                    Expires = DateTime.UtcNow.AddHours(3)
                }
            };
        }

        
    }
}
