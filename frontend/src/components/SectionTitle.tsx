interface SectionTitleProps {
    eyebrow: string;
    title: string;
    description?: string;
    center?: boolean;
  }
  
  export default function SectionTitle({
    eyebrow,
    title,
    description,
    center = false,
  }: SectionTitleProps) {
    return (
      <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
        <span className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-500">
          {eyebrow}
        </span>
  
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          {title}
        </h2>
  
        {description && (
          <p className="mt-4 text-base leading-7 text-slate-600">
            {description}
          </p>
        )}
      </div>
    );
  }