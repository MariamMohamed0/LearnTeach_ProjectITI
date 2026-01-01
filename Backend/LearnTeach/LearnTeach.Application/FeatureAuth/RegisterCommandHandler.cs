using LearnTeach.Application.IServices;
using LearnTeach.Infrastructure.Data;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.FeatureAuth
{
        public class RegisterCommandHandler : IRequestHandler<RegisterCommand, string>
        {
            private readonly UserManager<ApplicationUser> _userManager;
       

        private readonly IEmailService _emailService;

            public RegisterCommandHandler(
                UserManager<ApplicationUser> userManager,
                IEmailService emailService)
            {
                _userManager = userManager;
                _emailService = emailService;
            }

            public async Task<string> Handle(RegisterCommand request, CancellationToken cancellationToken)
            {
                var user = new ApplicationUser
                {
                    UserName = request.UserName,
                    Email = request.Email
                };

                var result = await _userManager.CreateAsync(user, request.Password);

                if (!result.Succeeded)
                {
                    return string.Join(", ", result.Errors.Select(e => e.Description));
                }

            await _emailService.SendEmailAsync(user.Email, "Welcome", $"Hello {request.UserName}, your account has been created successfully.");
            return "User Registered Successfully";
            }
        }
    }
