using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddHRInterviewEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HRInterviews",
                columns: table => new
                {
                    HIId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    JOId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    JAId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MeetingSubject = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HRDate = table.Column<DateOnly>(type: "date", nullable: false),
                    HRTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    MeetingLink = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GoogleEventId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InterviewerName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InterviewerEmail = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    NoOfRound = table.Column<int>(type: "int", nullable: false),
                    HRIsClear = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HRStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HRFeedback = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HRRating = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HRInterviews", x => x.HIId);
                    table.ForeignKey(
                        name: "FK_HRInterviews_JobApplications_JAId",
                        column: x => x.JAId,
                        principalTable: "JobApplications",
                        principalColumn: "JAId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HRInterviews_JobOpenings_JOId",
                        column: x => x.JOId,
                        principalTable: "JobOpenings",
                        principalColumn: "JOId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_HRInterviews_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HRInterviews_InterviewerEmail",
                table: "HRInterviews",
                column: "InterviewerEmail");

            migrationBuilder.CreateIndex(
                name: "IX_HRInterviews_JAId_NoOfRound",
                table: "HRInterviews",
                columns: new[] { "JAId", "NoOfRound" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_HRInterviews_JOId",
                table: "HRInterviews",
                column: "JOId");

            migrationBuilder.CreateIndex(
                name: "IX_HRInterviews_UserId",
                table: "HRInterviews",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HRInterviews");
        }
    }
}
