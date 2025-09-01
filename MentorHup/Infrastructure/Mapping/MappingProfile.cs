using AutoMapper;
using MentorHup.APPLICATION.Dtos.Mentee;
using MentorHup.APPLICATION.DTOs.Mentor;
using MentorHup.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace MentorHup.Infrastructure.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<MenteeRegisterRequest, Mentee>()
                .ForMember(dest => dest.ApplicationUserId, opt => opt.Ignore())
                .ForMember(dest => dest.ApplicationUser, opt => opt.Ignore())
                .ForMember(dest => dest.Id, opt => opt.Ignore());

            CreateMap<Mentee, MenteeResponse>()
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.ApplicationUser.Email));

            CreateMap<MenteeUpdateRequest, Mentee>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.ApplicationUserId, opt => opt.Ignore())
                .ForMember(dest => dest.ApplicationUser, opt => opt.Ignore());

            CreateMap<MenteeLoginRequest, ApplicationUser>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.PhoneNumber, opt => opt.Ignore())
                .ForMember(dest => dest.SecurityStamp, opt => opt.Ignore());

            CreateMap<MentorRegisterRequest, Mentor>()
                .ForMember(dest => dest.ApplicationUserId, opt => opt.Ignore())
                .ForMember(dest => dest.ApplicationUser, opt => opt.Ignore())
                .ForMember(dest => dest.Id, opt => opt.Ignore());


            CreateMap<Mentor, MentorResponse>()
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.ApplicationUser.Email))
                 .ForMember(dest => dest.Roles, opt => opt.Ignore())
                .ForMember(dest => dest.Skills, opt => opt.MapFrom(src => src.MentorSkills.Select(ms => ms.Skill.SkillName)));




        }
    }
}
