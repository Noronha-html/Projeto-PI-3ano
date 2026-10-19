export default function Hero() {
  return (
    <section className="bg-white pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600">
            Projeto Integrador · 3º ano
          </p>

          <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Monitoramento do nível da água em tempo real.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            O AquaSense mede o nível da água da maquete do Guaíba com um sensor
            ultrassônico ligado a um Arduino, registra as leituras em banco de
            dados e mostra tudo em um painel, classificando a situação de normal
            a emergência.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#dados"
              className="rounded-xl bg-cyan-500 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-cyan-600"
            >
              Ver painel
            </a>
            <a
              href="#funcionamento"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-center text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-600"
            >
              Como funciona
            </a>
          </div>
        </div>

        <figure className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <svg
            viewBox="0 0 400 340"
            className="h-auto w-full"
            role="img"
            aria-label="Sensor ultrassônico medindo a distância até a superfície da água"
          >
            <rect x="110" y="70" width="180" height="250" rx="10" className="fill-white stroke-slate-300" strokeWidth="2" />
            <rect x="112" y="200" width="176" height="118" rx="8" className="fill-cyan-200" />
            <line x1="112" y1="200" x2="288" y2="200" className="stroke-cyan-500" strokeWidth="2" />
            <rect x="145" y="18" width="110" height="34" rx="8" className="fill-slate-900" />
            <text x="200" y="40" textAnchor="middle" className="fill-white text-[13px] font-semibold">
              HC-SR04
            </text>
            <line x1="200" y1="52" x2="200" y2="198" className="stroke-slate-500" strokeWidth="2" strokeDasharray="6 5" />
            <text x="212" y="130" className="fill-slate-600 text-[13px]">distância</text>
            <line x1="320" y1="318" x2="320" y2="202" className="stroke-cyan-600" strokeWidth="2" />
            <line x1="312" y1="318" x2="328" y2="318" className="stroke-cyan-600" strokeWidth="2" />
            <line x1="312" y1="202" x2="328" y2="202" className="stroke-cyan-600" strokeWidth="2" />
            <text x="334" y="266" className="fill-cyan-700 text-[13px] font-semibold">nível</text>
          </svg>
          <figcaption className="mt-3 text-sm leading-6 text-slate-500">
            O sensor mede a distância até a superfície da água e o sistema
            converte essa medida em nível.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}