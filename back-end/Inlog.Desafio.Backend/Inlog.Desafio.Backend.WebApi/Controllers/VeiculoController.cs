using Inlog.Desafio.Backend.Application.Contracts;
using Inlog.Desafio.Backend.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Inlog.Desafio.Backend.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VeiculoController : ControllerBase
{
    private readonly IVeiculoService _service;

    public VeiculoController(IVeiculoService service)
    {
        _service = service;
    }

    [HttpPost("Cadastrar")]
    public async Task<IActionResult> Cadastrar([FromBody] VeiculoRequest request, CancellationToken ct)
    {
        try
        {
            await _service.CadastrarAsync(request, ct);
            return Ok("Veículo cadastrado com sucesso!");
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }

    [HttpGet("Listar")]
    public async Task<IActionResult> Listar(CancellationToken ct)
    {
        try
        {
            var veiculos = await _service.ListarAsync(ct);
            return Ok(veiculos);
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }
}
