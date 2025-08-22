/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import NewCar from "../pages/NewCar";

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
) as any;

describe("NewCar", () => {
  it("deve permitir preencher e enviar o formulário com sucesso", async () => {
    render(<NewCar />);

    fireEvent.change(screen.getByPlaceholderText("Digite o chassi"), { target: { value: "MMM444NNN555OOO666" } });
    fireEvent.change(screen.getByPlaceholderText("Digite a cor"), { target: { value: "amarelo" } });
    fireEvent.change(screen.getByPlaceholderText("Digite o identificador"), { target: { value: "Veic‑5" } });
    fireEvent.change(screen.getByPlaceholderText("Digite a placa"), { target: { value: "QRS4T56" } });
    fireEvent.change(screen.getByPlaceholderText("Digite a série do rastreador"), { target: { value: "RST‑0005" } });
    fireEvent.change(screen.getByPlaceholderText("Ex: -23.5505"), { target: { value: "-22.9595" } });
    fireEvent.change(screen.getByPlaceholderText("Ex: -46.6333"), { target: { value: "-46.9978" } });

    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(screen.getByText("Veículo cadastrado com sucesso!")).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://localhost:7222/api/Veiculo/Cadastrar",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.any(String),
      })
    );
  });
});
