using Inlog.Desafio.Backend.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inlog.Desafio.Backend.Application.Contracts
{
    public class VeiculoResponse
    {
        public string Chassi { get; set; } = "";
        public TipoVeiculo TipoVeiculo { get; set; }
        public string Cor { get; set; } = "";
    }
}
