using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NasaSpaceAppsAi.Migrations
{
    /// <inheritdoc />
    public partial class AddDetailedEquipmentColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Description",
                table: "SpaceEquipments",
                newName: "RealisticImageUrl");

            migrationBuilder.AddColumn<string>(
                name: "AdultBriefDescription",
                table: "SpaceEquipments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AdultFullDetails",
                table: "SpaceEquipments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CartoonImageUrl",
                table: "SpaceEquipments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "KidBriefDescription",
                table: "SpaceEquipments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "KidExtendedDetails",
                table: "SpaceEquipments",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdultBriefDescription",
                table: "SpaceEquipments");

            migrationBuilder.DropColumn(
                name: "AdultFullDetails",
                table: "SpaceEquipments");

            migrationBuilder.DropColumn(
                name: "CartoonImageUrl",
                table: "SpaceEquipments");

            migrationBuilder.DropColumn(
                name: "KidBriefDescription",
                table: "SpaceEquipments");

            migrationBuilder.DropColumn(
                name: "KidExtendedDetails",
                table: "SpaceEquipments");

            migrationBuilder.RenameColumn(
                name: "RealisticImageUrl",
                table: "SpaceEquipments",
                newName: "Description");
        }
    }
}
