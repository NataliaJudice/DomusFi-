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
    public class PessoasConfiguration : IEntityTypeConfiguration<Pessoas>
    {
        public void Configure(EntityTypeBuilder<Pessoas> builder)
        {
            builder.HasKey(x => new { x.IdPessoas });
        }
    }
}
