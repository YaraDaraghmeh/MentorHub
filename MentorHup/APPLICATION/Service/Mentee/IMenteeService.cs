using MentorHup.APPLICATION.Dtos.Mentee;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace MentorHup.APPLICATION.Service.Mentee
{
    public interface IMenteeService
    {
        Task<bool> UpdateAsync(MenteeUpdateRequest request);

    }
}
