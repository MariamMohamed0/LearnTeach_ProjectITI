using AutoMapper;
using LearnTeach.Application.Dtos.DiamondOffersDtos;
using LearnTeach.Domain.Models;

namespace LearnTeach.Application.Mappings
{
    public class DiamondOffersMapping : Profile
    {
        public DiamondOffersMapping()
        {
            CreateMap<DiamondPackage, DiamondOffersPackageDto>().ReverseMap();
            CreateMap<CreateDiamondOffersPackageDto, DiamondPackage>();
            CreateMap<UpdateDiamondOffersPackageDto, DiamondPackage>();


        }
    }
}
