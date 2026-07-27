using DomusFi.Application.DTO;
using DomusFi.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
    private readonly IPessoasService _pessoasService;

    public PessoasController(IPessoasService pessoasService)
    {
        _pessoasService = pessoasService;
    }
    /// <summary>
    /// Retorna a lista de todas as pessoas cadastradas no sistema.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> ObterTodos()
    {
        try
        {
            var response = await _pessoasService.ObterTodos();
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { mensagem = "Erro ao buscar a lista de pessoas.", detalhe = ex.Message });
        }
    }

    /// <summary>
    /// Busca os dados de uma pessoa específica através do seu identificador único (ID).
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> ObterPorId(Guid id)
    {
        try
        {
            var response = await _pessoasService.ObterPorId(id);
            if (response == null)
            {
                return NotFound(new { mensagem = $"Pessoa com ID '{id}' não foi encontrada." });
            }

            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { mensagem = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { mensagem = "Erro interno ao buscar dados da pessoa.", detalhe = ex.Message });
        }
    }

    /// <summary>
    /// Cadastra uma nova pessoa no sistema.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Adicionar([FromBody] PessoasRequestDTO request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _pessoasService.Adicionar(request);
            return CreatedAtAction(nameof(ObterPorId), new { id = response.IdPessoas }, response);
        }
        catch (ArgumentException ex)
        {
            // Para validações de domínio (ex: idade negativa, nome em branco)
            return BadRequest(new { mensagem = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { mensagem = "Erro interno ao cadastrar a pessoa.", detalhe = ex.Message });
        }
    }

    /// <summary>
    /// Remove uma pessoa do sistema e exclui em cascata todas as suas transações vinculadas.
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Deletar(Guid id)
    {
        try
        {
            await _pessoasService.Deletar(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { mensagem = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { mensagem = "Erro interno ao excluir a pessoa e suas transações vinculadas.", detalhe = ex.Message });
        }
    }
}