using AutoMapper;
using LearnTeach.Application.Dtos.CommentDtos;
using LearnTeach.Application.Dtos.LikeDtos;
using LearnTeach.Application.Dtos.PostDtos;
using LearnTeach.Application.Dtos.ProjectDtos;
using LearnTeach.Application.Dtos.SocialMediaDtos;
using LearnTeach.Application.Dtos.UserProfileDtos;
using LearnTeach.Domain.Models;

namespace LearnTeach.Api.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Usersprofile, UserProfileDto>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.Fname, opt => opt.MapFrom(src => src.Fname))
                .ForMember(dest => dest.Lname, opt => opt.MapFrom(src => src.Lname))
                .ForMember(dest => dest.ProfilePic, opt => opt.MapFrom(src => src.ProfilePic));

            CreateMap<UpdateUserProfileDto, Usersprofile>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<CreateUserProfileDto, Usersprofile>().ReverseMap();
            CreateMap<UpdateUserProfileDto, Usersprofile>().ReverseMap();
            CreateMap<UserProfileDto, Usersprofile>().ReverseMap();

            CreateMap<Project, ProjectDto>().ReverseMap();
            CreateMap<Project, CreateProjectDto>().ReverseMap();
            CreateMap<Project, UpdateProjectDto>().ReverseMap();

            CreateMap<Socialmediaaccount, SocialMediaDto>().ReverseMap();
            CreateMap<Socialmediaaccount, CreateSocialMediaDto>().ReverseMap();
            CreateMap<Socialmediaaccount, UpdateSocialMediaDto>().ReverseMap();
            CreateMap<Post, PostDto>()
               
                .ForMember(dest => dest.SkillName, opt => opt.MapFrom(src =>
                    src.Skill != null ? src.Skill.Name : null))

      
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User))

                .ForMember(dest => dest.Medias, opt => opt.MapFrom(src => src.PostMedias))

     
                .ForMember(dest => dest.TotalLiked, opt => opt.MapFrom(src =>
                    src.Likes != null ? src.Likes.Count : 0))
                .ForMember(dest => dest.TotalComments, opt => opt.MapFrom(src =>
                    src.Comments != null ? src.Comments.Count : 0));

            CreateMap<Postmedia, PostMediaDto>().ReverseMap();

            CreateMap<CreatePostDto, Post>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))  
                .ForMember(dest => dest.TotalLiked, opt => opt.MapFrom(_ => 0))
                .ForMember(dest => dest.TotalComments, opt => opt.MapFrom(_ => 0))
                .ForMember(dest => dest.PostMedias, opt => opt.MapFrom(src => src.Medias))
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))  
                .ForMember(dest => dest.categoryId, opt => opt.MapFrom(src => src.categoryId));  

            CreateMap<UpdatePostDto, Post>()
             .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())  
             .ForMember(dest => dest.TotalLiked, opt => opt.Ignore()) 
             .ForMember(dest => dest.TotalComments, opt => opt.Ignore())
             //.ForMember(dest => dest.PostMedias, opt => opt.MapFrom(src => src.Medias))  
             .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));  
                                                                                                 

            CreateMap<Comment, CommentDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src =>
                    src.User != null ? src.User.Fname + " " + src.User.Lname : null));

            CreateMap<CreateCommentDto, Comment>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));

            CreateMap<UpdateCommentDto, Comment>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<Like, LikeDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src =>
                    src.User != null ? src.User.Fname + " " + src.User.Lname : null));
        }
    }
}





