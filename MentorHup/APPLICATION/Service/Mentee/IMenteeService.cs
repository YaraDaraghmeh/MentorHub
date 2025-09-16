using MentorHup.APPLICATION.Dtos.Mentee;

namespace MentorHup.APPLICATION.Service.Mentee
{
    public interface IMenteeService
    {
        Task<bool> UpdateAsync(MenteeUpdateRequest request);

    }
}
