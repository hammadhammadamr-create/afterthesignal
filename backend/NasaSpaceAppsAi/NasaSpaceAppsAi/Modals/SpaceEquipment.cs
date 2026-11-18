namespace NasaSpaceAppsAi.Models
{
    public class SpaceEquipment
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Location { get; set; } // "Moon" or "Mars"
        public string? Status { get; set; }

        // Adult Interface Data
        public string? AdultBriefDescription { get; set; }
        public string? AdultFullDetails { get; set; }
        public string? RealisticImageUrl { get; set; }

        // Kid Interface Data
        public string? KidBriefDescription { get; set; }
        public string? KidExtendedDetails { get; set; }
        public string? CartoonImageUrl { get; set; }

        public SpaceEquipment()
        {
        }
    }
}