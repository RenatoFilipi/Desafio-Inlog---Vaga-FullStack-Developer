using Inlog.Desafio.Backend.Domain.Models;
using Inlog.Desafio.Backend.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inlog.Desafio.Backend.Infra.Database.Repositories
{
    public class VeiculoRepository: IVeiculoRepository
    {
        private static readonly List<Veiculo> _db = new();

        public Task AdicionarAsync(Veiculo veiculo, CancellationToken ct = default)
        {
            if (_db.Any(v => v.Chassi.Equals(veiculo.Chassi, StringComparison.OrdinalIgnoreCase)))
            {
                throw new InvalidOperationException($"Veículo com chassi '{veiculo.Chassi}' já cadastrado.");
            }
            _db.Add(veiculo);
            return Task.CompletedTask;
        }

        public Task<IReadOnlyList<Veiculo>> ListarAsync(CancellationToken ct = default)
        {
            return Task.FromResult<IReadOnlyList<Veiculo>>(_db.ToList());
        }
    }
}
