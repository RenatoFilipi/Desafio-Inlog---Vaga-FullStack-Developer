using System.ComponentModel.DataAnnotations;

namespace Inlog.Desafio.Backend.Domain.Models;

public class Veiculo
{
    [Required] public string Chassi { get; set; } = null!;
    [Required] public TipoVeiculo TipoVeiculo { get; set; }
    [Required] public string Cor { get; set; } = null!;
    [Required] public string Identificador { get; set; } = null!;
    [Required] public string Placa { get; set; } = null!;
    [Required] public string SerieRastreador { get; set; } = null!;
    [Required] public decimal Latitude { get; set; }
    [Required] public decimal Longitude { get; set; }
}
