using Inlog.Desafio.Backend.Domain.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inlog.Desafio.Backend.Application.Contracts
{
    public class VeiculoRequest
    {
        [Required] public string Chassi { get; set; } = null!;
        [Required] public TipoVeiculo TipoVeiculo { get; set; }
        [Required] public string Cor { get; set; } = null!;
    }
}
