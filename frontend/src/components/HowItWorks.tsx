import SectionTitle from "./SectionTitle";

const steps = [
  {
    number: "01",
    title: "Sensor",
    description:
      "O sensor identifica a passagem da água e gera pulsos elétricos proporcionais ao fluxo.",
  },
  {
    number: "02",
    title: "Arduino",
    description:
      "O Arduino interpreta os pulsos e transforma os sinais do sensor em dados.",
  },
  {
    number: "03",
    title: "Backend",
    description:
      "A aplicação recebe os dados enviados pelo dispositivo e processa as informações.",
  },
  {
    number: "04",
    title: "Banco de dados",
    description:
      "As medições são armazenadas para permitir histórico e análises futuras.",
  },
  {
    number: "05",
    title: "Interface",
    description:
      "O frontend apresenta os dados de forma visual, simples e fácil de interpretar.",
  },
];

export default function HowItWorks() {
  return (
    <section id="funcionamento" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionTitle
          eyebrow="Como funciona"
          title="Do sensor até a tela."
          description="Cada parte do sistema possui uma função específica. Juntas, elas formam um fluxo completo de coleta, processamento e visualização."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-5">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute left-[calc(100%+10px)] top-7 hidden h-px w-5 bg-slate-200 md:block" />
              )}

              <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg">
                <span className="text-sm font-bold text-cyan-500">
                  {step.number}
                </span>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </div>
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
                A arquitetura permite que o dispositivo físico envie dados
                para uma aplicação responsável pelo armazenamento e
                disponibilização das informações.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {["Sensor", "Arduino", "API", "Database", "Frontend"].map(
                (item, index) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium">
                      {item}
                    </div>

                    {index < 4 && (
                      <span className="text-cyan-400">→</span>
                    )}
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