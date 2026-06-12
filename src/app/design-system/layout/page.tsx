export default function LayoutPage() {
  return (
    <article>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-4">
        Foundations
      </p>
      <h1 className="font-sans text-[32px] font-bold tracking-tight text-foreground mb-4">
        Layout
      </h1>
      <p className="font-sans text-[15px] leading-relaxed text-muted max-w-xl mb-12">
        Two rooms, one shell. The site toggles between a{" "}
        <strong className="text-foreground">Read</strong> room and a{" "}
        <strong className="text-foreground">Play</strong> room. Layout decisions
        serve that duality.
      </p>

      <h2 className="font-sans text-[20px] font-bold text-foreground mb-4">
        Page structure
      </h2>

      <div className="flex flex-col gap-3 mb-12">
        {[
          {
            label: "Viewport",
            desc: "Full-width, min-height: 100vh",
            visual: "w-full",
          },
          {
            label: "Content max-width",
            desc: "max-w-4xl (896px) for editorial",
            visual: "max-w-4xl",
          },
          {
            label: "Horizontal padding",
            desc: "px-8 → sm:px-16 → lg:px-24",
            visual: "px-8",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-3 border-b border-border"
          >
            <span className="font-sans text-[15px] font-medium text-foreground w-48 shrink-0">
              {item.label}
            </span>
            <span className="font-sans text-[13px] text-muted">
              {item.desc}
            </span>
          </div>
        ))}
      </div>

      <h2 className="font-sans text-[20px] font-bold text-foreground mb-4">
        Grid
      </h2>

      <p className="font-sans text-[15px] leading-relaxed text-muted max-w-xl mb-6">
        The home page experiment cards use a responsive 2-column grid
        (<code className="font-mono text-[13px]">grid-cols-1 md:grid-cols-2</code>)
        with 24px column gap and 64px row gap.
      </p>

      <div className="grid grid-cols-2 gap-6 mb-12">
        <div className="aspect-[4/3] rounded-lg border border-border bg-foreground/[0.03] flex items-center justify-center">
          <span className="font-mono text-[11px] text-muted">Card</span>
        </div>
        <div className="aspect-[4/3] rounded-lg border border-border bg-foreground/[0.03] flex items-center justify-center">
          <span className="font-mono text-[11px] text-muted">Card</span>
        </div>
      </div>

      <h2 className="font-sans text-[20px] font-bold text-foreground mb-4">
        Navigation
      </h2>

      <p className="font-sans text-[15px] leading-relaxed text-muted max-w-xl">
        Fixed top corners. No bar, no hamburger.{" "}
        <strong className="text-foreground">Top-left:</strong> &ldquo;Keith
        Scott&rdquo; in Aeonik 14px/500.{" "}
        <strong className="text-foreground">Top-right:</strong> page toggle in
        Geist Mono 12px uppercase. The nav hides entirely on the Play page since
        the game has its own close button.
      </p>
    </article>
  );
}
