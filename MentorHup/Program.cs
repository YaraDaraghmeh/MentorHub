using MentorHup.APPLICATION.Settings;
using MentorHup.Domain.Entities;
using MentorHup.Exceptions;
using MentorHup.Extensions;
using MentorHup.Infrastructure.Context;
using MentorHup.Infrastructure.Hubs;

using MentorHup.Infrastructure.Seed;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddProblemDetails();

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
//var MyAllowSepcificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder.WithOrigins("http://localhost:5175") // frontend HTTP „Õœœ
                      .AllowAnyMethod()
                      .AllowAnyHeader();
        // .AllowCredentials() „⁄ÿ· ·√‰Â frontend HTTP + backend HTTPS
    });
});
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("MentorHupDB"));
});

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 8;

    options.SignIn.RequireConfirmedEmail = true; // Must confirm his/her email after regestration before login


    options.Lockout.AllowedForNewUsers = true; // activate blocking
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromDays(365 * 100); // lifetime blocking
    options.Lockout.MaxFailedAccessAttempts = 5; // max number attempts logining into account before default blocking
})
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();


builder.Services.ConfigureJwt(builder.Configuration);
builder.Services.ConfigureCors();
builder.Services.ConfigureSomeServices();
builder.Services.AddSignalR();
builder.Services.Configure<StripeSettings>(builder.Configuration.GetSection("StripeSettings"));

var app = builder.Build();
//  Seed Roles , Admin
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate(); // ·· Ì ·„  ÿ»ﬁ DB  ·ﬁ«∆Ì« ⁄·Ï «· migrations Â–« ”Ìÿ»ﬁ ﬂ· «·‹ 

    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();

    await DefaultRolesSeeder.SeedAsync(roleManager, userManager, configuration);
}
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.IsProduction() )
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "MentorHub API V1");
        c.RoutePrefix = string.Empty;
    });
}

//app.UseHttpsRedirection();
app.UseExceptionHandler();
app.UseCors("CorsPolicy");
app.UseAuthentication();


app.UseAuthorization();

app.UseStaticFiles(); // allow browser to outline images

app.MapControllers();
app.MapHub<ChatHub>("/chatHub");
app.MapHub<NotificationHub>("/notificationHub");


app.Run();
