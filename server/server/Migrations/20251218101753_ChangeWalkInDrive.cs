using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class ChangeWalkInDrive : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_WalkInDrives_JOId",
                table: "WalkInDrives",
                column: "JOId");

            migrationBuilder.AddForeignKey(
                name: "FK_WalkInDrives_JobOpenings_JOId",
                table: "WalkInDrives",
                column: "JOId",
                principalTable: "JobOpenings",
                principalColumn: "JOId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WalkInDrives_JobOpenings_JOId",
                table: "WalkInDrives");

            migrationBuilder.DropIndex(
                name: "IX_WalkInDrives_JOId",
                table: "WalkInDrives");
        }
    }
}
