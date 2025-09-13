    using MentorHup.Domain.Entities;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.Extensions.Configuration;

    namespace MentorHup.Infrastructure.Seed
    {
        public static class DefaultRolesSeeder
        {
            private static readonly string[] Roles = new[] { "Mentee", "Mentor", "Admin" };

            public static async Task SeedAsync(
                RoleManager<IdentityRole> roleManager,
                UserManager<ApplicationUser> userManager,
                IConfiguration configuration)
            {
            
                foreach (var role in Roles)
                {
                    if (!await roleManager.RoleExistsAsync(role))
                    {
                        await roleManager.CreateAsync(new IdentityRole(role));
                    }
                }

            
                var adminEmail = configuration["AdminUser:Email"];
                var adminPassword = configuration["AdminUser:Password"];
                var adminRole = configuration["AdminUser:Role"] ?? "Admin";

                if (string.IsNullOrWhiteSpace(adminEmail) || string.IsNullOrWhiteSpace(adminPassword))
                    throw new Exception("AdminUser configuration is missing in appsettings.json");

                var adminUser = await userManager.FindByEmailAsync(adminEmail);
                if (adminUser == null)
                {
                    adminUser = new ApplicationUser
                    {
                        UserName = adminEmail,
                        Email = adminEmail,
                        EmailConfirmed = true
                    };

                    var result = await userManager.CreateAsync(adminUser, adminPassword);
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(adminUser, adminRole);
                    }
                    else
                    {
                        throw new Exception($"Failed to create default Admin user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                    }
                }
            }
        }
    }
