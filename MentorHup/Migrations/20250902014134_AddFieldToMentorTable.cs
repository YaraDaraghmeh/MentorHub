using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentorHup.Migrations
{
    /// <inheritdoc />
    public partial class AddFieldToMentorTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Field",
                table: "Mentors",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Field",
                table: "Mentors");
        }
    }
}
