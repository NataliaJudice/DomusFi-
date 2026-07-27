using DomusFi.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomusFi.Infra.Data.Mappings
{
    public class TransacoesConfiguration : IEntityTypeConfiguration<Transacoes>
    {
        public void Configure(EntityTypeBuilder<Transacoes> builder)
        {
            builder.HasKey(x => new { x.IdTransacoes });

            //Caso a pessoa for deletada, todas as suas transações são deletadas junto
            builder.HasOne(x => x.Pessoas)
                .WithMany(x => x.Transacoes)
                .HasForeignKey(x => x.IdPessoa)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Property(t => t.Valor).HasPrecision(18, 2);
        }
    }
}
