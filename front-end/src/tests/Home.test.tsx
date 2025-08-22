/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from "@testing-library/react";
import Home from "../pages/Home";
import { vi } from "vitest";

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        {
          chassi: "123",
          placa: "ABC-1234",
          identificador: "Veículo 1",
          cor: "Vermelho",
          tipoVeiculo: 1,
          latitude: -23.5,
          longitude: -46.6,
        },
      ]),
  })
) as any;

vi.stubGlobal("navigator", {
  geolocation: {
    getCurrentPosition: (cb: any) => cb({ coords: { latitude: -23.5, longitude: -46.6 } }),
  },
});

describe("Home", () => {
  it("deve renderizar a lista de veículos", async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText("Veículo 1")).toBeInTheDocument();
    });

    expect(screen.getByText("Placa:")).toBeInTheDocument();
    expect(screen.getByText("Chassi:")).toBeInTheDocument();
  });
});
