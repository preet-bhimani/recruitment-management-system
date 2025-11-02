using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddCampusdriveTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CDID",
                table: "Users");

            migrationBuilder.AddColumn<Guid>(
                name: "CDID",
                table: "Users",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CampusDrives",
                columns: table => new
                {
                    CDID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UniversityName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    JOId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DriveDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CampusDrives", x => x.CDID);
                    table.ForeignKey(
                        name: "FK_CampusDrives_JobOpenings_JOId",
                        column: x => x.JOId,
                        principalTable: "JobOpenings",
                        principalColumn: "JOId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_CDID",
                table: "Users",
                column: "CDID");

            migrationBuilder.CreateIndex(
                name: "IX_CampusDrives_JOId",
                table: "CampusDrives",
                column: "JOId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_CampusDrives_CDID",
                table: "Users",
                column: "CDID",
                principalTable: "CampusDrives",
                principalColumn: "CDID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_CampusDrives_CDID",
                table: "Users");

            migrationBuilder.DropTable(
                name: "CampusDrives");

            migrationBuilder.DropColumn(
                name: "CDID",
                table: "Users");

            migrationBuilder.AddColumn<int>(
                name: "CDID",
                table: "Users",
                type: "int",
                nullable: true);
        }
    }
}
