import SectionTitle from "./SectionTitle";

const etapas = [
  ["Monitoramento", "Um sensor ultrassônico mede o nível da água da maquete continuamente."],
  ["Armazenamento", "As leituras são enviadas a um backend e guardadas em banco de dados."],
  ["Visualização", "O painel transforma os dados brutos em informações fáceis de entender."],
];

const ficha = [
  ["Objeto monitorado", "Maquete do Guaíba"],
  ["Sensor", "HC-SR04 (ultrassônico)"],
  ["Microcontrolador", "Arduino"],
  ["Comunicação", "USB / Serial"],
  ["Interface", "React, TypeScript e Tailwind CSS"],
];

export default function AboutProject() {
  return (
    <section id="sobre" className="bg-slate-50 py-24">
      <div className="mx-auto grid max-w-7xl items-start gap-16 px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionTitle
            eyebrow="Sobre o projeto"
            title="Uma ponte entre o mundo físico e o digital."
            description="O projeto usa um sensor e um microcontrolador para medir o nível da água na maquete do Guaíba e disponibilizar essas informações em uma plataforma digital."
          />

          <div className="mt-8 space-y-5">
            {etapas.map(([title, text]) => (
              <div key={title} className="flex gap-4">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m5 12 5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="font-bold text-slate-900">Ficha técnica</h3>
          <dl className="mt-4 divide-y divide-slate-100">
            {ficha.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-3.5">
                <dt className="text-sm text-slate-500">{k}</dt>
                <dd className="text-right text-sm font-semibold text-slate-900">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}