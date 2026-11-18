using Microsoft.EntityFrameworkCore;
using NasaSpaceAppsAi.data;

namespace RoboMindAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddOpenApi();
            //builder.Services.AddSwaggerGen();

            // Register HttpClient for calling the Cosmo AI API
            builder.Services.AddHttpClient();

            // 1. CORS Configuration
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

            builder.Services.AddDbContext<NasaSpaceAppsApiContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            var app = builder.Build();

            // Apply EF Core migrations automatically on startup
            using (var scope = app.Services.CreateScope())
            {
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
                try
                {
                    var db = scope.ServiceProvider.GetRequiredService<NasaSpaceAppsApiContext>();
                    db.Database.Migrate();
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Database migration failed");
                }
            }

            // Configure the HTTP request pipeline.
            if(app.Environment.IsDevelopment())
{
                app.MapOpenApi();
            }

            // 2. COMMENT THIS OUT to prevent http -> https redirects blocking CORS on localhost
            // app.UseHttpsRedirection();

            // 3. Keep UseCors right before UseAuthorization
            app.UseCors("AllowAll");
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}