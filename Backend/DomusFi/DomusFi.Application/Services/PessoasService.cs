using DomusFi.Application.DTO;
using DomusFi.Application.Interfaces.Repositories;
using DomusFi.Application.Interfaces.Services;
using DomusFi.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomusFi.Application.Services
{
    public class PessoasService : IPessoasService
    {
        private readonly IPessoasRepository _pessoasRepository;

        public PessoasService(IPessoasRepository pessoasRepository)
        {
            _pessoasRepository = pessoasRepository;
        }

        public async Task<IEnumerable<PessoasResponseDTO>> ObterTodos()
        {
            var pessoas = await _pessoasRepository.ObterTodos();

            return pessoas.Select(p => new PessoasResponseDTO
            {
                IdPessoas = p.IdPessoas,
                Nome = p.Nome,
                Idade = p.Idade
            });
        }

        public async Task<PessoasResponseDTO?> ObterPorId(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("O ID informado não pode ser vazio.", nameof(id));
            }

            var pessoa = await _pessoasRepository.ObterPorId(id);
            if (pessoa == null) return null;

            return new PessoasResponseDTO
            {
                IdPessoas = pessoa.IdPessoas,
                Nome = pessoa.Nome,
                Idade = pessoa.Idade
            };
        }

        public async Task<PessoasResponseDTO> Adicionar(PessoasRequestDTO request)
        {
            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            if (string.IsNullOrWhiteSpace(request.Nome))
            {
                throw new InvalidOperationException("O nome da pessoa é obrigatório.");
            }

            var pessoa = new Pessoas
            {
                IdPessoas = Guid.NewGuid(),
                Nome = request.Nome,
                Idade = request.Idade
            };

            await _pessoasRepository.Adicionar(pessoa);

            return new PessoasResponseDTO
            {
                IdPessoas = pessoa.IdPessoas,
                Nome = pessoa.Nome,
                Idade = pessoa.Idade
            };
        }

        public async Task Deletar(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("O ID informado não pode ser vazio.", nameof(id));
            }

            await _pessoasRepository.Deletar(id);
        }
    }
}
