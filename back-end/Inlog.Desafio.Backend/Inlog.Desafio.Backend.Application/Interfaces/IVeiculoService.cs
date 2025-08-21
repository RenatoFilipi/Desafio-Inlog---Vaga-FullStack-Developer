using Inlog.Desafio.Backend.Application.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inlog.Desafio.Backend.Application.Interfaces
{
    public interface IVeiculoService
    {
        Task CadastrarAsync(VeiculoRequest request, CancellationToken ct = default);
        Task<IReadOnlyList<VeiculoResponse>> ListarAsync(CancellationToken ct = default);
    }
}
