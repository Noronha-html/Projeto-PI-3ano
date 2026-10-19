import { team } from "../data/projectData";
import SectionTitle from "./SectionTitle";

function iniciais(nome: string) {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default function Team() {
  return (
    <section id="equipe" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionTitle
          eyebrow="Equipe"
          title="Pessoas por trás do projeto."
          description="Conheça os integrantes responsáveis pelo desenvolvimento da solução."
          center
        />

        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {team.map((member) => (
            <article
              key={`${member.name}-${member.role}`}
              className="w-64 rounded-2xl border border-slate-200 bg-white p-8 text-center"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-50 text-xl font-bold text-cyan-600">
                {iniciais(member.name)}
              </div>
              <h3 className="mt-5 font-bold text-slate-900">{member.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{member.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}