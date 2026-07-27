using DomusFi.Domain.Models;
using DomusFi.Infra.Data.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace DomusFi.Infra.Data.Data.Seed
{
    public static class DbInitializer
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using var context = new DomusFiDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<DomusFiDbContext>>());

            // Garante que o banco foi criado
            await context.Database.EnsureCreatedAsync();

            // Se já existir alguma pessoa cadastrada, não faz o seed novamente
            if (context.Pessoas.Any())
            {
                return;
            }

            // 1. Criação das Pessoas (Misturando adultos e menor de 18 anos)
            var p1 = new Pessoas { IdPessoas = Guid.NewGuid(), Nome = "Carlos Silva", Idade = 35 };
            var p2 = new Pessoas { IdPessoas = Guid.NewGuid(), Nome = "Mariana Souza", Idade = 28 };
            var p3 = new Pessoas { IdPessoas = Guid.NewGuid(), Nome = "Lucas Silva (Filho)", Idade = 15 }; // Menor de idade
            var p4 = new Pessoas { IdPessoas = Guid.NewGuid(), Nome = "Ana Paula", Idade = 42 };

            await context.Pessoas.AddRangeAsync(p1, p2, p3, p4);
            await context.SaveChangesAsync();

            // 2. Criação das Transações distribuídas em vários meses e anos (2024, 2025 e 2026)
            var transacoes = new[]
            {
                // --- ANO DE 2024 ---
                new Transacoes { IdTransacoes = Guid.NewGuid(), Descricao = "Salário - Dez/2024", Valor = 5000.00m, TipoDespesa = "Receita", DataTransacao = new DateTime(2024, 12, 5), IdPessoa = p1.IdPessoas },
                new Transacoes { IdTransacoes = Guid.NewGuid(), Descricao = "Aluguel - Dez/2024", Valor = 1500.00m, TipoDespesa = "Despesa", DataTransacao = new DateTime(2024, 12, 10), IdPessoa = p1.IdPessoas },

                // --- ANO DE 2025 ---
                new Transacoes { IdTransacoes = Guid.NewGuid(), Descricao = "Salário - Jan/2025", Valor = 5200.00m, TipoDespesa = "Receita", DataTransacao = new DateTime(2025, 01, 5), IdPessoa = p1.IdPessoas },
                new Transacoes { IdTransacoes = Guid.NewGuid(), Descricao = "IPTU 2025", Valor = 800.00m, TipoDespesa = "Despesa", DataTransacao = new DateTime(2025, 01, 15), IdPessoa = p1.IdPessoas },
                new Transacoes { IdTransacoes = Guid.NewGuid(), Descricao = "Venda de Equipamento Antigo", Valor = 1200.00m, TipoDespesa = "Receita", DataTransacao = new DateTime(2025, 06, 20), IdPessoa = p2.IdPessoas },
                new Transacoes { IdTransacoes = Guid.NewGuid(), Descricao = "Viagem de Férias", Valor = 3000.00m, TipoDespesa = "Despesa", DataTransacao = new DateTime(2025, 07, 10), IdPessoa = p2.IdPessoas },

                // --- ANO DE 2026 (Meses Passados e Mês Atual) ---
                // Mês Passado (Junho de 2026)
                new Transacoes { IdTransacoes = Guid.NewGuid(), Descricao = "Salário - Jun/2026", Valor = 5500.00m, TipoDespesa = "Receita", DataTransacao = new DateTime(2026, 06, 05), IdPessoa = p1.IdPessoas },
                new Transacoes { IdTransacoes = Guid.NewGuid(), Descricao = "Conta de Luz - Jun", Valor = 250.00m, TipoDespesa = "Despesa", DataTransacao = new DateTime(2026, 06, 12), IdPessoa = p1.IdPessoas },
                new Transacoes { IdTransacoes = Guid.NewGuid(), Descricao = "Freelance Design - Jun", Valor = 1800.00m, TipoDespesa = "Receita", DataTransacao = new DateTime(2026, 06, 18), IdPessoa = p2.IdPessoas },

                // Mês Atual (Julho de 2026)
                new Transacoes { IdTransacoes = Guid.NewGuid(), Descricao = "Salário - Jul/2026", Valor = 5500.00m, TipoDespesa = "Receita", DataTransacao = new DateTime(2026, 07, 05), IdPessoa = p1.IdPessoas },
                new Transacoes { IdTransacoes = Guid.NewGuid(), Descricao = "Supermercado Semanal", Valor = 920.50m, TipoDespesa = "Despesa", DataTransacao = new DateTime(2026, 07, 10), IdPessoa = p1.IdPessoas },
                new Transacoes { IdTransacoes = Guid.NewGuid(), Descricao = "Consultoria Web", Valor = 2500.00m, TipoDespesa = "Receita", DataTransacao = new DateTime(2026, 07, 14), IdPessoa = p2.IdPessoas },
                
                // Transações do Lucas (Menor de idade - Somente Despesas em datas recentes)
                new Transacoes { IdTransacoes = Guid.NewGuid(), Descricao = "Lanche na Escola", Valor = 50.00m, TipoDespesa = "Despesa", DataTransacao = new DateTime(2026, 07, 08), IdPessoa = p3.IdPessoas },
                new Transacoes { IdTransacoes = Guid.NewGuid(), Descricao = "Jogo na Steam", Valor = 110.00m, TipoDespesa = "Despesa", DataTransacao = new DateTime(2026, 07, 18), IdPessoa = p3.IdPessoas },

                // Transações da Ana Paula (Julho de 2026)
                new Transacoes { IdTransacoes = Guid.NewGuid(), Descricao = "Serviço de Contabilidade", Valor = 3200.00m, TipoDespesa = "Receita", DataTransacao = new DateTime(2026, 07, 02), IdPessoa = p4.IdPessoas },
                new Transacoes { IdTransacoes = Guid.NewGuid(), Descricao = "Manutenção do Carro", Valor = 750.00m, TipoDespesa = "Despesa", DataTransacao = new DateTime(2026, 07, 15), IdPessoa = p4.IdPessoas }
            };

            await context.Transacoes.AddRangeAsync(transacoes);
            await context.SaveChangesAsync();
        }
    }
}