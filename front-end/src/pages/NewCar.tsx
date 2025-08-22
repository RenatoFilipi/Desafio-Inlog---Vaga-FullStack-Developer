import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { CheckCircle2Icon, ChevronLeftIcon, Loader2Icon, PlusIcon, XCircleIcon } from "lucide-react";
import type { appState } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import type { Vehicle, VehicleType } from "@/lib/interfaces";

const NewCar = () => {
  const [appState, setAppState] = useState<appState>("idle");

  const vehicleSchema = z.object({
    chassi: z.string().min(3, "Chassi obrigatório"),
    tipoVeiculo: z.string().min(1, "Selecione o tipo"),
    cor: z.string().min(3, "Cor obrigatória"),
    identificador: z.string().min(1, "Identificador obrigatório"),
    placa: z.string().min(7, "Placa inválida"),
    serieRastreador: z.string().min(3, "Série do rastreador obrigatória"),
    latitude: z.string().min(1, "Latitude obrigatória"),
    longitude: z.string().min(1, "Longitude obrigatória"),
  });

  const form = useForm<z.infer<typeof vehicleSchema>>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      chassi: "",
      tipoVeiculo: "1",
      cor: "",
      identificador: "",
      placa: "",
      serieRastreador: "",
      latitude: "",
      longitude: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof vehicleSchema>) => {
    try {
      const tipoVeiculo = parseInt(values.tipoVeiculo, 10);
      const latitude = parseFloat(values.latitude);
      const longitude = parseFloat(values.longitude);

      if (isNaN(tipoVeiculo) || tipoVeiculo < 1) {
        alert("Tipo de veículo inválido.");
        return;
      }

      if (isNaN(latitude) || latitude < -90 || latitude > 90) {
        alert("Latitude inválida. Deve estar entre -90 e 90.");
        return;
      }

      if (isNaN(longitude) || longitude < -180 || longitude > 180) {
        alert("Longitude inválida. Deve estar entre -180 e 180.");
        return;
      }

      console.log("🚗 Dados do veículo:", {
        ...values,
        tipoVeiculo,
        latitude,
        longitude,
      });

      setAppState("loading");
      const params: Vehicle = {
        chassi: values.chassi,
        cor: values.cor,
        identificador: values.identificador,
        placa: values.placa,
        serieRastreador: values.serieRastreador,
        tipoVeiculo: tipoVeiculo as VehicleType,
        latitude,
        longitude,
      };

      const response = await fetch("https://localhost:7222/api/Veiculo/Cadastrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar um novo veículo.");
      }
      setAppState("success");
    } catch (error) {
      console.log(error);
      setAppState("error");
    }
  };

  return (
    <div className="flex flex-col justify-start items-center w-full min-h-dvh py-10 gap-10">
      <div className="flex flex-col w-full gap-12 sm:max-w-7xl px-4 sm:px-0 h-full flex-1">
        <div className="flex flex-col gap-4">
          <div className="w-full flex justify-between items-center gap-3 flex-col sm:flex-row">
            <div className="flex flex-col gap-1 w-full sm:w-fit">
              <h1 className="font-bold text-xl">Carros cadastrados</h1>
              <p className="text-sm text-muted-foreground">Listagem dos carros cadastrados na nossa base de dados</p>
            </div>
            <Button
              variant="outline"
              className="w-full sm:w-fit"
              disabled={appState === "loading"}
              onClick={() => (window.location.href = "/")}>
              <ChevronLeftIcon />
              Voltar
            </Button>
          </div>
        </div>
        <Form {...form}>
          <Card className="p-4 relative flex w-full h-full rounded-none">
            {appState === "loading" && (
              <div className="absolute inset-0 flex justify-center items-center flex-col gap-2 bg-background/70 backdrop-blur-sm z-10">
                <Loader2Icon className="w-9 h-9 animate-spin text-primary" />
                <span className="text-sm font-medium">Salvando veículo... Aguarde um instante.</span>
              </div>
            )}
            {appState === "error" && (
              <div className="absolute inset-0 flex justify-center items-center flex-col gap-2 bg-background/70 backdrop-blur-sm z-10">
                <XCircleIcon className="w-9 h-9 text-destructive" />
                <span className="text-sm font-medium">Não foi possível concluir o cadastro.</span>
                <span className="text-xs text-muted-foreground">Verifique os dados e tente novamente.</span>
                <div className="flex justify-center items-center gap-4 mt-3">
                  <Button variant="outline" onClick={() => (window.location.href = "/")}>
                    <ChevronLeftIcon />
                    Voltar para a lista
                  </Button>
                  <Button variant="secondary" onClick={() => setAppState("idle")}>
                    <PlusIcon />
                    Tentar novamente
                  </Button>
                </div>
              </div>
            )}
            {appState === "success" && (
              <div className="absolute inset-0 flex justify-center items-center flex-col gap-2 bg-background/70 backdrop-blur-sm z-10">
                <CheckCircle2Icon className="w-9 h-9 text-green-600" />
                <span className="text-sm font-medium">Veículo cadastrado com sucesso!</span>
                <span className="text-xs text-muted-foreground">
                  Você pode voltar à lista ou registrar outro veículo.
                </span>
                <div className="flex justify-center items-center gap-4 mt-3">
                  <Button variant="outline" onClick={() => (window.location.href = "/")}>
                    <ChevronLeftIcon />
                    Voltar para a lista
                  </Button>
                  <Button onClick={() => setAppState("idle")}>
                    <PlusIcon />
                    Novo cadastro
                  </Button>
                </div>
              </div>
            )}
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={`${appState === "loading" ? "blur pointer-events-none" : ""} flex flex-col gap-6`}>
              <FormField
                control={form.control}
                name="chassi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chassi</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o chassi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tipoVeiculo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo do Veículo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Onibus</SelectItem>
                        <SelectItem value="2">Caminhão</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a cor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="identificador"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identificador</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o identificador" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="placa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placa</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a placa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serieRastreador"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Série do Rastreador</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a série do rastreador" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: -23.5505" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: -46.6333" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">
                Salvar
              </Button>
            </form>
          </Card>
        </Form>
      </div>
    </div>
  );
};

export default NewCar;
