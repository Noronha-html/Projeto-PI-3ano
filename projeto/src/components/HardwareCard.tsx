import type { HardwareItem } from "../types/project";

interface HardwareCardProps {
  item: HardwareItem;
}

export default function HardwareCard({ item }: HardwareCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 backdrop-blur">
          {item.tag}
        </span>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {item.description}
        </p>
      </div>
    </article>
  );
}