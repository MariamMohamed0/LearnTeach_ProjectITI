using AutoMapper;
using LearnTeach.Application.Dtos.AuthDtos;
using LearnTeach.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Mapping
{
    internal class MapConfig:Profile
    {
        public MapConfig()
        {
            CreateMap<ApplicationUser,RegisterUserDTO>().ReverseMap();
            CreateMap<ApplicationUser,LoginUserDTO>().ReverseMap();

        }
    }
}
