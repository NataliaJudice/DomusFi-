using DomusFi.Application.DTO;
using DomusFi.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomusFi.Application.Interfaces.Services
{
    public interface IPessoasService
    {
        /// <summary>
        /// Obtém a listagem completa de todas as pessoas cadastradas no sistema.
        /// </summary>
        /// <returns>Uma coleção assíncrona com os DTOs de resposta de todas as pessoas.</returns>
        Task<IEnumerable<PessoasResponseDTO>> ObterTodos();

        /// <summary>
        /// Busca os dados cadastrais de uma pessoa específica com base no seu identificador único (ID).
        /// </summary>
        /// <param name="id">Identificador da pessoa.</param>
        /// <returns>O DTO de resposta da pessoa correspondente, ou nulo caso não seja encontrada.</returns>
        /// <exception cref="ArgumentException">Lançado se o ID informado for vazio (Guid.Empty).</exception>
        Task<PessoasResponseDTO?> ObterPorId(Guid id);

        /// <summary>
        /// Cadastra uma nova pessoa no sistema após validar as informações de entrada.
        /// </summary>
        /// <param name="request">DTO contendo os dados necessários para o cadastro (nome e idade).</param>
        /// <returns>O DTO de resposta contendo o ID gerado automaticamente e os dados salvos da pessoa.</returns>
        /// <exception cref="ArgumentNullException">Lançado se o objeto request for nulo.</exception>
        /// <exception cref="InvalidOperationException">Lançado se o nome da pessoa estiver em branco ou inválido.</exception>
        Task<PessoasResponseDTO> Adicionar(PessoasRequestDTO request);

        /// <summary>
        /// Remove uma pessoa do sistema pelo seu identificador, disparando a deleção em cascata das suas transações vinculadas.
        /// </summary>
        /// <param name="id">Identificador da pessoa a ser excluída.</param>
        /// <exception cref="ArgumentException">Lançado se o ID informado for vazio (Guid.Empty).</exception>
        Task Deletar(Guid id);
    }
}
