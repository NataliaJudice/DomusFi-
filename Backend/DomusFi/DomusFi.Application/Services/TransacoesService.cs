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
    public class TransacoesService : ITransacoesService
    {
        private readonly ITransacoesRepository _transacoesRepository;
        private readonly IPessoasRepository _pessoasRepository;
        public TransacoesService(ITransacoesRepository transacoesRepository, IPessoasRepository pessoasRepository)
        {
            _transacoesRepository = transacoesRepository;
            _pessoasRepository = pessoasRepository;
        }
       
        public async Task<IEnumerable<TransacoesResponseDTO>> ObterTodos()
        {
            try
            {
                var transacoes = await _transacoesRepository.ObterTodos();

                return transacoes.Select(t => new TransacoesResponseDTO
                {
                    IdTransacoes = t.IdTransacoes,
                    Descricao = t.Descricao,
                    Valor = t.Valor,
                    TipoDespesa = t.TipoDespesa,
                    TipoDespesaNome = t.TipoDespesa,
                    DataTransacao = t.DataTransacao,
                    IdPessoa = t.IdPessoa,
                    PessoaNome = t.Pessoas?.Nome
                });
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Erro ao consultar a lista de transações.", ex);
            }
        }

        public async Task<TransacoesResponseDTO> Adicionar(TransacoesRequestDTO request)
        {
            if (request == null)
            {
                throw new ArgumentNullException(nameof(request), "Os dados da transação são obrigatórios.");
            }

            if (request.Valor <= 0)
            {
                throw new ArgumentException("O valor da transação deve ser maior que zero.");
            }

            if (request.IdPessoa == Guid.Empty)
            {
                throw new ArgumentException("A transação deve estar associada a uma pessoa válida.");
            }

            if (string.IsNullOrWhiteSpace(request.TipoDespesa))
            {
                throw new ArgumentException("A transação deve ter um tipo válido (ex: 'Receita' ou 'Despesa').");
            }

            try
            {
                var pessoa = await _pessoasRepository.ObterPorId(request.IdPessoa);
                if (pessoa == null)
                {
                    throw new KeyNotFoundException($"A pessoa com ID '{request.IdPessoa}' não foi encontrada.");
                }

                if (request.TipoDespesa.Equals("Receita", StringComparison.OrdinalIgnoreCase) && pessoa.Idade < 18)
                {
                    throw new InvalidOperationException($"Apenas pessoas maiores de 18 anos podem fazer transações do tipo Receita. ({pessoa.Nome} tem {pessoa.Idade} anos)");
                }

                var transacao = new Transacoes
                {
                    IdTransacoes = Guid.NewGuid(),
                    Descricao = request.Descricao,
                    Valor = request.Valor,
                    TipoDespesa = request.TipoDespesa,
                    DataTransacao = request.DataTransacao,
                    IdPessoa = request.IdPessoa
                };

                await _transacoesRepository.Adicionar(transacao);

                return new TransacoesResponseDTO
                {
                    IdTransacoes = transacao.IdTransacoes,
                    Descricao = transacao.Descricao,
                    Valor = transacao.Valor,
                    TipoDespesa = transacao.TipoDespesa,
                    TipoDespesaNome = transacao.TipoDespesa,
                    IdPessoa = transacao.IdPessoa,
                    PessoaNome = pessoa.Nome 
                };
            }
            catch (KeyNotFoundException)
            {
                throw;
            }
            catch (InvalidOperationException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Erro interno ao tentar salvar a transação.", ex);
            }
        }

        public async Task<RelatorioRankingResponseDTO> ObterRankingPorTipo(string tipo, DateTime? dataInicio, DateTime? dataFim)
        {
            var tipoNormalizado = (tipo ?? "receita").Trim().ToLower();
            var transacoes = await _transacoesRepository.ObterTransacoesPorPeriodo(dataInicio, dataFim);

            // Filtra o tipo no servidor de aplicação após trazer do banco filtrado por data
            var transacoesDoTipo = transacoes
                .Where(t => t.TipoDespesa.ToLower() == tipoNormalizado)
                .ToList();

            var totalGeralPeriodo = transacoesDoTipo.Sum(t => t.Valor);

            var rankingAgrupado = transacoesDoTipo
                .GroupBy(t => new { t.IdPessoa, Nome = t.Pessoas?.Nome ?? "Pessoa", Idade = t.Pessoas?.Idade ?? 0 })
                .Select(g => new
                {
                    g.Key.IdPessoa,
                    g.Key.Nome,
                    g.Key.Idade,
                    TotalValor = g.Sum(t => t.Valor),
                    QtdTransacoes = g.Count()
                })
                .OrderByDescending(x => x.TotalValor)
                .ToList();

            var rankingLista = new List<RankingPessoaDTO>();
            int posicao = 1;

            foreach (var item in rankingAgrupado)
            {
                rankingLista.Add(new RankingPessoaDTO
                {
                    Posicao = posicao++,
                    IdPessoa = item.IdPessoa,
                    Nome = item.Nome,
                    Idade = item.Idade,
                    TotalValor = item.TotalValor,
                    PorcentagemParticipacao = totalGeralPeriodo > 0 ? (double)Math.Round((item.TotalValor / totalGeralPeriodo) * 100, 2) : 0,
                    QtdTransacoes = item.QtdTransacoes
                });
            }

            return new RelatorioRankingResponseDTO
            {
                TipoRelatorio = tipoNormalizado,
                DataInicio = dataInicio,
                DataFim = dataFim,
                TotalGeralPeriodo = totalGeralPeriodo,
                Ranking = rankingLista
            };
        }

        public async Task<RelatorioIndividualResponseDTO> ObterRelatorioIndividual(Guid? idPessoa, DateTime? dataInicio, DateTime? dataFim)
        {
            var transacoes = await _transacoesRepository.ObterTransacoesPorPeriodo(dataInicio, dataFim, idPessoa);
            var todasPessoas = await _pessoasRepository.ObterTodos();

            if (idPessoa.HasValue && idPessoa.Value != Guid.Empty)
            {
                todasPessoas = todasPessoas.Where(p => p.IdPessoas == idPessoa.Value);
            }

            var resultadoPessoas = new List<RelatorioPessoaIndividualDTO>();

            foreach (var pessoa in todasPessoas)
            {
                var transacoesDaPessoa = transacoes.Where(t => t.IdPessoa == pessoa.IdPessoas).ToList();

                var receitas = transacoesDaPessoa
                    .Where(t => t.TipoDespesa.ToLower() == "receita")
                    .Sum(t => t.Valor);

                var despesas = transacoesDaPessoa
                    .Where(t => t.TipoDespesa.ToLower() == "despesa")
                    .Sum(t => t.Valor);

                resultadoPessoas.Add(new RelatorioPessoaIndividualDTO
                {
                    IdPessoa = pessoa.IdPessoas,
                    Nome = pessoa.Nome,
                    Idade = pessoa.Idade,
                    TotalReceitas = receitas,
                    TotalDespesas = despesas,
                    Saldo = receitas - despesas,
                    Transacoes = transacoesDaPessoa.Select(t => new TransacoesResponseDTO
                    {
                        IdTransacoes = t.IdTransacoes,
                        Descricao = t.Descricao,
                        Valor = t.Valor,
                        TipoDespesa = t.TipoDespesa,
                        DataTransacao = t.DataTransacao.HasValue ? t.DataTransacao.Value : DateTime.MinValue
                    })
                });
            }

            return new RelatorioIndividualResponseDTO
            {
                DataInicio = dataInicio,
                DataFim = dataFim,
                Pessoas = resultadoPessoas
            };
        }

        public async Task<TransacoesPaginadasResponseDTO> ObterTransacoesPaginadas(
    string pessoaId,
    string tipo,
    string? termo,
    DateTime? dataInicio,
    DateTime? dataFim,
    int pagina,
    int tamanhoPagina)
        {
            try
            {
                var (items, totalRegistros) = await _transacoesRepository.ObterPaginado(
                    pessoaId,
                    tipo,
                    termo,
                    dataInicio,
                    dataFim,
                    pagina,
                    tamanhoPagina);

                var totalPaginas = (int)Math.Ceiling(totalRegistros / (double)tamanhoPagina);

                var itemsDto = items.Select(t => new TransacoesResponseDTO
                {
                    IdTransacoes = t.IdTransacoes,
                    Descricao = t.Descricao,
                    Valor = t.Valor,
                    TipoDespesa = t.TipoDespesa,
                    TipoDespesaNome = t.TipoDespesa,
                    DataTransacao = t.DataTransacao,
                    IdPessoa = t.IdPessoa,
                    PessoaNome = t.Pessoas?.Nome,
                });

                return new TransacoesPaginadasResponseDTO
                {
                    TotalRegistros = totalRegistros,
                    PaginaAtual = pagina,
                    TotalPaginas = totalPaginas == 0 ? 1 : totalPaginas,
                    Items = itemsDto
                };
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Erro ao buscar a lista paginada de transações.", ex);
            }
        }
        public async Task<DashboardResumoDTO> ObterResumoGeral()
        {
            try
            {
                // 1. Busca os totais globais
                var totalReceitasGeral = await _transacoesRepository.ObterTotalReceitasGeral();
                var totalDespesasGeral = await _transacoesRepository.ObterTotalDespesasGeral();
                var totalTransacoesCount = await _transacoesRepository.ObterTotalTransacoesGeral();

                // 2. Busca todas as pessoas para montar o resumo individual
                var pessoasEntidade = await _pessoasRepository.ObterTodos();
                var resumosPessoas = new List<ResumoPessoaDTO>();

                foreach (var pessoa in pessoasEntidade)
                {
                    var totalReceitasPessoa = await _transacoesRepository.ObterTotalReceitasPorPessoa(pessoa.IdPessoas);
                    var totalDespesasPessoa = await _transacoesRepository.ObterTotalDespesasPorPessoa(pessoa.IdPessoas);
                    var qtdTransacoesPessoa = await _transacoesRepository.ObterQtdTotalTransacoesPorPessoa(pessoa.IdPessoas);

                    var ultimasTransacoesEntidades = await _transacoesRepository.ObterUltimasTransacoesPorPessoa(pessoa.IdPessoas, 5);

                    var ultimasTransacoesDTO = ultimasTransacoesEntidades.Select(t => new TransacaoResumoDTO
                    {
                        Id = t.IdTransacoes.ToString(),
                        Descricao = t.Descricao,
                        Valor = t.Valor,
                        DataTransacao = t.DataTransacao,
                        Tipo = t.TipoDespesa.ToString().ToLower(),
                    }).ToList();

                    resumosPessoas.Add(new ResumoPessoaDTO
                    {
                        Pessoa = new PessoaDTO
                        {
                            Id = pessoa.IdPessoas.ToString(),
                            Nome = pessoa.Nome,
                            Idade = pessoa.Idade
                        },
                        TotalReceitas = totalReceitasPessoa,
                        TotalDespesas = totalDespesasPessoa,
                        Saldo = totalReceitasPessoa - totalDespesasPessoa,
                        QtdTransacoes = qtdTransacoesPessoa,
                        UltimasTransacoes = ultimasTransacoesDTO
                    });
                }

                return new DashboardResumoDTO
                {
                    TotalReceitasGeral = totalReceitasGeral,
                    TotalDespesasGeral = totalDespesasGeral,
                    SaldoLiquidoGeral = totalReceitasGeral - totalDespesasGeral,
                    TotalPessoas = resumosPessoas.Count,
                    TotalTransacoes = totalTransacoesCount,
                    QtdMenoresDeIdade = resumosPessoas.Count(p => p.Pessoa.Idade < 18),
                    Pessoas = resumosPessoas
                };
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Erro ao calcular o resumo geral do dashboard.", ex);
            }
        }

        public async Task<ResumoPessoaDTO> ObterResumoPessoaComExtratoPaginado(
     Guid idPessoa,
     string? termo = null,
     string? tipo = "todos",
     DateTime? dataInicio = null,
     DateTime? dataFim = null,
     int pagina = 1,
     int tamanhoPagina = 5)
        {
            try
            {
                var pessoa = await _pessoasRepository.ObterPorId(idPessoa);
                if (pessoa == null)
                {
                    throw new KeyNotFoundException($"Pessoa com ID '{idPessoa}' não encontrada.");
                }

                var paginaAtual = pagina < 1 ? 1 : pagina;
                var tamanho = tamanhoPagina < 1 ? 5 : tamanhoPagina;

                // 1. Totais absolutos (permanecem globais para a pessoa)
                var totalReceitas = await _transacoesRepository.ObterTotalReceitasPorPessoa(idPessoa);
                var totalDespesas = await _transacoesRepository.ObterTotalDespesasPorPessoa(idPessoa);
                var qtdTotalTransacoes = await _transacoesRepository.ObterQtdTotalTransacoesPorPessoa(idPessoa);

                // 2. Busca dados filtrados considerando termo, tipo e datas
                var totalFiltradas = await _transacoesRepository.ObterTotalTransacoesFiltradas(idPessoa, termo, tipo);

                var transacoesEntidade = await _transacoesRepository.ObterTransacoesPorPessoa(
                    idPessoa,
                    termo,
                    tipo,
                    dataInicio, // Novo
                    dataFim,    // Novo
                    paginaAtual,
                    tamanho);

                var totalPaginas = (int)Math.Ceiling(totalFiltradas / (double)tamanho);

                return new ResumoPessoaDTO
                {
                    Pessoa = new PessoaDTO
                    {
                        Id = pessoa.IdPessoas.ToString(),
                        Nome = pessoa.Nome,
                        Idade = pessoa.Idade
                    },
                    TotalReceitas = totalReceitas,
                    TotalDespesas = totalDespesas,
                    Saldo = totalReceitas - totalDespesas,
                    QtdTransacoes = qtdTotalTransacoes,
                    TotalTransacoesFiltradas = totalFiltradas,
                    PaginaAtual = paginaAtual,
                    TotalPaginas = totalPaginas == 0 ? 1 : totalPaginas,
                    UltimasTransacoes = transacoesEntidade.Select(t => new TransacaoResumoDTO
                    {
                        Id = t.IdTransacoes.ToString(),
                        Descricao = t.Descricao,
                        Valor = t.Valor,
                        DataTransacao = t.DataTransacao,
                        Tipo = t.TipoDespesa,
                    })
                };
            }
            catch (KeyNotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Erro ao obter extrato paginado da pessoa com ID '{idPessoa}'.", ex);
            }
        }
    }
}

