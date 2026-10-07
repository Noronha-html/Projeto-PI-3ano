export default function Hero() {
    return (
      <section className="relative overflow-hidden bg-white pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-cyan-100/60 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />
  
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700">
              <span className="h-2 w-2 rounded-full bg-cyan-500" />
              Sistema de monitoramento de água
            </div>
  
            <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Transformando água em{" "}
              <span className="text-cyan-500">dados inteligentes.</span>
            </h1>
  
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
              Um sistema integrado entre sensores, Arduino e software para
              monitorar o consumo de água e transformar informações físicas em
              dados úteis.
            </p>
  
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#dados"
                className="rounded-xl bg-cyan-500 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-600"
              >
                Explorar dados
              </a>
  
              <a
                href="#funcionamento"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-center text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-600"
              >
                Como funciona
              </a>
            </div>
  
            <div className="mt-10 flex items-center gap-8 border-t border-slate-200 pt-7">
              <div>
                <strong className="block text-2xl font-bold text-slate-900">
                  IoT
                </strong>
                <span className="text-sm text-slate-500">Conectividade</span>
              </div>
  
              <div>
                <strong className="block text-2xl font-bold text-slate-900">
                  24/7
                </strong>
                <span className="text-sm text-slate-500">Monitoramento</span>
              </div>
  
              <div>
                <strong className="block text-2xl font-bold text-slate-900">
                  API
                </strong>
                <span className="text-sm text-slate-500">Dados integrados</span>
              </div>
            </div>
          </div>
  
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-cyan-100/60 blur-2xl" />
  
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
              <img
                src="https://images.unsplash.com/photo-1548838134-45f6e9b8f5e9?auto=format&fit=crop&w=1200&q=85"
                alt="Água sendo monitorada"
                className="h-[520px] w-full object-cover"
              />
  
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/50 bg-white/90 p-5 shadow-xl backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Vazão atual
                    </p>
                    <p className="mt-1 text-3xl font-bold text-slate-900">
                      2,4 <span className="text-base font-medium">L/min</span>
                    </p>
                  </div>
  
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 3C8 8 5 11 5 15a7 7 0 0 0 14 0c0-4-3-7-7-12Z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }