using Inlog.Desafio.Backend.Application.Contracts;
using Inlog.Desafio.Backend.Application.Services;
using Inlog.Desafio.Backend.Domain.Models;
using Inlog.Desafio.Backend.Infra.Database.Repositories;
using System.ComponentModel.DataAnnotations;
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
            TipoVeiculo = TipoVeiculo.Onibus,
            Cor = "Azul",
            Identificador = "Veiculo Teste",
            Placa = "ABC-1234",
            SerieRastreador = "SR123",
            Latitude = -23.5505m,
            Longitude = -46.6333m
        };

        await service.CadastrarAsync(request);
        var veiculos = await service.ListarAsync();

        Assert.Single(veiculos);
        var veiculo = veiculos[0];
        Assert.Equal("1234567890", veiculo.Chassi);
        Assert.Equal("Azul", veiculo.Cor);
        Assert.Equal("Veiculo Teste", veiculo.Identificador);
        Assert.Equal("ABC-1234", veiculo.Placa);
        Assert.Equal("SR123", veiculo.SerieRastreador);
        Assert.Equal(-23.5505m, veiculo.Latitude);
        Assert.Equal(-46.6333m, veiculo.Longitude);
    }

    [Fact]
    public async Task Nao_Deve_Cadastrar_Veiculo_Com_Campos_Obrigatorios_Ausentes()
    {
        var repo = new VeiculoRepository();
        var service = new VeiculoService(repo);

        var request = new VeiculoRequest
        {
            Chassi = "",
            TipoVeiculo = TipoVeiculo.Onibus,
            Cor = "",
            Identificador = "",
            Placa = "",
            SerieRastreador = "",
            Latitude = 0,
            Longitude = 0
        };

        await Assert.ThrowsAsync<ValidationException>(() => service.CadastrarAsync(request));
    }
}
