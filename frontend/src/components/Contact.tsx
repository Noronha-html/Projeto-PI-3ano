import SectionTitle from "./SectionTitle";

export default function Contact() {
  return (
    <section id="contato" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-slate-950 px-8 py-12 sm:px-12 lg:px-16 lg:py-16">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-400">
                Contato
              </span>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Quer saber mais sobre o projeto?
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-slate-400">
                Entre em contato para conhecer melhor a solução, entender a
                arquitetura do sistema ou acompanhar o desenvolvimento.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <a
                href="mailto:contato@aquasense.com"
                className="rounded-xl bg-cyan-500 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-cyan-400"
              >
                Entrar em contato
              </a>

              <a
                href="#sobre"
                className="rounded-xl border border-slate-700 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:border-slate-500"
              >
                Conhecer projeto
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}