using Inlog.Desafio.Backend.Domain.Models;

namespace Inlog.Desafio.Backend.Application.Contracts
{
    public class VeiculoResponse
    {
        public string Chassi { get; set; } = null!;
        public TipoVeiculo TipoVeiculo { get; set; }
        public string Cor { get; set; } = null!;
        public string Identificador { get; set; } = null!;
        public string Placa { get; set; } = null!;
        public string SerieRastreador { get; set; } = null!;
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
    }
}
