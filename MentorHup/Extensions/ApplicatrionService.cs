using FluentValidation;
using FluentValidation.AspNetCore;
using MentorHup.APPLICATION.Service;
using MentorHup.APPLICATION.Service.AuthServices;
using MentorHup.APPLICATION.Service.Booking;
using MentorHup.APPLICATION.Service.Mentor;
using MentorHup.APPLICATION.Service.Message;
using MentorHup.APPLICATION.Service.Review;
using MentorHup.APPLICATION.Service.Strip;
using MentorHup.APPLICATION.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text;


namespace MentorHup.Extensions
{
    public static partial class ApplicatrionService
    {

        public static void ConfigureCors(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", builder =>
                {
                    builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                });
            });
        }
        public static void ConfigureSomeServices(this IServiceCollection services)
        {
            services.AddAutoMapper(cfg => { }, Assembly.GetExecutingAssembly());
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

            services.AddTransient<IEmailSender, EmailSender>();

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


     



        public static void ConfigureJwt(this IServiceCollection services, IConfiguration configuration)
        {
            var jwtSettings = configuration.GetSection("JwtSettings").Get<JwtSettings>();
            if (jwtSettings == null || string.IsNullOrEmpty(jwtSettings.Key))

            {
                throw new InvalidOperationException("JWT secret key is not configured.");
            }

            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key));
            services.AddAuthentication(o =>
            {
                o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(o =>
            {
                o.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings.ValidIssuer,
                    ValidAudience = jwtSettings.ValidAudience,
                    IssuerSigningKey = secretKey
                };
                o.Events = new JwtBearerEvents
                {
                    OnChallenge = context =>
                    {
                        context.HandleResponse();
                        context.Response.StatusCode = 401;
                        context.Response.ContentType = "application/json";
                        var result = System.Text.Json.JsonSerializer.Serialize(new
                        {
                            message = "You are not authorized to access this resource. Please authenticate."
                        });
                        return context.Response.WriteAsync(result);
                    },
                };
            });

        }
    }
}
