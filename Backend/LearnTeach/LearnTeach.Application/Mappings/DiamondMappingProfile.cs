using AutoMapper;
using LearnTeach.Application.Dtos.DiamondDtos;
using LearnTeach.Application.Dtos.DiamondOffersDtos;
using LearnTeach.Domain.Models;

namespace LearnTeach.Application.Mappings
{
    public class DiamondMappingProfile : Profile
    {
        public DiamondMappingProfile()
        {
            CreateMap<Diamond, DiamondDto>()
                .ForMember(dest => dest.LastUpdated, opt => opt.MapFrom(src => src.LastUpdated))
                .ForMember(dest => dest.TotalPoints, opt => opt.MapFrom(src => src.TotalPoints))
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId));

            CreateMap<DiamondTransaction, Dtos.DiamondDtos.DiamondTransactionDto>()
                .ForMember(dest => dest.TransactionId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.TransactionDate, opt => opt.MapFrom(src => src.Date))
                .ForMember(dest => dest.PointsChanged, opt => opt.MapFrom(src => src.PointsChanged))
                .ForMember(dest => dest.Reason, opt => opt.MapFrom(src => src.Reason));


            CreateMap<AddPointsDto, DiamondTransaction>()
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => DateTime.Now));

            CreateMap<DeductPointsDto, DiamondTransaction>()
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => DateTime.Now));

            CreateMap<AddDiamondPackageDto, DiamondPackage>()
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.DiamondAmount, opt => opt.MapFrom(src => src.DiamondAmount))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
                .ForMember(dest => dest.Currency, opt => opt.MapFrom(src => src.Currency));

            CreateMap<UpdateDiamondPackageDto, DiamondPackage>()
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.DiamondAmount, opt => opt.MapFrom(src => src.DiamondAmount))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
                .ForMember(dest => dest.Currency, opt => opt.MapFrom(src => src.Currency));


            CreateMap<DiamondPackage, DiamondPackageDto>()
                .ForMember(dest => dest.DiamondPackageId, opt => opt.MapFrom(src => src.DiamondPackageId))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.DiamondAmount, opt => opt.MapFrom(src => src.DiamondAmount))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
                .ForMember(dest => dest.Currency, opt => opt.MapFrom(src => src.Currency));

            CreateMap<PurchaseDiamondPackageDto, UserDiamondPackage>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.DiamondPackageId, opt => opt.MapFrom(src => src.DiamondPackageId))
                .ForMember(dest => dest.PurchasedAt, opt => opt.MapFrom(src => DateTime.Now));


        }
    }
}
