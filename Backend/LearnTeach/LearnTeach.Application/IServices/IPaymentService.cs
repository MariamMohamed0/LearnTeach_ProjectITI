using LearnTeach.Application.Dtos.PaymentDtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LearnTeach.Application.IServices
{
    public interface IPaymentService
    {
        Task<PaymentHistoryDto> InitiatePaymentAsync(PaymentInitiateDto dto);
        Task<PaymentHistoryDto> ConfirmPaymentAsync(PaymentConfirmDto dto);
        Task<List<PaymentHistoryDto>> GetPaymentHistoryAsync(int userId);
    }
}
