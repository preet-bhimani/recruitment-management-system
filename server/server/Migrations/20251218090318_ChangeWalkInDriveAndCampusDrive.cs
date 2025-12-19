using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class ChangeWalkInDriveAndCampusDrive : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_CampusDrives_CDID",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_CDID",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CDID",
                table: "Users");

            migrationBuilder.AddColumn<Guid>(
                name: "CDID",
                table: "JobApplications",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "WalkId",
                table: "JobApplications",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "WalkInDrives",
                columns: table => new
                {
                    WalkId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JOId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DriveDate = table.Column<DateOnly>(type: "date", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WalkInDrives", x => x.WalkId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_JobApplications_CDID",
                table: "JobApplications",
                column: "CDID");

            migrationBuilder.CreateIndex(
                name: "IX_JobApplications_WalkId",
                table: "JobApplications",
                column: "WalkId");

            migrationBuilder.AddForeignKey(
                name: "FK_JobApplications_CampusDrives_CDID",
                table: "JobApplications",
                column: "CDID",
                principalTable: "CampusDrives",
                principalColumn: "CDID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_JobApplications_WalkInDrives_WalkId",
                table: "JobApplications",
                column: "WalkId",
                principalTable: "WalkInDrives",
                principalColumn: "WalkId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobApplications_CampusDrives_CDID",
                table: "JobApplications");

            migrationBuilder.DropForeignKey(
                name: "FK_JobApplications_WalkInDrives_WalkId",
                table: "JobApplications");

            migrationBuilder.DropTable(
                name: "WalkInDrives");

            migrationBuilder.DropIndex(
                name: "IX_JobApplications_CDID",
                table: "JobApplications");

            migrationBuilder.DropIndex(
                name: "IX_JobApplications_WalkId",
                table: "JobApplications");

            migrationBuilder.DropColumn(
                name: "CDID",
                table: "JobApplications");

            migrationBuilder.DropColumn(
                name: "WalkId",
                table: "JobApplications");

            migrationBuilder.AddColumn<Guid>(
                name: "CDID",
                table: "Users",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_CDID",
                table: "Users",
                column: "CDID");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_CampusDrives_CDID",
                table: "Users",
                column: "CDID",
                principalTable: "CampusDrives",
                principalColumn: "CDID");
        }
    }
}
