using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebChatEIU.Migrations
{
    /// <inheritdoc />
    public partial class UpdateRoleTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Fullname",
                table: "Roles",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Roles",
                newName: "Description");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Roles",
                newName: "Fullname");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Roles",
                newName: "Email");
        }
    }
}
