using AutoMapper;
using LearnTeach.Application.Dtos.PaymentDtos;
using LearnTeach.Application.Helpers;
using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;
using Microsoft.Extensions.Options;
using System.Net.Http.Json;
using System.Text.Json;

namespace LearnTeach.Application.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IRepository<Paymenttransaction> _repository;
        private readonly IRepository<UserPayment> _userPaymentRepository;
        private readonly IMapper _mapper;
        private readonly HttpClient _httpClient;
        private readonly PaymobSettings _settings;

        public PaymentService(
            IRepository<Paymenttransaction> repository,
            IRepository<UserPayment> userPaymentRepository,
            IMapper mapper,
            HttpClient httpClient,
            IOptions<PaymobSettings> settings)
        {
            _repository = repository;
            _userPaymentRepository = userPaymentRepository;
            _mapper = mapper;
            _httpClient = httpClient;
            _settings = settings.Value;
        }

        public async Task<PaymentHistoryDto> InitiatePaymentAsync(PaymentInitiateDto dto)
        {
            try
            {
     
                var authResponse = await _httpClient.PostAsJsonAsync(
                    "https://accept.paymob.com/api/auth/tokens",
                    new { api_key = _settings.ApiKey });

                if (!authResponse.IsSuccessStatusCode)
                {
                    var error = await authResponse.Content.ReadAsStringAsync();
                    throw new Exception($"Auth step failed: {error}");
                }

                var authData = await authResponse.Content.ReadFromJsonAsync<JsonElement>();
                string token = authData.GetProperty("token").GetString();


 
                var orderPayload = new
                {
                    auth_token = token,
                    delivery_needed = false,
                    amount_cents = (int)(dto.Amount * 100),
                    currency = dto.Currency,
                    items = new object[] { }
                };

                var orderResponse = await _httpClient.PostAsJsonAsync(
                    "https://accept.paymob.com/api/ecommerce/orders",
                    orderPayload);

                if (!orderResponse.IsSuccessStatusCode)
                {
                    var error = await orderResponse.Content.ReadAsStringAsync();
                    throw new Exception($"Order step failed: {error}");
                }

                var orderData = await orderResponse.Content.ReadFromJsonAsync<JsonElement>();
                int orderId = orderData.GetProperty("id").GetInt32();


                var paymentKeyPayload = new
                {
                    auth_token = token,
                    amount_cents = (int)(dto.Amount * 100),
                    expiration = 3600,
                    order_id = orderId,
                    billing_data = new
                    {
                        apartment = "NA",
                        email = "customer@example.com",
                        floor = "NA",
                        first_name = "User",
                        last_name = "Test",
                        street = "NA",
                        building = "NA",
                        phone_number = "0000000000",
                        city = "Cairo",
                        country = "EG",
                        state = "Cairo"
                    },
                    currency = dto.Currency,
                    integration_id = int.Parse(_settings.IntegrationId)
                };

                var paymentKeyResponse = await _httpClient.PostAsJsonAsync(
                    "https://accept.paymob.com/api/acceptance/payment_keys",
                    paymentKeyPayload);

                if (!paymentKeyResponse.IsSuccessStatusCode)
                {
                    var error = await paymentKeyResponse.Content.ReadAsStringAsync();
                    throw new Exception($"Payment key step failed: {error}");
                }

                var paymentKeyData = await paymentKeyResponse.Content.ReadFromJsonAsync<JsonElement>();
                string paymentKey = paymentKeyData.GetProperty("token").GetString();


   
                var paymentEntity = _mapper.Map<Paymenttransaction>(dto);
                paymentEntity.Token = paymentKey;
                paymentEntity.Status = "Success Progress";
                paymentEntity.GetwayTransactionId = orderId.ToString();

                await _repository.AddAsync(paymentEntity);
                await _repository.SaveChangesAsync();

                var userPayment = new UserPayment
                {
                    UserId = dto.UserId,
                    PayId = paymentEntity.PayId
                };
                await _userPaymentRepository.AddAsync(userPayment);
                await _userPaymentRepository.SaveChangesAsync();


     
                var result = _mapper.Map<PaymentHistoryDto>(paymentEntity);
                result.PaymentUrl =
                    $"https://accept.paymob.com/api/acceptance/iframes/{_settings.IntegrationId}?payment_token={paymentKey}";

                return result;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException(
                    $"Paymob Payment Failed → {ex.Message}", ex);
            }
        }


        public async Task<PaymentHistoryDto> ConfirmPaymentAsync(PaymentConfirmDto dto)
        {
            var transaction = (await _repository.FindAsync(x => x.GetwayTransactionId == dto.GetwayTransactionId))
                .FirstOrDefault();

            if (transaction == null)
                throw new KeyNotFoundException("Payment transaction not found.");

            transaction.Status = dto.Status;
            transaction.Token = dto.Token;

            _repository.Update(transaction);
            await _repository.SaveChangesAsync();

            return _mapper.Map<PaymentHistoryDto>(transaction);
        }

        public async Task<List<PaymentHistoryDto>> GetPaymentHistoryAsync(int userId)
        {
            var payments = await _userPaymentRepository.FindAsync(x => x.UserId == userId);

            var paymentIds = payments.Select(p => p.PayId).ToList();
            var transactions = await _repository.FindAsync(t => paymentIds.Contains(t.PayId));

            return _mapper.Map<List<PaymentHistoryDto>>(transactions);
        }
    }
}
