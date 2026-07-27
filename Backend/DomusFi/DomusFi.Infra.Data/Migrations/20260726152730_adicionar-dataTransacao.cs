using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DomusFi.Infra.Data.Migrations
{
    /// <inheritdoc />
    public partial class adicionardataTransacao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DataTransacao",
                table: "Transacoes",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataTransacao",
                table: "Transacoes");
        }
    }
}
