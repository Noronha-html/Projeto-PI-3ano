export default function Footer() {
    return (
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <p className="font-bold text-slate-900">AquaSense</p>
            <p className="mt-1 text-sm text-slate-500">
              Monitoramento inteligente de água.
            </p>
          </div>
  
          <p className="text-sm text-slate-400">
            © 2026 AquaSense. Projeto acadêmico.
          </p>
        </div>
      </footer>
    );
  }