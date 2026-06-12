export default function EyebrowsPage() {
  return (
    <article>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-4">
        Atoms
      </p>
      <h1 className="font-sans text-[32px] font-bold tracking-tight text-foreground mb-4">
        Eyebrows
      </h1>
      <p className="font-sans text-[15px] leading-relaxed text-muted max-w-xl mb-12">
        Small uppercase labels that precede headings to establish context or
        category. Always Geist Mono, always muted, always above the heading
        they introduce.
      </p>

      <div className="flex flex-col gap-12">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted block mb-3">
            Standard
          </span>
          <div className="border border-border rounded-lg p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-3">
              Design System
            </p>
            <h2 className="font-sans text-[24px] font-bold text-foreground">
              A small system, fully documented.
            </h2>
          </div>
        </div>

        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted block mb-3">
            With separator
          </span>
          <div className="border border-border rounded-lg p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-3">
              Design System &middot; Manuscript
            </p>
            <h2 className="font-sans text-[24px] font-bold text-foreground">
              Color
            </h2>
          </div>
        </div>

        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted block mb-3">
            Section label
          </span>
          <div className="border border-border rounded-lg p-6">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted mb-4">
              Experiments
            </p>
            <div className="h-px bg-border" />
          </div>
        </div>
      </div>
    </article>
  );
}
