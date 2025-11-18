using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddSelectionEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Selections",
                columns: table => new
                {
                    SelectionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    JOId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    JAId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OLId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SelectionStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Selections", x => x.SelectionId);
                    table.ForeignKey(
                        name: "FK_Selections_JobApplications_JAId",
                        column: x => x.JAId,
                        principalTable: "JobApplications",
                        principalColumn: "JAId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Selections_JobOpenings_JOId",
                        column: x => x.JOId,
                        principalTable: "JobOpenings",
                        principalColumn: "JOId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Selections_OfferLetters_OLId",
                        column: x => x.OLId,
                        principalTable: "OfferLetters",
                        principalColumn: "OLId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Selections_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Selections_JAId_OLId",
                table: "Selections",
                columns: new[] { "JAId", "OLId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Selections_JOId",
                table: "Selections",
                column: "JOId");

            migrationBuilder.CreateIndex(
                name: "IX_Selections_OLId",
                table: "Selections",
                column: "OLId");

            migrationBuilder.CreateIndex(
                name: "IX_Selections_UserId_JOId",
                table: "Selections",
                columns: new[] { "UserId", "JOId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Selections");
        }
    }
}
