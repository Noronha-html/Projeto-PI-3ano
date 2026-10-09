import SectionTitle from "./SectionTitle";

export default function AboutProject() {
  return (
    <section id="sobre" className="bg-slate-50 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionTitle
            eyebrow="Sobre o projeto"
            title="Uma ponte entre o mundo físico e o digital."
            description="O projeto utiliza sensores e um microcontrolador para coletar informações sobre o fluxo de água e disponibilizá-las em uma plataforma digital."
          />

          <div className="mt-8 space-y-5">
            {[
              [
                "Monitoramento",
                "Coleta contínua das informações do consumo de água.",
              ],
              [
                "Armazenamento",
                "Os dados são enviados para um backend e armazenados em banco de dados.",
              ],
              [
                "Visualização",
                "Uma interface transforma os dados brutos em informações fáceis de entender.",
              ],
            ].map(([title, text]) => (
              <div key={title} className="flex gap-4">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
                  ✓
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1581091870622-3e7e6c7b4c8f?auto=format&fit=crop&w=1000&q=80"
            alt="Placa eletrônica e componentes"
            className="h-[480px] w-full rounded-[2rem] object-cover shadow-xl"
          />

          <div className="absolute -bottom-7 -left-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:-left-8">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Dados coletados
            </p>
            <p className="mt-1 text-3xl font-bold text-slate-900">
              1.284
            </p>
            <p className="mt-1 text-sm text-emerald-600">
              ↑ Sistema funcionando
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}