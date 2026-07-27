using DomusFi.Application.DTO;
using DomusFi.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomusFi.Application.Interfaces.Services
{
    public interface ITransacoesService
    {
        /// <summary>
        /// Retorna uma lista com todas as transações cadastradas no sistema, convertidas para o DTO de resposta.
        /// </summary>
        /// <returns>Uma coleção contendo todas as transações registradas.</returns>
        /// <exception cref="InvalidOperationException">Lançado quando ocorre um erro interno durante a consulta ao repositório.</exception>
        Task<IEnumerable<TransacoesResponseDTO>> ObterTodos();

        /// <summary>
        /// Cadastra uma nova transação no sistema, validando dados obrigatórios e aplicando a regra de negócio que restringe transações do tipo "Receita" apenas para maiores de 18 anos.
        /// </summary>
        /// <param name="request">DTO contendo os dados da transação (descrição, valor, tipo, data e ID da pessoa).</param>
        /// <returns>Retorna o DTO da transação criada, incluindo o nome da pessoa vinculada.</returns>
        /// <exception cref="ArgumentNullException">Lançado se o objeto request for nulo.</exception>
        /// <exception cref="ArgumentException">Lançado se o valor for menor/igual a zero, ID da pessoa for inválido ou tipo de despesa estiver vazio.</exception>
        /// <exception cref="KeyNotFoundException">Lançado se a pessoa vinculada ao ID informado não for encontrada no sistema.</exception>
        /// <exception cref="InvalidOperationException">Lançado se a pessoa for menor de idade e tentar cadastrar uma receita, ou caso ocorra erro interno de salvamento.</exception>
        Task<TransacoesResponseDTO> Adicionar(TransacoesRequestDTO request);

        /// <summary>
        /// Retorna uma listagem paginada de transações com suporte a múltiplos filtros dinâmicos (por pessoa, tipo e termo de busca textual).
        /// </summary>
        /// <param name="pessoaId">Identificador da pessoa ("todas" ou ID específico).</param>
        /// <param name="tipo">Filtro por tipo de transação ("todos", "receita", "despesa").</param>
        /// <param name="termo">Texto opcional para busca na descrição da transação.</param>
        /// <param name="pagina">Número da página atual (mínimo 1).</param>
        /// <param name="tamanhoPagina">Quantidade de registros exibidos por página.</param>
        /// <returns>Um DTO contendo os metadados de paginação e a lista de transações correspondentes.</returns>
        /// <exception cref="InvalidOperationException">Lançado se houver falha na consulta paginada.</exception>
        Task<TransacoesPaginadasResponseDTO> ObterTransacoesPaginadas(
     string pessoaId,
     string tipo,
     string? termo,
     DateTime? dataInicio,
     DateTime? dataFim,
     int pagina,
     int tamanhoPagina);

        /// <summary>
        /// Gera um relatório de ranking consolidado por pessoa, filtrando por tipo de transação (receita ou despesa) e por um período opcional de datas.
        /// </summary>
        /// <param name="tipo">O tipo de transação a ser ranqueada (ex: "receita" ou "despesa").</param>
        /// <param name="dataInicio">Data inicial opcional para o filtro do período.</param>
        /// <param name="dataFim">Data final opcional para o filtro do período.</param>
        /// <returns>Um DTO contendo o total geral do período, a listagem ordenada das pessoas e suas respectivas participações percentuais.</returns>
        Task<RelatorioRankingResponseDTO> ObterRankingPorTipo(string tipo, DateTime? dataInicio, DateTime? dataFim);
        
        /// <summary>
        /// Gera um relatório individual ou geral detalhando as receitas, despesas, saldo e lançamentos transacionais dentro de um período especificado.
        /// </summary>
        /// <param name="idPessoa">Identificador opcional (GUID) de uma pessoa específica. Se nulo ou vazio, incluirá todas as pessoas.</param>
        /// <param name="dataInicio">Data inicial opcional para o intervalo do extrato.</param>
        /// <param name="dataFim">Data final opcional para o intervalo do extrato.</param>
        /// <returns>Um DTO contendo o sumário financeiro e a listagem de transações agrupadas por pessoa.</returns>
        Task<RelatorioIndividualResponseDTO> ObterRelatorioIndividual(Guid? idPessoa, DateTime? dataInicio, DateTime? dataFim);

        /// <summary>
        /// Calcula e retorna o resumo financeiro geral da aplicação para exibição no dashboard principal, incluindo métricas globais e o resumo individual por morador.
        /// </summary>
        /// <returns>Um DTO com totais consolidados de receitas, despesas, saldo líquido, quantidade de transações e estatísticas de menores de idade.</returns>
        /// <exception cref="InvalidOperationException">Lançado se ocorrer erro durante os cálculos ou buscas agregadas.</exception>
        Task<DashboardResumoDTO> ObterResumoGeral();

        /// <summary>
        /// Obtém o perfil financeiro consolidado de uma pessoa específica, juntamente com o seu extrato de transações filtrado e paginado.
        /// </summary>
        /// <param name="idPessoa">Identificador único da pessoa.</param>
        /// <param name="termo">Termo opcional de busca na descrição das transações.</param>
        /// <param name="tipo">Filtro por tipo de transação (padrão: "todos").</param>
        /// <param name="pagina">Número da página atual do extrato.</param>
        /// <param name="tamanhoPagina">Quantidade de itens por página do extrato (padrão: 5).</param>
        /// <returns>Um DTO contendo os saldos totais da pessoa, dados cadastrais e o extrato paginado.</returns>
        /// <exception cref="KeyNotFoundException">Lançado caso a pessoa informada não exista no banco de dados.</exception>
        /// <exception cref="InvalidOperationException">Lançado em caso de falha interna ao processar o extrato.</exception>
        Task<ResumoPessoaDTO> ObterResumoPessoaComExtratoPaginado(
    Guid idPessoa,
    string? termo = null,
    string? tipo = "todos",
    DateTime? dataInicio = null, // Novo
    DateTime? dataFim = null,    // Novo
    int pagina = 1,
    int tamanhoPagina = 5);
    }
}
