using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentorHup.Migrations
{
    /// <inheritdoc />
    public partial class add_CVUrl_property_to_Mentor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CVUrl",
                table: "Mentors",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CVUrl",
                table: "Mentors");
        }
    }
}
