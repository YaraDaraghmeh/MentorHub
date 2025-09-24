using FluentValidation;
using FluentValidation.AspNetCore;
using MentorHup.APPLICATION.Service.Admin;
using MentorHup.APPLICATION.Service.AuthServices;
using MentorHup.APPLICATION.Service.Booking;
using MentorHup.APPLICATION.Service.Conversation;
using MentorHup.APPLICATION.Service.Dashboard.EarningsService;
using MentorHup.APPLICATION.Service.Dashboard.WeeklyService;
using MentorHup.APPLICATION.Service.Mentee;
using MentorHup.APPLICATION.Service.Mentor;
using MentorHup.APPLICATION.Service.Message;
using MentorHup.APPLICATION.Service.Notification;
using MentorHup.APPLICATION.Service.Profile;
using MentorHup.APPLICATION.Service.Review;
using MentorHup.APPLICATION.Service.Strip;
using MentorHup.APPLICATION.Settings;
using MentorHup.Infrastructure.EmailSender;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text;


namespace MentorHup.Extensions
{
    public static partial class ApplicationService
    {


        public static void ConfigureSomeServices(this IServiceCollection services)
        {
            services.AddValidatorsFromAssemblies(new[] { Assembly.GetExecutingAssembly() })
                .AddFluentValidationAutoValidation();

            services.AddScoped<IMenteeAuthService, MenteeAuthService>();
            services.AddScoped<IMentorAuthService, MentorAuthService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IMentorService, MentorService>();
            services.AddScoped<IStripeService, StripeService>();
            services.AddScoped<IBookingService, BookingService>();
            services.AddScoped<IMessageService, MessageService>();
            services.AddScoped<IReviewService, ReviewService>();
            services.AddScoped<IMenteeService, MenteeService>();
            services.AddScoped<IAdminService, AdminService>();
            services.AddScoped<IProfileService, ProfileService>();
            services.AddScoped<IConversationService, ConversationService>();
            services.AddScoped<INotificationService, NotificationService>();

            services.AddTransient<IEmailSender, EmailSender>();
            services.AddScoped<IWeeklyDashboardService, WeeklyDashboardService>();
            services.AddScoped<IEarningsService, EarningsService>();



            // for reset password
            services.Configure<DataProtectionTokenProviderOptions>(opt =>
                opt.TokenLifespan = TimeSpan.FromMinutes(30)); // 30 min then it will expired



            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "User Auth", Version = "v1", Description = "Services to Authenticate user" });


                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Please enter a valid token in the following format: {your token here} do not add the word 'Bearer' before it."
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header,
                        },
                        new List<string>()
                    }
                });
            });

        }


     



        //public static void ConfigureJwt(this IServiceCollection services, IConfiguration configuration)
        //{
        //    var jwtSettings = configuration.GetSection("JwtSettings").Get<JwtSettings>();
        //    if (jwtSettings == null || string.IsNullOrEmpty(jwtSettings.Key))

        //    {
        //        throw new InvalidOperationException("JWT secret key is not configured.");
        //    }

        //    var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key));
        //    services.AddAuthentication(o =>
        //    {
        //        o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        //        o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        //    }).AddJwtBearer(o =>
        //    {
        //        o.TokenValidationParameters = new TokenValidationParameters
        //        {
        //            ValidateIssuer = true,
        //            ValidateAudience = true,
        //            ValidateLifetime = true,
        //            ValidateIssuerSigningKey = true,
        //            ValidIssuer = jwtSettings.ValidIssuer,
        //            ValidAudience = jwtSettings.ValidAudience,
        //            IssuerSigningKey = secretKey
        //        };
        //        o.Events = new JwtBearerEvents
        //        {
        //            OnChallenge = context =>
        //            {
        //                context.HandleResponse();
        //                context.Response.StatusCode = 401;
        //                context.Response.ContentType = "application/json";
        //                var result = System.Text.Json.JsonSerializer.Serialize(new
        //                {
        //                    message = "You are not authorized to access this resource. Please authenticate."
        //                });
        //                return context.Response.WriteAsync(result);
        //            },
        //        };
        //    });
        //}

        // Google Auth + JWT configurations
        public static void ConfigureGoogleAuth(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                var jwtSettings = configuration.GetSection("JwtSettings").Get<JwtSettings>()!;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings.ValidIssuer,
                    ValidAudience = jwtSettings.ValidAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key))
                };
            })
            .AddGoogle(googleOptions =>
            {
                googleOptions.ClientId = configuration["Authentication:Google:ClientId"]!;
                googleOptions.ClientSecret = configuration["Authentication:Google:ClientSecret"]!;
                googleOptions.SignInScheme = IdentityConstants.ExternalScheme; // أو CookieAuthenticationDefaults.AuthenticationScheme
            });
        }



    }
}
