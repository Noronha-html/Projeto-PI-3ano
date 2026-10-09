import type { WaterReading } from "../types/project";

interface WaterChartProps {
  data: WaterReading[];
}

export default function WaterChart({
  data,
}: WaterChartProps) {
  // ==========================================================
  // EVITA PROBLEMAS SE NÃO HOUVER DADOS
  // ==========================================================

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h3 className="font-bold text-slate-900">
            Nível da água
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Leituras registradas por período
          </p>
        </div>

        <div className="flex h-64 items-center justify-center text-sm text-slate-400">
          Aguardando dados do sensor...
        </div>
      </div>
    );
  }

  // ==========================================================
  // MAIOR VALOR DO GRÁFICO
  // ==========================================================

  const maxDataValue = Math.max(
    ...data.map((item) => item.value),
    1
  );

  // Dá um espaço acima do maior ponto
  const maxValue = Math.ceil(maxDataValue * 1.15);

  // ==========================================================
  // PONTOS DO GRÁFICO
  // ==========================================================

  const points = data
    .map((item, index) => {
      const x =
        data.length === 1
          ? 50
          : (index / (data.length - 1)) * 100;

      const y =
        100 -
        (item.value / maxValue) * 85;

      return `${x},${y}`;
    })
    .join(" ");

  // ==========================================================
  // ESCOLHE SOMENTE ALGUNS HORÁRIOS PARA O EIXO X
  //
  // A curva continua usando TODOS os dados.
  // Só mostramos no máximo 6 horários.
  // ==========================================================

  const quantidadeLabels = Math.min(data.length, 6);

  const indicesLabels = Array.from(
    { length: quantidadeLabels },
    (_, index) => {
      if (quantidadeLabels === 1) {
        return 0;
      }

      return Math.round(
        (index / (quantidadeLabels - 1)) *
          (data.length - 1)
      );
    }
  );

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* =====================================================
          CABEÇALHO
          ===================================================== */}

      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-bold text-slate-900">
            Nível da água
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Nível registrado por período
          </p>
        </div>

        <span className="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-600">
          Tempo real
        </span>
      </div>

      {/* =====================================================
          GRÁFICO
          ===================================================== */}

      <div className="relative mt-8 h-64">

        {/* LINHAS HORIZONTAIS */}

        <div className="absolute inset-0 flex flex-col justify-between">

          {[100, 75, 50, 25, 0].map((value) => (
            <div
              key={value}
              className="flex items-center gap-3 border-t border-dashed border-slate-100"
            >
              <span className="w-8 text-right text-[10px] text-slate-400">
                {Math.round(
                  (maxValue * value) / 100
                )}
              </span>

              <div className="h-px flex-1" />
            </div>
          ))}

        </div>

        {/* SVG */}

        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute bottom-7 left-11 right-0 top-0 h-[calc(100%-28px)] w-[calc(100%-44px)] overflow-visible"
        >

          <defs>
            <linearGradient
              id="waterGradientLive"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#06b6d4"
                stopOpacity="0.25"
              />

              <stop
                offset="100%"
                stopColor="#06b6d4"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {/* ÁREA PREENCHIDA */}

          <polygon
            points={`0,100 ${points} 100,100`}
            fill="url(#waterGradientLive)"
          />

          {/* LINHA */}

          <polyline
            points={points}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="1.8"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* PONTOS */}

          {data.map((item, index) => {
            const x =
              data.length === 1
                ? 50
                : (index / (data.length - 1)) * 100;

            const y =
              100 -
              (item.value / maxValue) * 85;

            return (
              <circle
                key={`${item.time}-${index}`}
                cx={x}
                cy={y}
                r="1.8"
                fill="white"
                stroke="#06b6d4"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}

        </svg>

        {/* =================================================
            HORÁRIOS
            AGORA MOSTRA NO MÁXIMO 6
            ================================================= */}

        <div className="absolute bottom-0 left-11 right-0 flex justify-between">

          {indicesLabels.map((index) => {
            const item = data[index];

            return (
              <span
                key={`${item.time}-${index}`}
                className="text-[10px] text-slate-400"
              >
                {item.time}
              </span>
            );
          })}

        </div>

      </div>

    </div>
  );
}