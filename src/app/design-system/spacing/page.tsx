const spacingScale = [
  { name: "px", value: "1px", rem: "—", px: 1 },
  { name: "0.5", value: "0.125rem", rem: "0.125", px: 2 },
  { name: "1", value: "0.25rem", rem: "0.25", px: 4 },
  { name: "1.5", value: "0.375rem", rem: "0.375", px: 6 },
  { name: "2", value: "0.5rem", rem: "0.5", px: 8 },
  { name: "3", value: "0.75rem", rem: "0.75", px: 12 },
  { name: "4", value: "1rem", rem: "1", px: 16 },
  { name: "6", value: "1.5rem", rem: "1.5", px: 24 },
  { name: "8", value: "2rem", rem: "2", px: 32 },
  { name: "12", value: "3rem", rem: "3", px: 48 },
  { name: "16", value: "4rem", rem: "4", px: 64 },
  { name: "24", value: "6rem", rem: "6", px: 96 },
];

export default function SpacingPage() {
  return (
    <article>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-4">
        Foundations
      </p>
      <h1 className="font-sans text-[32px] font-bold tracking-tight text-foreground mb-4">
        Spacing
      </h1>
      <p className="font-sans text-[15px] leading-relaxed text-muted max-w-xl mb-12">
        Spacing uses Tailwind&apos;s default 4px base scale. Consistent spacing
        creates rhythm and hierarchy without adding visual noise.
      </p>

      <div className="flex flex-col gap-3">
        {spacingScale.map((s) => (
          <div key={s.name} className="flex items-center gap-4">
            <span className="font-mono text-[12px] text-muted w-8 text-right shrink-0">
              {s.name}
            </span>
            <div
              className="h-3 bg-foreground/20 rounded-sm shrink-0"
              style={{ width: `${Math.min(s.px, 384)}px` }}
            />
            <span className="font-mono text-[11px] text-muted shrink-0">
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}
