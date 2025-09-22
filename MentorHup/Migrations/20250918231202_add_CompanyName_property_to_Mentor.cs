using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentorHup.Migrations
{
    /// <inheritdoc />
    public partial class add_CompanyName_property_to_Mentor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CompanyName",
                table: "Mentors",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompanyName",
                table: "Mentors");
        }
    }
}
