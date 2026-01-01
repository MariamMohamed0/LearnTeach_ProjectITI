using LearnTeach.Application.Dtos.PaymentDtos;
using LearnTeach.Application.IServices;
using Microsoft.AspNetCore.Mvc;

namespace LearnTeach.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost("initiate")]
        public async Task<IActionResult> Initiate([FromBody] PaymentInitiateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _paymentService.InitiatePaymentAsync(dto);


                return Ok(new
                {
                    message = "Payment initiated successfully.",
                    data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        [HttpPost("confirm")]
        public async Task<IActionResult> Confirm([FromBody] PaymentConfirmDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _paymentService.ConfirmPaymentAsync(dto);

                return Ok(new
                {
                    message = "Payment confirmed successfully.",
                    data = result
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("history/{userId}")]
        public async Task<IActionResult> GetHistory(int userId)
        {
            try
            {
                var result = await _paymentService.GetPaymentHistoryAsync(userId);

                return Ok(new
                {
                    message = "Payment history retrieved successfully.",
                    data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
