import { useMemo } from "react";

import { waterReadings } from "../data/projectData";
import { useSerial } from "../hooks/useSerial";
import type { LeituraAgua } from "../hooks/useSerial";

import SectionTitle from "./SectionTitle";
import StatCard from "./StatCard";
import WaterChart from "./WaterChart";

function obterStatus(nivel: number | null) {
  if (nivel === null) {
    return {
      texto: "Aguardando",
      cor: "bg-slate-100 text-slate-500",
      ponto: "bg-slate-400",
    };
  }

  if (nivel < 10) {
    return {
      texto: "Normal",
      cor: "bg-emerald-50 text-emerald-600",
      ponto: "bg-emerald-500",
    };
  }

  if (nivel < 15) {
    return {
      texto: "Atenção",
      cor: "bg-yellow-50 text-yellow-600",
      ponto: "bg-yellow-500",
    };
  }

  if (nivel < 20) {
    return {
      texto: "Alerta",
      cor: "bg-orange-50 text-orange-600",
      ponto: "bg-orange-500",
    };
  }

  return {
    texto: "Emergência",
    cor: "bg-red-50 text-red-600",
    ponto: "bg-red-500",
  };
}

export default function RealtimeDashboard() {
  const { conectado, nivel, leituras, totalLeituras, erro, conectar } =
    useSerial();

  // Variação entre a última e a penúltima leitura
  const variacao = useMemo(() => {
    if (leituras.length < 2) {
      return null;
    }

    const atual = leituras[leituras.length - 1].nivel;
    const anterior = leituras[leituras.length - 2].nivel;

    return atual - anterior;
  }, [leituras]);

  const status = obterStatus(nivel);

  // Transforma os dados do Arduino no formato do gráfico:
  // { time: string, value: number }
  const dadosGrafico = useMemo(() => {
    if (leituras.length > 0) {
      return leituras.map((leitura: LeituraAgua) => ({
        time: new Date(leitura.timestamp).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),

        value: leitura.nivel,
      }));
    }

    // Enquanto não há Arduino conectado,
    // mantém os dados demonstrativos antigos.
    return waterReadings;
  }, [leituras]);

  const quantidadeLeituras =
    totalLeituras > 0 ? totalLeituras.toLocaleString("pt-BR") : "0";

  return (
    <section id="dados" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionTitle
          eyebrow="Dados em tempo real"
          title="Veja o que o sensor está registrando."
          description="Monitore o nível da água da maquete do Guaíba em tempo real através do Arduino."
        />

        {/* STATUS DA CONEXÃO (clicável para autorizar o Arduino) */}

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={conectar}
            disabled={conectado}
            className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${
              conectado
                ? "cursor-default bg-emerald-50 text-emerald-600"
                : "cursor-pointer bg-slate-100 text-slate-500"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                conectado ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />

            {conectado ? "Arduino conectado" : "Arduino desconectado"}
          </button>
        </div>

        {/* ERRO */}

        {erro && (
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            {erro}
          </div>
        )}

        {/* CARDS */}

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Nível atual"
            value={nivel !== null ? `${nivel.toFixed(1)} cm` : "--"}
            description="Altura atual da água registrada pelo sensor."
            icon="water"
          />

          <StatCard
            label="Variação"
            value={
              variacao !== null
                ? `${variacao >= 0 ? "+" : ""}${variacao.toFixed(1)} cm`
                : "--"
            }
            description="Diferença entre a última e a penúltima leitura."
            icon="flow"
          />

          <StatCard
            label="Leituras"
            value={quantidadeLeituras}
            description="Quantidade de leituras recebidas nesta sessão."
            icon="database"
          />

          <StatCard
            label="Status"
            value={status.texto}
            description={
              conectado
                ? "Sensor conectado ao sistema."
                : "Conecte o Arduino para receber dados reais."
            }
            icon="online"
          />
        </div>

        {/* GRÁFICO + STATUS DO DISPOSITIVO */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
          <WaterChart data={dadosGrafico} />

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">
                  Status do dispositivo
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Informações do sensor
                </p>
              </div>

              <span
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  conectado
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    conectado ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />

                {conectado ? "Online" : "Offline"}
              </span>
            </div>

            <div className="mt-8 space-y-5">
              <div className="flex justify-between border-b border-slate-100 pb-4">
                <span className="text-sm text-slate-500">Última leitura</span>

                <span className="text-sm font-semibold text-slate-900">
                  {leituras.length > 0
                    ? new Date(
                        leituras[leituras.length - 1].timestamp
                      ).toLocaleTimeString("pt-BR")
                    : "--"}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-4">
                <span className="text-sm text-slate-500">Sensor</span>

                <span className="text-sm font-semibold text-slate-900">
                  HC-SR04
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Conexão</span>

                <span className="text-sm font-semibold text-slate-900">
                  {conectado ? "USB / Serial" : "Desconectado"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ALERTA DO RIO */}

        <div className="mt-6 rounded-2xl border border-cyan-100 bg-cyan-50 p-5">
          <p className="font-semibold text-cyan-900">
            Monitoramento do Guaíba
          </p>

          <p className="mt-1 text-sm leading-6 text-cyan-800/80">
            {nivel === null
              ? "O sistema está aguardando uma leitura do sensor."
              : `O nível atual registrado é de ${nivel.toFixed(
                  1
                )} cm. O sistema classificou a situação como ${status.texto.toLowerCase()}.`}
          </p>
        </div>
      </div>
    </section>
  );
}