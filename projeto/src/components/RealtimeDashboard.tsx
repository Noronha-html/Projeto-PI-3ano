import { stats, waterReadings } from "../data/projectData";
import SectionTitle from "./SectionTitle";
import StatCard from "./StatCard";
import WaterChart from "./WaterChart";

export default function RealtimeDashboard() {
  return (
    <section id="dados" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionTitle
          eyebrow="Dados em tempo real"
          title="Veja o que o sensor está registrando."
          description="Esta é uma prévia da interface que futuramente será alimentada diretamente pelo backend e pelo banco de dados."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
          <WaterChart data={waterReadings} />

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

              <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Online
              </span>
            </div>

            <div className="mt-8 space-y-5">
              <div className="flex justify-between border-b border-slate-100 pb-4">
                <span className="text-sm text-slate-500">Dispositivo</span>
                <span className="text-sm font-semibold text-slate-900">
                  Arduino #001
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-4">
                <span className="text-sm text-slate-500">
                  Última leitura
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  Agora
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-4">
                <span className="text-sm text-slate-500">Precisão</span>
                <span className="text-sm font-semibold text-slate-900">
                  98,4%
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Conexão</span>
                <span className="text-sm font-semibold text-slate-900">
                  Estável
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-cyan-100 bg-cyan-50 p-5">
          <div className="flex gap-4">
            <div className="text-xl">💡</div>

            <div>
              <p className="font-semibold text-cyan-900">
                Preview do sistema
              </p>

              <p className="mt-1 text-sm leading-6 text-cyan-800/80">
                Os valores exibidos nesta página são demonstrativos. Quando o
                backend estiver conectado, este componente poderá buscar os
                dados da API e atualizar a interface automaticamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}