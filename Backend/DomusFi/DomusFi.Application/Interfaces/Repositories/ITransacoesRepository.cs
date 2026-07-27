using DomusFi.Application.DTO;
using DomusFi.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomusFi.Application.Interfaces.Repositories
{
    public interface ITransacoesRepository
    {
        /// <summary>
        /// Obtém a lista completa de todas as transações cadastradas e incluindo os dados da pessoa relacionada.
        /// </summary>
        /// <returns>Uma coleção contendo todas as transações.</returns>
        /// <exception cref="InvalidOperationException">Lançado caso ocorra falha de consulta no banco de dados.</exception>
        Task<IEnumerable<Transacoes>> ObterTodos();

        /// <summary>
        /// Adiciona um novo registro de transação no banco de dados.
        /// </summary>
        /// <param name="transacao">Entidade contendo os dados da transação a ser salva.</param>
        /// <exception cref="InvalidOperationException">Lançado se houver violação de chave estrangeira, restrição de banco ou erro inesperado.</exception>
        Task Adicionar(Transacoes transacao);

        /// <summary>
        /// Calcula a soma total de todas as transações registradas no sistema com o tipo "Despesa".
        /// </summary>
        /// <returns>O valor acumulado geral das despesas.</returns>
        Task<decimal> ObterTotalDespesasGeral();

        /// <summary>
        /// Calcula a soma total de todas as transações registradas no sistema com o tipo "Receita".
        /// </summary>
        /// <returns>O valor acumulado geral das receitas.</returns>
        Task<decimal> ObterTotalReceitasGeral();

        /// <summary>
        /// Conta o número total de transações registradas em toda a base de dados.
        /// </summary>
        /// <returns>Quantidade inteira de registros na tabela de transações.</returns>
        Task<int> ObterTotalTransacoesGeral();

        /// <summary>
        /// Busca as últimas transações cadastradas de uma pessoa específica, ordenadas da mais recente para a mais antiga.
        /// </summary>
        /// <param name="idPessoa">Identificador único da pessoa.</param>
        /// <param name="quantidade">Número máximo de registros a serem retornados (padrão: 5).</param>
        /// <returns>Uma coleção com o limite especificado das transações recentes da pessoa.</returns>
        Task<IEnumerable<Transacoes>> ObterUltimasTransacoesPorPessoa(Guid idPessoa, int quantidade = 5);

        /// <summary>
        /// Retorna transações filtradas por um intervalo de datas e opcionalmente por uma pessoa específica.
        /// </summary>
        /// <param name="dataInicio">Data de início opcional do período.</param>
        /// <param name="dataFim">Data de fim opcional do período.</param>
        /// <param name="idPessoa">Identificador opcional para restringir as transações a uma pessoa.</param>
        /// <returns>Uma coleção de transações ordenadas por data de forma decrescente.</returns>
        Task<IEnumerable<Transacoes>> ObterTransacoesPorPeriodo(DateTime? dataInicio, DateTime? dataFim, Guid? idPessoa = null);

        /// <summary>
        /// Realiza uma consulta paginada e filtrada de transações de forma global, ordenadas da mais recente para a mais antiga.
        /// </summary>
        /// <param name="pessoaId">Identificador em texto da pessoa ou "todas".</param>
        /// <param name="tipo">Filtro por tipo de transação ("receita", "despesa" ou "todos").</param>
        /// <param name="termo">Termo opcional de busca por correspondência na descrição.</param>
        /// <param name="pagina">Número da página atual (iniciando em 1).</param>
        /// <param name="tamanhoPagina">Quantidade máxima de registros por página.</param>
        /// <returns>Uma tupla contendo a lista dos itens da página atual e o total geral de registros correspondentes ao filtro.</returns>
        Task<(IEnumerable<Transacoes> Items, int TotalRegistros)> ObterPaginado(
    string pessoaId,
    string tipo,
    string? termo,
    DateTime? dataInicio,
    DateTime? dataFim,
    int pagina,
    int tamanhoPagina);

        /// <summary>
        /// Consulta as transações paginadas e filtradas de uma pessoa específica com base em termos de texto e tipo de despesa.
        /// </summary>
        /// <param name="idPessoa">Identificador único da pessoa.</param>
        /// <param name="termo">Termo opcional de busca na descrição.</param>
        /// <param name="tipo">Filtro opcional por tipo de transação.</param>
        /// <param name="pagina">Número da página atual.</param>
        /// <param name="tamanhoPagina">Quantidade de itens por página.</param>
        /// <returns>Coleção de transações correspondentes aos filtros e paginação aplicados.</returns>
        Task<IEnumerable<Transacoes>> ObterTransacoesPorPessoa(
    Guid idPessoa,
    string? termo,
    string? tipo,
    DateTime? dataInicio, // Novo
    DateTime? dataFim,    // Novo
    int pagina,
    int tamanhoPagina);
        /// <summary>
        /// Retorna a contagem exata de transações de uma pessoa que atendem aos filtros de termo e tipo informados.
        /// </summary>
        /// <param name="idPessoa">Identificador único da pessoa.</param>
        /// <param name="termo">Termo opcional de busca na descrição.</param>
        /// <param name="tipo">Filtro opcional por tipo.</param>
        /// <returns>O número total de registros filtrados.</returns>
        Task<int> ObterTotalTransacoesFiltradas(Guid idPessoa, string? termo, string? tipo);

        /// <summary>
        /// Calcula a soma total de receitas associadas a uma pessoa específica.
        /// </summary>
        /// <param name="idPessoa">Identificador da pessoa.</param>
        /// <returns>O valor acumulado das receitas da pessoa.</returns>
        Task<decimal> ObterTotalReceitasPorPessoa(Guid idPessoa);

        /// <summary>
        /// Calcula a soma total de despesas associadas a uma pessoa específica.
        /// </summary>
        /// <param name="idPessoa">Identificador da pessoa.</param>
        /// <returns>O valor acumulado das despesas da pessoa.</returns>
        Task<decimal> ObterTotalDespesasPorPessoa(Guid idPessoa);

        /// <summary>
        /// Conta a quantidade total de transações registradas para uma pessoa específica.
        /// </summary>
        /// <param name="idPessoa">Identificador da pessoa.</param>
        /// <returns>Quantidade total de transações pertencentes à pessoa.</returns>
        Task<int> ObterQtdTotalTransacoesPorPessoa(Guid idPessoa);
    }
}
