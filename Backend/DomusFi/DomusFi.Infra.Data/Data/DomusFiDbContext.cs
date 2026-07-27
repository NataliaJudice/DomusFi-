using DomusFi.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomusFi.Infra.Data.Data
{
    public class DomusFiDbContext: DbContext
    {
        public DomusFiDbContext(DbContextOptions<DomusFiDbContext> options)
           : base(options)
        { }

        public DbSet<Pessoas> Pessoas { get; set; }
        public DbSet<Transacoes> Transacoes { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(DomusFiDbContext).Assembly);

        }

    }
}
