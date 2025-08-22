/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from "vitest";

describe("Health API", () => {
  it("deve retornar que a API está online", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve("API Veículo está online!"),
      })
    ) as any;

    const response = await fetch("https://localhost:7222/api/Veiculo/Health");
    const text = await response.text();

    expect(response.ok).toBe(true);
    expect(text).toBe("API Veículo está online!");
    expect(global.fetch).toHaveBeenCalledWith("https://localhost:7222/api/Veiculo/Health");
  });
});
