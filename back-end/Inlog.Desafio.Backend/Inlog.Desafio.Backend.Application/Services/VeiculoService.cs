using Inlog.Desafio.Backend.Application.Contracts;
using Inlog.Desafio.Backend.Application.Interfaces;
using Inlog.Desafio.Backend.Domain.Models;
using Inlog.Desafio.Backend.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inlog.Desafio.Backend.Application.Services
{
    public class VeiculoService : IVeiculoService
    {
        private readonly IVeiculoRepository _repo;

        public VeiculoService(IVeiculoRepository repo)
        {
            _repo = repo;
        }
        public async Task CadastrarAsync(VeiculoRequest request, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(request.Chassi))
                throw new ArgumentException("Chassi é obrigatório");

            var veiculo = new Veiculo
            {
                Chassi = request.Chassi.Trim().ToUpperInvariant(),
                TipoVeiculo = request.TipoVeiculo,
                Cor = request.Cor.Trim()
            };

            await _repo.AdicionarAsync(veiculo, ct);
        }

        public async Task<IReadOnlyList<VeiculoResponse>> ListarAsync(CancellationToken ct = default)
        {
            var veiculos = await _repo.ListarAsync(ct);

            return veiculos.Select(v => new VeiculoResponse
            {
                Chassi = v.Chassi,
                TipoVeiculo = v.TipoVeiculo,
                Cor = v.Cor
            }).ToList();
        }
    }
}
