using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DomusFi.Infra.Data.Migrations
{
    /// <inheritdoc />
    public partial class mudancatipoDespesa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transacoes_TipoDespesa_IdTipoDespesa",
                table: "Transacoes");

            migrationBuilder.DropTable(
                name: "TipoDespesa");

            migrationBuilder.DropIndex(
                name: "IX_Transacoes_IdTipoDespesa",
                table: "Transacoes");

            migrationBuilder.AddColumn<string>(
                name: "TipoDespesa",
                table: "Transacoes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TipoDespesa",
                table: "Transacoes");

            migrationBuilder.CreateTable(
                name: "TipoDespesa",
                columns: table => new
                {
                    IdTipoDespesa = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TipoDespesa", x => x.IdTipoDespesa);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Transacoes_IdTipoDespesa",
                table: "Transacoes",
                column: "IdTipoDespesa");

            migrationBuilder.AddForeignKey(
                name: "FK_Transacoes_TipoDespesa_IdTipoDespesa",
                table: "Transacoes",
                column: "IdTipoDespesa",
                principalTable: "TipoDespesa",
                principalColumn: "IdTipoDespesa",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
