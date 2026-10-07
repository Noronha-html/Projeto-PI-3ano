interface StatCardProps {
    label: string;
    value: string;
    description: string;
    icon: string;
  }
  
  export default function StatCard({
    label,
    value,
    description,
    icon,
  }: StatCardProps) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              {value}
            </p>
          </div>
  
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
            {icon === "water" && "💧"}
            {icon === "flow" && "≈"}
            {icon === "database" && "▦"}
            {icon === "online" && "●"}
          </div>
        </div>
  
        <p className="mt-4 text-sm leading-5 text-slate-500">
          {description}
        </p>
      </div>
    );
  }