using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DomusFi.Infra.Data.Migrations
{
    /// <inheritdoc />
    public partial class bancoinicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Pessoas",
                columns: table => new
                {
                    IdPessoas = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Idade = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pessoas", x => x.IdPessoas);
                });

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

            migrationBuilder.CreateTable(
                name: "Transacoes",
                columns: table => new
                {
                    IdTransacoes = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Descricao = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Valor = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IdTipoDespesa = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdPessoa = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transacoes", x => x.IdTransacoes);
                    table.ForeignKey(
                        name: "FK_Transacoes_Pessoas_IdPessoa",
                        column: x => x.IdPessoa,
                        principalTable: "Pessoas",
                        principalColumn: "IdPessoas",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Transacoes_TipoDespesa_IdTipoDespesa",
                        column: x => x.IdTipoDespesa,
                        principalTable: "TipoDespesa",
                        principalColumn: "IdTipoDespesa",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Transacoes_IdPessoa",
                table: "Transacoes",
                column: "IdPessoa");

            migrationBuilder.CreateIndex(
                name: "IX_Transacoes_IdTipoDespesa",
                table: "Transacoes",
                column: "IdTipoDespesa");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Transacoes");

            migrationBuilder.DropTable(
                name: "Pessoas");

            migrationBuilder.DropTable(
                name: "TipoDespesa");
        }
    }
}
