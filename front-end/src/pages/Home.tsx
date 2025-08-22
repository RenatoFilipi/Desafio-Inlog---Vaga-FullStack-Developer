import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import type { Coordinates, Vehicle } from "../lib/interfaces";
import { haversineDistance, type appState } from "../lib/utils";
import {
  BusIcon,
  CarIcon,
  Loader2Icon,
  MapIcon,
  MapPinIcon,
  PlusIcon,
  TruckIcon,
  XCircleIcon,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ModeToggle from "../components/mode-toggle";

type tabType = "vehicle-list" | "map";

const tabs: { label: string; type: tabType; icon: LucideIcon }[] = [
  { label: "Lista de veículos", type: "vehicle-list", icon: CarIcon },
  { label: "Mapa", type: "map", icon: MapIcon },
];

const Home = () => {
  const [appState, setAppState] = useState<appState>("loading");
  const [vehicles, setVehicles] = useState<(Vehicle & { distance?: number })[]>([]);
  const [currentTab, setCurrentTab] = useState<tabType>("vehicle-list");
  const [userCoodinates, setUserCoodinates] = useState<Coordinates>({ latitude: 0, longitude: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setAppState("loading");
        navigator.geolocation.getCurrentPosition(async (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;
          setUserCoodinates({ latitude: userLat, longitude: userLon });
          const response = await fetch("https://localhost:7222/api/Veiculo/Listar");
          if (!response.ok) throw new Error("");

          const jsonData = (await response.json()) as Vehicle[];

          const withDistance = jsonData.map((v) => ({
            ...v,
            distance: haversineDistance(userLat, userLon, v.latitude, v.longitude),
          }));

          const sorted = withDistance.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));

          setVehicles(sorted);
          setAppState("idle");
        });
      } catch (error) {
        console.log(error);
        setAppState("error");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col justify-start items-center w-full min-h-dvh py-10 gap-10">
      <div className="flex flex-col w-full gap-12 sm:max-w-7xl px-4 sm:px-0 h-full flex-1">
        <div className="flex flex-col gap-4">
          <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex flex-col gap-1 w-full sm:w-auto text-center sm:text-left">
              <h1 className="text-xl font-bold">Carros cadastrados</h1>
              <p className="text-sm text-muted-foreground">Listagem dos carros cadastrados na nossa base de dados</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <ModeToggle />
              <Button className="w-full sm:w-auto" asChild>
                <a href="/new-car" className="flex items-center justify-center gap-1">
                  <PlusIcon />
                  Cadastrar Novo Carro
                </a>
              </Button>
            </div>
          </div>
          <div className="flex border-b w-full">
            {tabs.map((tab) => {
              const isCurrentTab = currentTab === tab.type;
              return (
                <button
                  onClick={() => setCurrentTab(tab.type)}
                  key={tab.type}
                  className={`relative px-4 py-2 text-sm font-medium cursor-pointer flex justify-center items-center gap-2`}>
                  <tab.icon className={`${isCurrentTab ? "text-primary" : "text-muted-foreground/80"} w-5 h-5`} />
                  <span className={`${isCurrentTab ? "text-foreground" : "text-muted-foreground/80"}`}>
                    {tab.label}
                  </span>
                  {isCurrentTab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t" />}
                </button>
              );
            })}
          </div>
        </div>
        {currentTab === "vehicle-list" && (
          <div className="w-full">
            {appState === "error" && (
              <div className="flex justify-center items-center w-full h-72 flex-col gap-2">
                <XCircleIcon className="text-destructive w-8 h-8" />
                <span className="text-sm font-medium text-destructive">Não foi possível carregar os veículos.</span>
                <span className="text-xs text-muted-foreground">Verifique sua conexão e tente novamente.</span>
              </div>
            )}
            {appState === "loading" && (
              <div className="flex justify-center items-center w-full h-72 flex-col gap-2">
                <Loader2Icon className="text-primary w-8 h-8 animate-spin" />
                <span className="text-sm font-medium">Carregando veículos...</span>
                <span className="text-xs text-muted-foreground">Aguarde um instante enquanto buscamos os dados.</span>
              </div>
            )}
            {appState === "idle" && vehicles.length <= 0 && (
              <Card className="flex justify-center items-center w-full h-72 flex-col bg-foreground/5 p-5 gap-4">
                <CarIcon className="text-primary w-8 h-8" />
                <p className="text-sm font-medium text-center">Nenhum veículo cadastrado.</p>
                <p className="text-xs text-muted-foreground text-center">
                  Cadastre um novo veículo para vê-lo listado aqui.
                </p>
              </Card>
            )}
            {appState === "idle" && vehicles.length > 0 && (
              <div className="flex flex-col w-full gap-6">
                {vehicles.map((vehicle) => {
                  return <VehicleCard key={vehicle.chassi} vehicle={vehicle} />;
                })}
              </div>
            )}
          </div>
        )}
        {currentTab === "map" && (
          <Card className="w-full h-[600px] p-0 overflow-hidden">
            <MapContainer
              center={[userCoodinates.latitude, userCoodinates.longitude]}
              zoom={14}
              className="w-full h-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[userCoodinates.latitude, userCoodinates.longitude]}>
                <Popup>📍 Você está aqui</Popup>
              </Marker>
              {vehicles.map((v) => (
                <Marker key={v.chassi} position={[v.latitude, v.longitude]}>
                  <Popup>
                    <strong>{v.identificador}</strong>
                    <br />
                    Placa: {v.placa}
                    <br />
                    Cor: {v.cor}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Card>
        )}
      </div>
    </div>
  );
};

const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
  const tipoVeiculoLabel = vehicle.tipoVeiculo === 1 ? "Ônibus" : "Caminhão";

  return (
    <Card className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 p-5 hover:shadow transition-shadow duration-300">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-foreground/5 rounded flex items-center justify-center">
          {tipoVeiculoLabel === "Ônibus" && <BusIcon className="w-7 h-7 text-primary" />}
          {tipoVeiculoLabel === "Caminhão" && <TruckIcon className="w-7 h-7 text-primary" />}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg">{vehicle.identificador}</span>
          <span className="text-sm text-muted-foreground">{tipoVeiculoLabel}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-sm sm:text-base text-muted-foreground">
        <div className="flex flex-wrap gap-4">
          <div>
            <span className="font-semibold">Placa:</span> {vehicle.placa}
          </div>
          <div>
            <span className="font-semibold">Chassi:</span> {vehicle.chassi}
          </div>
          <div>
            <span className="font-semibold">Cor:</span> {vehicle.cor}
          </div>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground/70 mt-1">
          <MapPinIcon className="w-4 h-4" />
          <span>
            {vehicle.latitude.toFixed(4)}, {vehicle.longitude.toFixed(4)}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default Home;
