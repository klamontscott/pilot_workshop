export default function BadgesPage() {
  return (
    <article>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-4">
        Atoms
      </p>
      <h1 className="font-sans text-[32px] font-bold tracking-tight text-foreground mb-4">
        Badges
      </h1>
      <p className="font-sans text-[15px] leading-relaxed text-muted max-w-xl mb-12">
        Small metadata indicators used to communicate status or category.
        Always Geist Mono, always uppercase.
      </p>

      <div className="flex flex-col gap-8">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted block mb-3">
            Outlined (default)
          </span>
          <div className="flex gap-2 flex-wrap">
            {["Canvas", "Animation", "DOM", "3D", "Audio"].map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] uppercase tracking-wider text-muted border border-border rounded px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted block mb-3">
            Solid
          </span>
          <div className="flex gap-2 flex-wrap">
            {["New", "Live", "Beta"].map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] uppercase tracking-wider text-background bg-foreground rounded px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted block mb-3">
            Muted
          </span>
          <div className="flex gap-2 flex-wrap">
            {["Archived", "Draft", "Paused"].map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] uppercase tracking-wider text-muted bg-foreground/5 rounded px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
