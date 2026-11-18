using Microsoft.EntityFrameworkCore;
using NasaSpaceAppsAi.Models;

namespace NasaSpaceAppsAi.data
{
    public class NasaSpaceAppsApiContext : DbContext
    {
        public NasaSpaceAppsApiContext(DbContextOptions<NasaSpaceAppsApiContext> options)
            : base(options)
        {
        }

        public DbSet<Users> Users { get; set; }

        public DbSet<SpaceEquipment> SpaceEquipments { get; set; }
    }
}