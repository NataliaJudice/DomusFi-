using DomusFi.Application.DTO;
using DomusFi.Application.Interfaces.Repositories;
using DomusFi.Domain.Models;
using DomusFi.Infra.Data.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomusFi.Infra.Data.Repositories
{
    public class TransacoesRepository : ITransacoesRepository
    {
        private readonly DomusFiDbContext _context;

        public TransacoesRepository(DomusFiDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Transacoes>> ObterTodos()
        {
            try
            {
                return await _context.Transacoes
                    .AsNoTracking()
                    .Include(t => t.Pessoas)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Erro ao consultar a lista de transações.", ex);
            }
        }

        public async Task Adicionar(Transacoes transacao)
        {
            try
            {
                await _context.Transacoes.AddAsync(transacao);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                throw new InvalidOperationException("Erro de chave estrangeira ou restrição ao salvar a transação.", ex);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Erro inesperado ao cadastrar a transação.", ex);
            }
        }

        public async Task<(IEnumerable<Transacoes> Items, int TotalRegistros)> ObterPaginado(
     string pessoaId,
     string tipo,
     string? termo,
     DateTime? dataInicio,
     DateTime? dataFim,
     int pagina,
     int tamanhoPagina)
        {
            var query = _context.Transacoes
                .OrderByDescending(x => x.DataTransacao)
                .AsNoTracking()
                .Include(t => t.Pessoas)
                .AsQueryable();

            if (Guid.TryParse(pessoaId, out var idGuid))
            {
                query = query.Where(t => t.IdPessoa == idGuid);
            }

            if (!string.IsNullOrWhiteSpace(tipo) && tipo.ToLower() != "todos")
            {
                var tipoLower = tipo.Trim().ToLower();
                query = query.Where(t => t.TipoDespesa.ToLower() == tipoLower);
            }

            if (!string.IsNullOrWhiteSpace(termo))
            {
                var termoLower = termo.Trim().ToLower();
                query = query.Where(t => t.Descricao.ToLower().Contains(termoLower));
            }

            if (dataInicio.HasValue)
            {
                query = query.Where(t => t.DataTransacao.Value.Date >= dataInicio.Value.Date);
            }

            if (dataFim.HasValue)
            {
                query = query.Where(t => t.DataTransacao.Value.Date <= dataFim.Value.Date);
            }

            var totalRegistros = await query.CountAsync();

            var items = await query
                .Skip((pagina - 1) * tamanhoPagina)
                .Take(tamanhoPagina)
                .ToListAsync();

            return (items, totalRegistros);
        }
        public async Task<decimal> ObterTotalDespesasGeral()
        {
            return await _context.Transacoes
                .AsNoTracking()
                .Where(t => t.TipoDespesa.ToLower() == "despesa")
                .SumAsync(t => (decimal?)t.Valor) ?? 0m;
        }

        public async Task<decimal> ObterTotalReceitasGeral()
        {
            return await _context.Transacoes
                .AsNoTracking()
                .Where(t => t.TipoDespesa.ToLower() == "receita")
                .SumAsync(t => (decimal?)t.Valor) ?? 0m;
        }

        public async Task<IEnumerable<Transacoes>> ObterTransacoesPorPeriodo(DateTime? dataInicio, DateTime? dataFim, Guid? idPessoa = null)
        {
            var query = _context.Transacoes
                .AsNoTracking()
                .Include(t => t.Pessoas)
                .AsQueryable();

            if (idPessoa.HasValue && idPessoa.Value != Guid.Empty)
            {
                query = query.Where(t => t.IdPessoa == idPessoa.Value);
            }

            if (dataInicio.HasValue)
            {
                query = query.Where(t => t.DataTransacao >= dataInicio.Value);
            }

            if (dataFim.HasValue)
            {
                var fimAjustado = dataFim.Value.Date.AddDays(1).AddTicks(-1);
                query = query.Where(t => t.DataTransacao <= fimAjustado);
            }

            return await query
                .OrderByDescending(t => t.DataTransacao)
                .ToListAsync();
        }

        public async Task<IEnumerable<Transacoes>> ObterUltimasTransacoesPorPessoa(Guid idPessoa, int quantidade = 5)
        {
            return await _context.Transacoes
                .OrderByDescending(x => x.DataTransacao)
                .AsNoTracking()
                .Where(t => t.IdPessoa == idPessoa)
                .Take(quantidade)
                .ToListAsync();
        }
        
        public async Task<int> ObterTotalTransacoesGeral()
        {
            return await _context.Transacoes
                .AsNoTracking()
                .CountAsync();
        }

        public async Task<IEnumerable<Transacoes>> ObterTransacoesPorPessoa(
    Guid idPessoa,
    string? termo,
    string? tipo,
    DateTime? dataInicio, // Novo
    DateTime? dataFim,    // Novo
    int pagina,
    int tamanhoPagina)
        {
            var query = _context.Transacoes
                .OrderByDescending(x => x.DataTransacao)
                .AsNoTracking()
                .Where(t => t.IdPessoa == idPessoa);

            // Filtro por termo/descrição
            if (!string.IsNullOrWhiteSpace(termo))
            {
                var termoLower = termo.Trim().ToLower();
                query = query.Where(t => t.Descricao.ToLower().Contains(termoLower));
            }

            // Filtro por tipo
            if (!string.IsNullOrWhiteSpace(tipo) && tipo.ToLower() != "todos")
            {
                var tipoLower = tipo.Trim().ToLower();
                query = query.Where(t => t.TipoDespesa.ToLower() == tipoLower);
            }

            // Filtro por Data Inicial (>=)
            if (dataInicio.HasValue)
            {
                query = query.Where(t => t.DataTransacao >= dataInicio.Value);
            }

            // Filtro por Data Final (<=)
            if (dataFim.HasValue)
            {
                // Opcional: Se quiser incluir o dia inteiro até as 23:59:59 quando vier apenas a data
                var fimDoDia = dataFim.Value.TimeOfDay == TimeSpan.Zero
                    ? dataFim.Value.AddDays(1).AddTicks(-1)
                    : dataFim.Value;

                query = query.Where(t => t.DataTransacao <= fimDoDia);
            }

            return await query
                .Skip((pagina - 1) * tamanhoPagina)
                .Take(tamanhoPagina)
                .ToListAsync();
        }
        public async Task<int> ObterTotalTransacoesFiltradas(Guid idPessoa, string? termo, string? tipo)
        {
            var query = _context.Transacoes
                .AsNoTracking()
                .Where(t => t.IdPessoa == idPessoa);

            if (!string.IsNullOrWhiteSpace(termo))
            {
                var termoLower = termo.Trim().ToLower();
                query = query.Where(t => t.Descricao.ToLower().Contains(termoLower));
            }

            if (!string.IsNullOrWhiteSpace(tipo) && tipo.ToLower() != "todos")
            {
                var tipoLower = tipo.Trim().ToLower();
                query = query.Where(t => t.TipoDespesa.ToLower() == tipoLower);
            }

            return await query.CountAsync();
        }

        public async Task<decimal> ObterTotalReceitasPorPessoa(Guid idPessoa)
        {
            return await _context.Transacoes
                .AsNoTracking()
                .Where(t => t.IdPessoa == idPessoa && t.TipoDespesa.ToLower() == "receita")
                .SumAsync(t => (decimal?)t.Valor) ?? 0m;
        }

        public async Task<decimal> ObterTotalDespesasPorPessoa(Guid idPessoa)
        {
            return await _context.Transacoes
                .AsNoTracking()
                .Where(t => t.IdPessoa == idPessoa && t.TipoDespesa.ToLower() == "despesa")
                .SumAsync(t => (decimal?)t.Valor) ?? 0m;
        }

        public async Task<int> ObterQtdTotalTransacoesPorPessoa(Guid idPessoa)
        {
            return await _context.Transacoes
                .AsNoTracking()
                .CountAsync(t => t.IdPessoa == idPessoa);
        }
    
}
}
