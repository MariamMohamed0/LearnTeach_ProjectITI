using LearnTeach.Api.Client;
using LearnTeach.Api.Hubs;
using LearnTeach.Api.Mappings;
using LearnTeach.Application.DependancyInjection;
using LearnTeach.Application.Dtos.MessageDtos;
using LearnTeach.Application.Helpers;
using LearnTeach.Application.Hubs;
using LearnTeach.Application.IServices;
using LearnTeach.Application.Mappings;
using LearnTeach.Application.Services;
using LearnTeach.Domain.GenericRepo;
using LearnTeach.Infrastructure.Data;
using LearnTeach.Infrastructure.DataSeed;
using LearnTeach.Infrastructure.DependancyInjectio;
using LearnTeach.Infrastructure.Repository;
using LearnTeach.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

namespace LearnTeach.Api
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            #region DatabaseCreation 
            builder.Services.AddDbContext<LEANRANDTEACHContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
            #endregion

            #region Password 
            builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredLength = 1;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireDigit = false;
                options.User.AllowedUserNameCharacters = null;
            }).AddEntityFrameworkStores<AuthDbContext>().AddDefaultTokenProviders();
            #endregion

            #region JWT Token
            builder.Services.Configure<JWT>(builder.Configuration.GetSection("JWT"));
            //builder.Services.AddAuthentication(options =>
            //{
            //    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            //    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            //    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            //})
            //.AddJwtBearer(o =>
            //{
            //    o.RequireHttpsMetadata = false;
            //    o.SaveToken = false;
            //    o.TokenValidationParameters = new TokenValidationParameters
            //    {
            //        ValidateIssuerSigningKey = true,
            //        ValidateIssuer = true,
            //        ValidateAudience = true,
            //        ValidateLifetime = true,
            //        ValidIssuer = builder.Configuration["JWT:Issuer"],
            //        ValidAudience = builder.Configuration["JWT:Audience"],
            //        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"])),
            //        ClockSkew = TimeSpan.Zero
            //    };
            //});

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
.AddJwtBearer(o =>
{
    o.RequireHttpsMetadata = false;
    o.SaveToken = false;
    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidAudience = builder.Configuration["JWT:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"])
        ),
        ClockSkew = TimeSpan.Zero
    };

    // ✅👉 أضيفي هنا بالضبط
    o.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;

            if (!string.IsNullOrEmpty(accessToken) &&
                path.StartsWithSegments("/chatHub"))
            {
                context.Token = accessToken;
            }

            return Task.CompletedTask;
        }
    };
});

            #endregion

            #region Service Injection
            builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            builder.Services.AddScoped<IReportRepository, ReportRepository>();
            builder.Services.AddScoped<IReportService, ReportService>();
            builder.Services.AddScoped<IAdminReportService, AdminReportService>();
            builder.Services.AddScoped<IAzureService, AzureService>();
            builder.Services.AddScoped<IUserProfileService, UserProfileService>();
            builder.Services.AddScoped<IProjectService, ProjectService>();
            builder.Services.AddScoped<ISocialMediaService, SocialMediaService>();
            builder.Services.AddScoped<IMaterialService, MaterialService>();
            builder.Services.AddScoped<ICategoryService, CategoryService>();
            builder.Services.AddScoped<ISessionService, SessionService>();
            builder.Services.AddScoped<IZoomService, ZoomService>();
            builder.Services.AddScoped<IUserSessionFeedbackService, UserSessionFeedbackService>();
            builder.Services.AddScoped<IUserNationalIdService, UserNationalIdService>();
            builder.Services.AddScoped<IPaymentService, PaymentService>();
            builder.Services.AddScoped<IPackageService, PackageService>();
            builder.Services.AddScoped<IDiamondService, DiamondService>();
            builder.Services.AddScoped<INotificationService, NotificationService>();
            builder.Services.AddScoped<IEmailService, EmailService>();
            builder.Services.AddHostedService<SessionNotificationBackgroundService>();
            builder.Services.AddScoped<ICertificateService, CertificateService>();
            builder.Services.AddScoped<IAdminDiamondService, AdminDiamondService>();
            builder.Services.AddScoped<IDiamondOffersService, DiamondOffersService>();
            builder.Services.AddScoped<IPremiumDashboardService, PremiumDashboardService>();
            builder.Services.AddScoped<ISkillService, SkillService>();
            builder.Services.AddHostedService<SessionFeedbackReminderService>();
            builder.Services.AddScoped<IReportService, ReportService>();
            builder.Services.AddScoped<IAdminReportService, AdminReportService>();
            // ⚡ إضافة Paymob settings
            builder.Services.Configure<PaymobSettings>(builder.Configuration.GetSection("Paymob"));
            #endregion

            #region Mapper
            builder.Services.AddAutoMapper(typeof(AutoMapperProfile));
            builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            builder.Services.AddAutoMapper(typeof(PaymentMappingProfile));
            builder.Services.AddAutoMapper(typeof(DiamondOffersMapping));
            #endregion

            #region CORS
            //builder.Services.AddCors(options =>
            //{
            //    options.AddDefaultPolicy(policy =>
            //    {
            //        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
            //    });
            //});
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.WithOrigins("http://localhost:4200") 
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials(); //signalR
                });
            });

            #endregion

            #region SignalR 
            builder.Services.AddSignalR();
            builder.Services.AddSingleton<IUserIdProvider, ProfileIdUserIdProvider>();
            builder.Services.AddScoped<INotificationService, NotificationService>();
            #endregion

            #region Email Configuration
            builder.Services.Configure<EmailConfiguration>(builder.Configuration.GetSection("EmailConfiguration"));
            #endregion


            #region Firebase Configuration
            builder.Services.AddHttpClient<ChatClient>(client =>
            {
                client.BaseAddress = new Uri("https://learnteachfinal-default-rtdb.europe-west1.firebasedatabase.app/");
            });


            #endregion

            builder.Services.AddHttpContextAccessor();
            builder.Services.AddControllers();
            builder.Services.AddSignalR();
            builder.Services.AddHttpClient();
            builder.Services.AddAuthorization();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AdddInfrastrutureServics(builder.Configuration);
            builder.Services.AddApplicationServices();

            #region Swagger
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "LearnTeachApi", Version = "v1" });

                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "JWT Authorization header using the Bearer scheme."
                });

                c.AddSecurityDefinition("lang", new OpenApiSecurityScheme
                {
                    Name = "lang",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Description = "pass a ar or en"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement {
                    {
                        new OpenApiSecurityScheme {
                            Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                        },
                        new string[] {}
                    }
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement {
                    {
                        new OpenApiSecurityScheme {
                            Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "lang" }
                        },
                        new string[] {}
                    }
                });

                c.MapType<IFormFile>(() => new OpenApiSchema { Type = "string", Format = "binary" });
            });
            #endregion

            builder.Services.AddAuthorization();
            builder.Services.AddAuthentication()
            .AddGoogle(options =>
            {
                options.ClientId = builder.Configuration["Authentication:Google:ClientId"];
                options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
            })
            .AddFacebook(options =>
            {
                options.AppId = builder.Configuration["Authentication:Facebook:AppId"];
                options.AppSecret = builder.Configuration["Authentication:Facebook:AppSecret"];
            });

            builder.Services.AddScoped<IBadgeRepository, BadgeRepository>();
            builder.Services.AddScoped<IBadgeService, BadgeService>();

            var app = builder.Build();

            app.UseDeveloperExceptionPage();

            #region swagger
            if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            #endregion

            //SignalR
            app.MapHub<NotificationHub>("/hubs/notifications");

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapHub<ChatHub>("/chatHub");

            app.MapControllers();

            #region Auth Configuration  
            using (var scope = app.Services.CreateScope())
            {
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                await IdentityDataSeed.SeedRolesAsync(roleManager);
            }
            #endregion

            #region Badge seed
            using (var scope = app.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<LEANRANDTEACHContext>();
                await BadgeSeed.SeedBadgesAsync(context);
            }
            #endregion

            app.Run();
        }
    }
}
