using MentorHup.APPLICATION.Dtos.Mentee;
using MentorHup.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MentorHup.APPLICATION.Service.Mentee
{
    public class MenteeService(ApplicationDbContext _context, IHttpContextAccessor httpContextAccessor, IWebHostEnvironment _webHostEnvironment) :IMenteeService
    {
        public async Task<bool> UpdateAsync(MenteeUpdateRequest request)
        {
            var userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _context.Users
                .Include(u => u.Mentee)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null || user.Mentee == null)
                return false;

            var mentee = user.Mentee;

            if (!string.IsNullOrEmpty(request.Name))
                mentee.Name = request.Name;

            if (!string.IsNullOrEmpty(request.Gender))
                mentee.Gender = request.Gender;

            if (request.ImageForm != null && request.ImageForm.Length > 0)
            {
                var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images/mentees");
                Directory.CreateDirectory(uploadsFolder);

                // delete old image on server (if exist)
                if (!string.IsNullOrEmpty(mentee.ImageUrl))
                {
                    var oldFileName = Path.GetFileName(new Uri(mentee.ImageUrl).LocalPath);
                    var oldFilePath = Path.Combine(uploadsFolder, oldFileName);
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

                var uniqueFileName = $"{Guid.NewGuid()}_{request.ImageForm.FileName}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using var fileStream = new FileStream(filePath, FileMode.Create);
                await request.ImageForm.CopyToAsync(fileStream);


                var baseUrl = $"{httpContextAccessor.HttpContext.Request.Scheme}://{httpContextAccessor.HttpContext.Request.Host}";
                mentee.ImageUrl = $"{baseUrl}/images/mentees/{uniqueFileName}";
            }

            await _context.SaveChangesAsync();
            return true;
        }

    }
}
