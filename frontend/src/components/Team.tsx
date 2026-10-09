import { team } from "../data/projectData";
import SectionTitle from "./SectionTitle";

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

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <article
              key={`${member.name}-${member.role}`}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-center transition hover:-translate-y-1 hover:shadow-xl"
            >
              <img
                src={member.image}
                alt={member.name}
                className="h-64 w-full object-cover"
              />

              <div className="p-6">
                <h3 className="font-bold text-slate-900">{member.name}</h3>
                <p className="mt-1 text-sm text-cyan-600">{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}