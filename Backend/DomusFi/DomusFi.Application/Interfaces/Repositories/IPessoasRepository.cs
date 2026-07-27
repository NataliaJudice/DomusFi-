using DomusFi.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomusFi.Application.Interfaces.Repositories
{
    public interface IPessoasRepository
    {
        /// <summary>
        /// Obtém a listagem completa de todas as pessoas cadastradas na base de dados.
        /// </summary>
        /// <returns>Uma coleção contendo todas as entidades de pessoas.</returns>
        /// <exception cref="InvalidOperationException">Lançado se houver falha de consulta no banco de dados.</exception>
        Task<IEnumerable<Pessoas>> ObterTodos();

        /// <summary>
        /// Busca uma pessoa específica pelo seu identificador.
        /// </summary>
        /// <param name="id">Identificador da pessoa.</param>
        /// <returns>A entidade da pessoa encontrada, ou nula caso não exista.</returns>
        /// <exception cref="InvalidOperationException">Lançado se houver falha na consulta.</exception>
        Task<Pessoas?> ObterPorId(Guid id);

        /// <summary>
        /// Insere um novo registro de pessoa na base de dados.
        /// </summary>
        /// <param name="pessoa">Entidade contendo os dados da pessoa a ser cadastrada.</param>
        /// <exception cref="InvalidOperationException">Lançado em caso de erro de registro ou exceção inesperada ao salvar.</exception>
        Task Adicionar(Pessoas pessoa);

        /// <summary>
        /// Remove um registro de pessoa do banco de dados com base no seu identificador.
        /// </summary>
        /// <param name="id">Identificador da pessoa a ser excluída.</param>
        /// <exception cref="KeyNotFoundException">Lançado caso a pessoa informada não seja encontrada.</exception>
        /// <exception cref="InvalidOperationException">Lançado se houver violação de restrições de integridade ou falha inesperada na exclusão.</exception>
        Task Deletar(Guid id);
    }
}
