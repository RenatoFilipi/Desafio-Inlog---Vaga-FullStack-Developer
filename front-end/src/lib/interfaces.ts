export type VehicleType = 1 | 2;

export interface Vehicle {
  chassi: string;
  tipoVeiculo: VehicleType;
  cor: string;
  identificador: string;
  placa: string;
  serieRastreador: string;
  latitude: number;
  longitude: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}
