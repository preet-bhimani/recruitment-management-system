using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddTechnicalInterviewEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GoogleIntegrationSettings",
                columns: table => new
                {
                    GoogleSettingId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RefreshToken = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GoogleIntegrationSettings", x => x.GoogleSettingId);
                });

            migrationBuilder.CreateTable(
                name: "TechnicalInterviews",
                columns: table => new
                {
                    TIId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    JOId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    JAId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MeetingSubject = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TechDate = table.Column<DateOnly>(type: "date", nullable: false),
                    TechTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    MeetingLink = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InterviewerName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InterviewerEmail = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    NoOfRound = table.Column<int>(type: "int", nullable: false),
                    TechIsClear = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TechStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TechFeedback = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TechRating = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TechnicalInterviews", x => x.TIId);
                    table.ForeignKey(
                        name: "FK_TechnicalInterviews_JobApplications_JAId",
                        column: x => x.JAId,
                        principalTable: "JobApplications",
                        principalColumn: "JAId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TechnicalInterviews_JobOpenings_JOId",
                        column: x => x.JOId,
                        principalTable: "JobOpenings",
                        principalColumn: "JOId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TechnicalInterviews_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TechnicalInterviews_InterviewerEmail",
                table: "TechnicalInterviews",
                column: "InterviewerEmail");

            migrationBuilder.CreateIndex(
                name: "IX_TechnicalInterviews_JAId_NoOfRound",
                table: "TechnicalInterviews",
                columns: new[] { "JAId", "NoOfRound" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TechnicalInterviews_JOId",
                table: "TechnicalInterviews",
                column: "JOId");

            migrationBuilder.CreateIndex(
                name: "IX_TechnicalInterviews_UserId",
                table: "TechnicalInterviews",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GoogleIntegrationSettings");

            migrationBuilder.DropTable(
                name: "TechnicalInterviews");
        }
    }
}
