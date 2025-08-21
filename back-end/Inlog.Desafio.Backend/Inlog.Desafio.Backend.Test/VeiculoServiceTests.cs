using Inlog.Desafio.Backend.Application.Contracts;
using Inlog.Desafio.Backend.Application.Services;
using Inlog.Desafio.Backend.Infra.Database.Repositories;
using Xunit;

namespace Inlog.Desafio.Backend.Test;

public class VeiculoServiceTests
{
    [Fact]
    public async Task Deve_Cadastrar_E_Listar_Veiculo()
    {
        var repo = new VeiculoRepository();
        var service = new VeiculoService(repo);

        var request = new VeiculoRequest
        {
            Chassi = "1234567890",
            TipoVeiculo = Domain.Models.TipoVeiculo.Onibus,
            Cor = "Azul"
        };

        await service.CadastrarAsync(request);

        var veiculos = await service.ListarAsync();

        Assert.Single(veiculos);
        Assert.Equal("1234567890", veiculos[0].Chassi);
        Assert.Equal("Azul", veiculos[0].Cor);
    }
}
