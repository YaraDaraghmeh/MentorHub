using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentorHup.Migrations
{
    /// <inheritdoc />
    public partial class Add_Image_To_Mentee__Mentor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Mentors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Mentees",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Mentors");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Mentees");
        }
    }
}
