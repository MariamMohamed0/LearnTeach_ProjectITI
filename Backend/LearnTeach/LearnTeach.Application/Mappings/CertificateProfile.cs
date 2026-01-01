using AutoMapper;
using LearnTeach.Application.Dtos;
using LearnTeach.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Mapping
{
    public class CertificateProfile:Profile
    {
        public CertificateProfile()
        {
            CreateMap<Certificate, CertificateDto>().ReverseMap();

            CreateMap<CertificateUpdateDto, Certificate>()
                .ForMember(dest => dest.Cerid, opt => opt.Ignore())
                .ForMember(dest => dest.Cerpic, opt => opt.Ignore());
        }
       
    }
}
