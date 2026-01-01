using AutoMapper;
using LearnTeach.Application.Dtos.PackageDtos;
using LearnTeach.Domain.Models;

namespace LearnTeach.Application.MappingProfiles
{
    public class PackageProfile : Profile
    {
        public PackageProfile()
        {
            CreateMap<Package, PackageDto>()
                .ForMember(dest => dest.PackageId, opt => opt.MapFrom(src => src.Packageid))
                .ForMember(dest => dest.PackageName, opt => opt.MapFrom(src => src.Packagename))
                .ForMember(dest => dest.PackageDetails, opt => opt.MapFrom(src => src.Packagedetails))
                .ForMember(dest => dest.PackageDuration, opt => opt.MapFrom(src => src.Packageduration))
                .ForMember(dest => dest.DiamondPoints, opt => opt.MapFrom(src => src.Diamondpoints))
                .ForMember(dest => dest.PackagePrice, opt => opt.MapFrom(src => src.Packageprice))
                .ReverseMap();
            CreateMap<CreatePackageDto, Package>()
                .ForMember(dest => dest.Packagename, opt => opt.MapFrom(src => src.PackageName))
                .ForMember(dest => dest.Packagedetails, opt => opt.MapFrom(src => src.PackageDetails))
                .ForMember(dest => dest.Packageduration, opt => opt.MapFrom(src => src.PackageDuration))
                .ForMember(dest => dest.Diamondpoints, opt => opt.MapFrom(src => src.DiamondPoints))
                .ForMember(dest => dest.Packageprice, opt => opt.MapFrom(src => src.PackagePrice));

            CreateMap<UpdatePackageDto, Package>()
                .ForMember(dest => dest.Packagename, opt => opt.MapFrom(src => src.PackageName))
                .ForMember(dest => dest.Packagedetails, opt => opt.MapFrom(src => src.PackageDetails))
                .ForMember(dest => dest.Packageduration, opt => opt.MapFrom(src => src.PackageDuration))
                .ForMember(dest => dest.Diamondpoints, opt => opt.MapFrom(src => src.DiamondPoints))
                .ForMember(dest => dest.Packageprice, opt => opt.MapFrom(src => src.PackagePrice));
        }
    }

}