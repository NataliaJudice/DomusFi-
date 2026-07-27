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
    public class PessoasRepository : IPessoasRepository
    {
        private readonly DomusFiDbContext _context;

        public PessoasRepository(DomusFiDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Pessoas>> ObterTodos()
        {
            try
            {
                return await _context.Pessoas
                    .AsNoTracking()
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Erro ao consultar a lista de pessoas.", ex);
            }
        }

        public async Task<Pessoas?> ObterPorId(Guid id)
        {
            try
            {
                return await _context.Pessoas
                    .AsNoTracking()
                    .FirstOrDefaultAsync(p => p.IdPessoas == id);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Erro ao buscar a pessoa com ID {id}.", ex);
            }
        }

        public async Task Adicionar(Pessoas pessoa)
        {
            try
            {
                await _context.Pessoas.AddAsync(pessoa);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                throw new InvalidOperationException("Erro de persistência ao cadastrar a pessoa.", ex);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Erro inesperado ao cadastrar a pessoa.", ex);
            }
        }

        public async Task Deletar(Guid id)
        {
            try
            {
                var pessoa = await _context.Pessoas.FindAsync(new object[] { id });
                if (pessoa is null)
                {
                    throw new KeyNotFoundException($"Pessoa com ID {id} não foi encontrada.");
                }

                _context.Pessoas.Remove(pessoa);
                await _context.SaveChangesAsync();
            }
            catch (KeyNotFoundException)
            {
                throw;
            }
            catch (DbUpdateException ex)
            {
                throw new InvalidOperationException("Não foi possível excluir a pessoa pois ela possui vínculos no sistema.", ex);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Erro inesperado ao excluir a pessoa.", ex);
            }
        }
    }
}
