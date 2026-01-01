using LearnTeach.Domain.Interfaceses.Authentication;
using LearnTeach.Infrastructure.Data;
using LearnTeach.Infrastructure.Repository;
using LearnTeach.Infrastructure.Repository.Authentications;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace LearnTeach.Infrastructure.DependancyInjectio
{
    public static class ServiceContainer
    {
        public static IServiceCollection AdddInfrastrutureServics(this IServiceCollection services, IConfiguration configuration)
        {

            #region DatabaseRegestration
            services.AddDbContext<LEANRANDTEACHContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
            #endregion

            #region IAzuerService
            //services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            //services.AddScoped<IAzureService, AzureService>();

            #endregion

            services.AddDbContext<AuthDbContext>(options =>
             options.UseSqlServer(configuration.GetConnectionString("AuthConnection")));

            // Identity Configuration
            //services.AddIdentity<ApplicationUser, IdentityRole>()
            //    .AddEntityFrameworkStores<AuthDbContext>()
            //    .AddDefaultTokenProviders();


            //services.AddDefaultIdentity<ApplicationUser>(options =>
            //{
            //    options.SignIn.RequireConfirmedEmail = true;
            //    options.Tokens.EmailConfirmationTokenProvider = TokenOptions.DefaultEmailProvider;
            //    options.Password.RequireDigit = true;
            //    options.Password.RequiredLength = 8;
            //    options.Password.RequireLowercase = true;
            //    options.Password.RequireUppercase = true;
            //    options.Password.RequireNonAlphanumeric = true;
            //}).AddRoles<IdentityRole>().AddEntityFrameworkStores<AuthDbContext>();


            //services.AddAuthentication(options =>
            //{
            //    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            //    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            //    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            //}).AddJwtBearer(options =>
            //{
            //    options.SaveToken  =true;
            //    options.TokenValidationParameters = new TokenValidationParameters
            //    {
            //        ValidateIssuer = true,
            //        ValidateAudience = true,
            //        ValidateLifetime = true,
            //        ValidateIssuerSigningKey = true,
            //        ValidIssuer = configuration["JWT:Issuer"],
            //        ValidAudience = configuration["JWT:Audience"],
            //        ClockSkew = TimeSpan.Zero,
            //        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Key"]))
            //    };
            //});


            services.AddScoped<IUserManagement, UserManagement>();
            services.AddScoped<IRoleManagement, RoleManagement>();
            services.AddScoped<ITokenManagement, TokenManagement>();









            return services;
        }
    }
}