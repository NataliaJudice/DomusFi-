using DomusFi.Application.DTO;
using DomusFi.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly ITransacoesService _transacoesService;

    public TransacoesController(ITransacoesService transacoesService)
    {
        _transacoesService = transacoesService;
    }

    /// <summary>
    /// Retorna a lista de todas as transações cadastradas.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> ObterTodos()
    {
        try
        {
            var response = await _transacoesService.ObterTodos();
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { mensagem = "Erro ao buscar a lista de transações.", detalhe = ex.Message });
        }
    }

    /// <summary>
    /// Cadastra uma nova transação no sistema.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Adicionar([FromBody] TransacoesRequestDTO request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _transacoesService.Adicionar(request);
            return Ok(response);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { mensagem = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { mensagem = "Erro interno ao cadastrar transação.", detalhe = ex.Message });
        }
    }

    /// <summary>
    /// Obtém uma lista paginada de transações com filtros por pessoa, tipo, termo de busca e período.
    /// </summary>
    [HttpGet("paginadas")]
    public async Task<ActionResult<TransacoesPaginadasResponseDTO>> ObterTransacoesPaginadas(
        [FromQuery] string pessoaId = "todas",
        [FromQuery] string tipo = "todos",
        [FromQuery] string? termo = null,
        [FromQuery] DateTime? dataInicio = null,
        [FromQuery] DateTime? dataFim = null,
        [FromQuery] int pagina = 1,
        [FromQuery] int tamanhoPagina = 8)
    {
        try
        {
            if (pagina < 1 || tamanhoPagina < 1)
            {
                return BadRequest(new { mensagem = "Os parâmetros 'pagina' e 'tamanhoPagina' devem ser maiores que zero." });
            }

            var response = await _transacoesService.ObterTransacoesPaginadas(
                pessoaId,
                tipo,
                termo,
                dataInicio,
                dataFim,
                pagina,
                tamanhoPagina);

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { mensagem = "Erro ao obter o histórico paginado de transações.", detalhe = ex.Message });
        }
    }

    /// <summary>
    /// Retorna os dados consolidados para o dashboard geral.
    /// </summary>
    [HttpGet("resumo")]
    public async Task<ActionResult<DashboardResumoDTO>> ObterResumoGeral()
    {
        try
        {
            var resultado = await _transacoesService.ObterResumoGeral();
            return Ok(resultado);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { mensagem = "Erro ao calcular o resumo do dashboard.", detalhe = ex.Message });
        }
    }

    /// <summary>
    /// Obtém o resumo financeiro detalhado e o extrato paginado de transações de uma pessoa específica.
    /// </summary>
    [HttpGet("pessoa/{idPessoa:guid}")]
    public async Task<ActionResult<ResumoPessoaDTO>> ObterTransacoesPorPessoa(
     Guid idPessoa,
     [FromQuery] string? termo,
     [FromQuery] string? tipo,
     [FromQuery] DateTime? dataInicio, // Novo
     [FromQuery] DateTime? dataFim,   // Novo
     [FromQuery] int pagina = 1,
     [FromQuery] int tamanhoPagina = 5)
    {
        try
        {
            var resultado = await _transacoesService.ObterResumoPessoaComExtratoPaginado(
                idPessoa,
                termo,
                tipo,
                dataInicio, // Novo
                dataFim,    // Novo
                pagina,
                tamanhoPagina);
            return Ok(resultado);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { mensagem = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { mensagem = "Erro interno ao processar a consulta.", detalhe = ex.Message });
        }
    }

    /// <summary>
    /// Gera um relatório de ranking das pessoas com base no tipo de transação e período.
    /// </summary>
    [HttpGet("ranking")]
    public async Task<ActionResult<RelatorioRankingResponseDTO>> ObterRanking(
        [FromQuery] string tipo = "receita",
        [FromQuery] DateTime? dataInicio = null,
        [FromQuery] DateTime? dataFim = null)
    {
        try
        {
            var resultado = await _transacoesService.ObterRankingPorTipo(tipo, dataInicio, dataFim);
            return Ok(resultado);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { mensagem = "Erro ao gerar o relatório de ranking.", detalhe = ex.Message });
        }
    }

    /// <summary>
    /// Gera um relatório individual ou consolidado contendo os lançamentos filtrados por período.
    /// </summary>
    [HttpGet("individual")]
    public async Task<ActionResult<RelatorioIndividualResponseDTO>> ObterRelatorioIndividual(
        [FromQuery] Guid? idPessoa = null,
        [FromQuery] DateTime? dataInicio = null,
        [FromQuery] DateTime? dataFim = null)
    {
        try
        {
            var resultado = await _transacoesService.ObterRelatorioIndividual(idPessoa, dataInicio, dataFim);
            return Ok(resultado);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { mensagem = "Erro ao gerar o relatório individual.", detalhe = ex.Message });
        }
    }
}