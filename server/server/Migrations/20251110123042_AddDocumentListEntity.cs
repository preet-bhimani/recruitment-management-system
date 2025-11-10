using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddDocumentListEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DocumentLists",
                columns: table => new
                {
                    DLId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    JOId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    JAId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AadharCard = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PANCard = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExperienceLetter = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BankAccNo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BankIFSC = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BankName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocumentLists", x => x.DLId);
                    table.ForeignKey(
                        name: "FK_DocumentLists_JobApplications_JAId",
                        column: x => x.JAId,
                        principalTable: "JobApplications",
                        principalColumn: "JAId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DocumentLists_JobOpenings_JOId",
                        column: x => x.JOId,
                        principalTable: "JobOpenings",
                        principalColumn: "JOId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DocumentLists_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DocumentLists_JAId",
                table: "DocumentLists",
                column: "JAId");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentLists_JOId",
                table: "DocumentLists",
                column: "JOId");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentLists_UserId_JAId",
                table: "DocumentLists",
                columns: new[] { "UserId", "JAId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DocumentLists");
        }
    }
}
