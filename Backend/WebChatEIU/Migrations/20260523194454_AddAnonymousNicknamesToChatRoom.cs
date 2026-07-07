using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebChatEIU.Migrations
{
    /// <inheritdoc />
    public partial class AddAnonymousNicknamesToChatRoom : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "User1Nickname",
                table: "ChatRooms",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "User2Nickname",
                table: "ChatRooms",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "User1Nickname",
                table: "ChatRooms");

            migrationBuilder.DropColumn(
                name: "User2Nickname",
                table: "ChatRooms");
        }
    }
}
