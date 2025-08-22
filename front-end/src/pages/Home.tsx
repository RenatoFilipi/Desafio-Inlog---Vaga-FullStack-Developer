import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Vehicle } from "@/lib/interfaces";
import { haversineDistance, type appState } from "@/lib/utils";
import { BirdIcon, CarIcon, Loader2Icon, MapPinIcon, PlusIcon, XCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

type tabType = "vehicle-list" | "map";

const tabs: { label: string; type: tabType }[] = [
  { label: "Lista de veículos", type: "vehicle-list" },
  { label: "Mapa", type: "map" },
];

const Home = () => {
  const [appState, setAppState] = useState<appState>("loading");
  const [vehicles, setVehicles] = useState<(Vehicle & { distance?: number })[]>([]);
  const [currentTab, setCurrentTab] = useState<tabType>("vehicle-list");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setAppState("loading");
        navigator.geolocation.getCurrentPosition(async (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;
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
      <div className="flex flex-col w-full gap-12 sm:max-w-7xl px-4 sm:px-0">
        <div className="flex flex-col gap-4">
          <div className="w-full flex justify-between items-center gap-3 flex-col sm:flex-row">
            <div className="flex flex-col gap-1 w-full sm:w-fit">
              <h1 className="font-bold text-xl">Carros cadastrados</h1>
              <p className="text-sm text-muted-foreground">Listagem dos carros cadastrados na nossa base de dados</p>
            </div>
            <Button className="w-full sm:w-fit">
              <PlusIcon />
              Cadastrar Novo Carro
            </Button>
          </div>
          <div className="flex border-b w-full">
            {tabs.map((tab) => {
              const isCurrentTab = currentTab === tab.type;
              return (
                <button
                  onClick={() => setCurrentTab(tab.type)}
                  key={tab.type}
                  className={`${
                    isCurrentTab ? "text-primary" : "text-foreground/70 hover:text-foreground"
                  } relative px-4 py-2 text-sm font-medium cursor-pointer`}>
                  {tab.label}
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
                <XCircleIcon className="text-foreground w-8 h-8" />
                <span className="text-sm text-muted-foreground">Erro na busca dos carros cadastrados</span>
              </div>
            )}
            {appState === "loading" && (
              <div className="flex justify-center items-center w-full h-72 flex-col gap-2">
                <Loader2Icon className="text-primary w-8 h-8 animate-spin" />
                <span className="text-sm text-muted-foreground">Buscando os carros cadastrados...</span>
              </div>
            )}
            {appState === "idle" && vehicles.length <= 0 && (
              <Card className="flex justify-center items-center w-full h-72 flex-col bg-foreground/5 p-5 gap-4">
                <CarIcon className="text-primary w-8 h-8" />
                <p className="text-sm text-muted-foreground text-center">
                  Nenhum carro cadastrado na base de dados, cadastre para ver na lista.
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
          <Card className="flex justify-center items-center w-full h-72 flex-col gap-3">
            <BirdIcon className="text-primary" />
            <span>Trabalho em progresso.</span>
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
        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
          <CarIcon className="w-7 h-7 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg">{vehicle.identificador}</span>
          <span className="text-sm text-muted-foreground">{tipoVeiculoLabel}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-sm sm:text-base text-muted-foreground">
        <div className="flex flex-wrap gap-4">
          <div>
            <span className="font-medium">Placa:</span> {vehicle.placa}
          </div>
          <div>
            <span className="font-medium">Chassi:</span> {vehicle.chassi}
          </div>
          <div>
            <span className="font-medium">Cor:</span> {vehicle.cor}
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
