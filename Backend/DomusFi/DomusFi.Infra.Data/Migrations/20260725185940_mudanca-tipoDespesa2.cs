using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DomusFi.Infra.Data.Migrations
{
    /// <inheritdoc />
    public partial class mudancatipoDespesa2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IdTipoDespesa",
                table: "Transacoes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "IdTipoDespesa",
                table: "Transacoes",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }
    }
}
