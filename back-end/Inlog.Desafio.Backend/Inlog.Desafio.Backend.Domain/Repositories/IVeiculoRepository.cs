using Inlog.Desafio.Backend.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inlog.Desafio.Backend.Domain.Repositories
{
    public interface IVeiculoRepository
    {
        Task AdicionarAsync(Veiculo veiculo, CancellationToken ct = default);
        Task<IReadOnlyList<Veiculo>> ListarAsync(CancellationToken ct = default);
    }
}
