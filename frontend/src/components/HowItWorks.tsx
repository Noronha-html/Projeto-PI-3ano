import SectionTitle from "./SectionTitle";

const steps = [
  {
    number: "01",
    title: "Sensor",
    description:
      "O HC-SR04 emite um pulso sonoro e mede o tempo que o eco leva para voltar da superfície da água.",
  },
  {
    number: "02",
    title: "Arduino",
    description:
      "A placa converte o tempo do eco em distância e envia cada leitura pela porta serial.",
  },
  {
    number: "03",
    title: "Backend",
    description:
      "A aplicação recebe as leituras enviadas pelo painel e processa as informações.",
  },
  {
    number: "04",
    title: "Banco de dados",
    description:
      "As medições são armazenadas para permitir histórico e consultas.",
  },
  {
    number: "05",
    title: "Interface",
    description:
      "O painel mostra o nível, a variação, o gráfico e a classificação de risco.",
  },
];

export default function HowItWorks() {
  return (
    <section id="funcionamento" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionTitle
          eyebrow="Como funciona"
          title="Do sensor até a tela."
          description="Cada parte do sistema tem uma função específica. Juntas, formam o fluxo completo de coleta, armazenamento e visualização."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-5">
          {steps.map((step) => (
            <div
              key={step.number}
              className="h-full rounded-2xl border border-slate-200 bg-white p-6"
            >
              <span className="text-sm font-bold text-cyan-600">{step.number}</span>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white lg:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                Arquitetura
              </span>
              <h3 className="mt-3 text-3xl font-bold">
                Hardware conectado ao software.
              </h3>
              <p className="mt-4 max-w-xl leading-7 text-slate-400">
                O dispositivo físico envia as leituras para uma aplicação que
                cuida do armazenamento e da disponibilização dos dados.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {["Sensor", "Arduino", "API", "Banco de dados", "Interface"].map(
                (item, index) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium">
                      {item}
                    </div>
                    {index < 4 && <span className="text-cyan-400">→</span>}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}