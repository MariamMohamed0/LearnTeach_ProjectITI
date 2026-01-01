using LearnTeach.Application.Mapping;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.DependencyInjection;




namespace LearnTeach.Application.DependancyInjection
{
    public static class ServiceContainer
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddAutoMapper(typeof(MapConfig));
            services.AddScoped<IServices.IAuthenticationService, LearnTeach.Infrastructure.Services.Authentications.AuthenticationService>();


            return services;
        }
    }
}
