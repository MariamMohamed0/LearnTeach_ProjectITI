using LearnTeach.Application.Dtos.MessageDtos;
using LearnTeach.Application.IServices;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailConfiguration _emailconfig;

        public EmailService(IOptions<EmailConfiguration> emailconfig)
        {
            _emailconfig = emailconfig.Value;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress("Learn&Teach", _emailconfig.From));
            emailMessage.To.Add(new MailboxAddress("", toEmail));
            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart(TextFormat.Html) { Text = body };

            using var client = new SmtpClient();
            try
            {
                await client.ConnectAsync(_emailconfig.SwtServer, _emailconfig.Port, true);
                await client.AuthenticateAsync(_emailconfig.Username, _emailconfig.Password);
                await client.SendAsync(emailMessage);
            }
            finally
            {
                await client.DisconnectAsync(true);
                client.Dispose();
            }
        }
    }
}
