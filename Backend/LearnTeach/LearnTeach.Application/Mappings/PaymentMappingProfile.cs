using AutoMapper;
using LearnTeach.Application.Dtos.PaymentDtos;
using LearnTeach.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Mappings
{
    public class PaymentMappingProfile : Profile
    {
        public PaymentMappingProfile()
        {
            CreateMap<Paymenttransaction, PaymentHistoryDto>()
                .ForMember(dest => dest.PayId, opt => opt.MapFrom(src => src.PayId))
                .ForMember(dest => dest.Amount, opt => opt.MapFrom(src => src.Amount))
                .ForMember(dest => dest.Currency, opt => opt.MapFrom(src => src.Currency))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.TransactionDate, opt => opt.MapFrom(src => src.TransactionDate))
                .ForMember(dest => dest.GetwayTransactionId, opt => opt.MapFrom(src => src.GetwayTransactionId));
            CreateMap<PaymentInitiateDto, Paymenttransaction>()
                .ForMember(dest => dest.Amount, opt => opt.MapFrom(src => src.Amount))
                .ForMember(dest => dest.Currency, opt => opt.MapFrom(src => src.Currency))
                .ForMember(dest => dest.Mastercard, opt => opt.MapFrom(src => src.Mastercard))
                .ForMember(dest => dest.Visa, opt => opt.MapFrom(src => src.Visa))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "Pending"))
                .ForMember(dest => dest.TransactionDate, opt => opt.MapFrom(src => DateOnly.FromDateTime(DateTime.Now)));
            CreateMap<UserPayment, UserPaymentDto>().ReverseMap();

            CreateMap<PremiumSubscriber, PremiumSubscriptionDto>()
                .ForMember(dest => dest.Packagename, opt => opt.MapFrom(src => src.Package.Packagename))
                .ForMember(dest => dest.Packageprice, opt => opt.MapFrom(src => src.Package.Packageprice))
                .ForMember(dest => dest.Packageduration, opt => opt.MapFrom(src => src.Package.Packageduration));

            CreateMap<PremiumSubscriptionDto, PremiumSubscriber>();
            CreateMap<PaymentConfirmDto, Paymenttransaction>()
                .ForMember(dest => dest.GetwayTransactionId, opt => opt.MapFrom(src => src.GetwayTransactionId))
                .ForMember(dest => dest.Token, opt => opt.MapFrom(src => src.Token))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status));
        }
    }
}
