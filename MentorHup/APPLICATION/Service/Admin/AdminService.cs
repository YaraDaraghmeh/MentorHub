using MentorHup.APPLICATION.Common;
using MentorHup.APPLICATION.DTOs.Admin;
using MentorHup.APPLICATION.DTOs.Mentee;
using MentorHup.APPLICATION.DTOs.Mentor;
using MentorHup.APPLICATION.DTOs.Skill;
using MentorHup.APPLICATION.Service.Mentor;
using MentorHup.Domain.Entities;
using MentorHup.Infrastructure.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MentorHup.APPLICATION.Service.Admin
{
    public class AdminService : IAdminService
    {
        readonly IMentorService mentorService;
        readonly ApplicationDbContext dbContext;
        private readonly UserManager<ApplicationUser> userManager;

        public AdminService(IMentorService mentorService, ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            this.mentorService = mentorService;
            this.dbContext = dbContext;
            this.userManager = userManager;
        }

        public async Task<PageResult<MentorOverviewDto>> GetAllMentorsAsync(int pageSize, int pageNumber, string? field, string? skillName, decimal? minPrice, decimal? maxPrice, int? Experiences)
        {
            return await mentorService.GetAllMentorsAsync(pageSize, pageNumber, field, skillName, minPrice, maxPrice, Experiences);
        }


        public async Task<PageResult<MenteeOverviewDto>> GetAllMenteesAsync(int pageSize, int pageNumber, string? name, string? gender)
        {
            var query = dbContext.Mentees // Note: Here we can add Include(m => m.ApplicationUser) then we execlude the mentees who own IsDeleted = true, (Review ApplicationDbContext line 123)
                .Include(m => m.Bookings)
                .AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(name))
                query = query.Where(m => m.Name.Contains(name));

            if (!string.IsNullOrWhiteSpace(gender))
                query = query.Where(m => m.Gender.Contains(gender));

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(m => new MenteeOverviewDto
                {
                    Id = m.Id,
                    Name = m.Name,
                    Gender = m.Gender,
                    CreatedAt = m.ApplicationUser.CreatedAt,
                })
                .ToListAsync();

            return new PageResult<MenteeOverviewDto>(items, totalCount, pageSize, pageNumber);
        }


        public async Task<bool> SoftDeleteUserAsync(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null) return false;

            user.IsDeleted = true;
            await userManager.UpdateAsync(user);

            return true;
        }

        public async Task<bool> RestoreUserAsync(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null) return false;

            user.IsDeleted = false;
            await userManager.UpdateAsync(user);

            return true;
        }

        public async Task<bool> BlockUserAsync(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null) return false;

            // note: the configuration in Program.cs (enabling lockout was made)
            await userManager.SetLockoutEndDateAsync(user, DateTimeOffset.MaxValue);
            return true;
        }

        public async Task<bool> UnblockUserAsync(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null) return false;

            await userManager.SetLockoutEndDateAsync(user, null);
            return true;
        }




        public async Task<AdminSkillResponse> AddSkillAsync(AdminSkillRequest adminSkillRequest)
        {
            var skillExist = await dbContext.Skills
                .FirstOrDefaultAsync(sk => sk.SkillName == adminSkillRequest.SkillName);

            if (skillExist != null)
                return new AdminSkillResponse
                {
                    Success = false,
                    Message = "Skill already exists"
                };

            var skill = new Skill
            {
                SkillName = adminSkillRequest.SkillName,
            };

            await dbContext.Skills.AddAsync(skill);
            await dbContext.SaveChangesAsync();

            return new AdminSkillResponse { Success = true, Id = skill.Id, SkillName = skill.SkillName, Message = "Skill added successfully" };
        }



        public async Task<PageResult<SkillsResponse>> GetAllSkillsAsync(int pageSize, int pageNumber, string? name)
        {
            var query = dbContext.Skills.AsNoTracking().AsQueryable();
            if (!string.IsNullOrWhiteSpace(name))
                query = query.Where(s => s.SkillName.Contains(name));

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(s => new SkillsResponse
                {
                    Id = s.Id,
                    Name = s.SkillName,
                })
                .ToListAsync();
            return new PageResult<SkillsResponse>(items, totalCount, pageSize, pageNumber);
        }


        public async Task<SkillResponse> GetSkillByIdAsync(int id)
        {
            var skill = await dbContext.Skills.FindAsync(id);
            if (skill == null)
                return new SkillResponse
                {
                    Id = skill.Id,
                    SkillName = skill.SkillName,
                    Exist = false
                };

            return new SkillResponse
            {
                Id = skill.Id,
                SkillName = skill.SkillName,
                Exist = true
            };

        }

        public async Task<Skill?> UpdateSkillAsync(int id, AdminSkillRequest request)
        {
            var skill = await dbContext.Skills.FindAsync(id);

            if (skill == null)
                return null;

            skill.SkillName = request.SkillName;

            dbContext.Skills.Update(skill);
            await dbContext.SaveChangesAsync();

            return skill;
        }


        public async Task<bool> DeleteSkillAsync(int id)
        {
            var skill = await dbContext.Skills.FindAsync(id);

            if (skill == null)
                return false;

            dbContext.Skills.Remove(skill);
            await dbContext.SaveChangesAsync();

            return true;
        }


        public async Task<AdminDashboardStats> GetDashboardStatisticsAsync()
        {
            var now = DateTime.UtcNow;
            var monthStart = new DateTime(now.Year, now.Month, 1);

            // Users
            var totalMentors = await dbContext.Mentors.CountAsync();
            var totalMentees = await dbContext.Mentees.CountAsync();
            var activeUsers = await dbContext.Users.CountAsync(u => !u.IsDeleted);
            //var deactiveUsers = await dbContext.Users.CountAsync(u => u.IsDeleted); فقط يعرض النشطين ApplicationDbContext مش رح يتم تطبيقها دايما رح تطلع صفر لاني انا عامل بال
            var blockedUsers = await dbContext.Users.CountAsync(u => u.LockoutEnd.HasValue && u.LockoutEnd.Value > DateTimeOffset.UtcNow);
            var emailNotConfirmed = await dbContext.Users.CountAsync(u => !u.EmailConfirmed);

            // Bookings
            var totalBookings = await dbContext.Bookings.CountAsync();
            var confirmedBookings = await dbContext.Bookings.CountAsync(b => b.Status == BookingStatus.Confirmed);
            var cancelledBookings = await dbContext.Bookings.CountAsync(b => b.Status == BookingStatus.Cancelled);

            // Reviews
            var totalReviews = await dbContext.Bookings.CountAsync(b => b.Review != null); // OR: var totalReviews = await dbContext.Reviews.CountAsync();

            // Payments
            var totalPayments = await dbContext.Bookings.Where(b => b.Status == BookingStatus.Completed).SumAsync(b => b.Amount);
            var pendingPayments = await dbContext.Bookings.Where(b => b.Status == BookingStatus.Pending).SumAsync(b => b.Amount);
            var averagePayment = confirmedBookings > 0 ? totalPayments / confirmedBookings : 0;


            var mentorIdsWithBookings = await dbContext.Bookings.Select(b => b.MentorId).Distinct().ToListAsync();
            var mentorsWithNoBookings = await dbContext.Mentors.CountAsync(m => !mentorIdsWithBookings.Contains(m.Id));


            var newUsersThisMonth = await dbContext.Users
                .CountAsync(u => u.CreatedAt >= monthStart);

            return new AdminDashboardStats
            {
                TotalMentors = totalMentors,
                TotalMentees = totalMentees,
                ActiveUsers = activeUsers,
                //DeactiveUsers = deactiveUsers, يعرض فقط النشطين ApplicationDbContext دايما رح تطلع صفر عشان رابطها بال
                BlockedUsers = blockedUsers,
                EmailNotConfirmed = emailNotConfirmed,
                TotalBookings = totalBookings,
                ConfirmedBookings = confirmedBookings,
                CancelledBookings = cancelledBookings,
                TotalReviews = totalReviews,
                TotalPayments = totalPayments,
                PendingPayments = pendingPayments,
                AveragePayment = averagePayment,
                MentorsWithNoBookings = mentorsWithNoBookings,
                NewUsersThisMonth = newUsersThisMonth
            };

        }
    }
}
