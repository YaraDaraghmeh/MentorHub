using AutoMapper;
using MentorHup.APPLICATION.Dtos.Mentee;
using MentorHup.Domain.Entities;
using MentorHup.Infrastructure.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MentorHup.APPLICATION.Service.AuthServices
{
    public class MenteeAuthService : IMenteeAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _context;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public MenteeAuthService(
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

        public async Task<MenteeRegisterResult> RegisterAsync(MenteeRegisterRequest request)
        {
            var existing = await _userManager.FindByEmailAsync(request.Email);
            if (existing != null)
                return new MenteeRegisterResult { IsSuccess = false, Errors = new[] { "Email is already registered." } };

            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
                return new MenteeRegisterResult { IsSuccess = false, Errors = result.Errors.Select(e => e.Description).ToArray() };

            if (!await _roleManager.RoleExistsAsync("Mentee"))
                await _roleManager.CreateAsync(new IdentityRole("Mentee"));

            await _userManager.AddToRoleAsync(user, "Mentee");
            
            var mentee = new Mentee
            {
                Name = request.Name,
                Gender = request.Gender,
                ApplicationUserId = user.Id
            };

            _context.Mentees.Add(mentee);
            await _context.SaveChangesAsync();

            var token = await _tokenService.CreateTokenAsync(user);
            var roles = await _userManager.GetRolesAsync(user);

            return new MenteeRegisterResult
            {
                IsSuccess = true,
                Mentee = new MenteeResponse
                {
                    Id = mentee.Id,
                    Name = mentee.Name,
                    Gender = mentee.Gender,
                    Email = user.Email!,
                    AccessToken = token,
                    Roles = roles.ToList(),
                    Expires = DateTime.UtcNow.AddHours(3) 
                }
            };
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
