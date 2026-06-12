export default function PillsPage() {
  return (
    <article>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-4">
        Atoms
      </p>
      <h1 className="font-sans text-[32px] font-bold tracking-tight text-foreground mb-4">
        Pills
      </h1>
      <p className="font-sans text-[15px] leading-relaxed text-muted max-w-xl mb-12">
        Rounded pill-shaped elements used for tags, filters, and navigation
        items. Distinguished from badges by their fully-rounded corners and
        slightly larger padding.
      </p>

      <div className="flex flex-col gap-10">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted block mb-4">
            Tag pills
          </span>
          <div className="flex gap-2 flex-wrap">
            {["Canvas", "Animation", "DOM", "3D", "Audio", "Physics"].map(
              (tag) => (
                <span
                  key={tag}
                  className="font-mono text-[11px] uppercase tracking-wider text-muted border border-border rounded-full px-3 py-1"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>

        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted block mb-4">
            Active state
          </span>
          <div className="flex gap-2 flex-wrap">
            <span className="font-mono text-[11px] uppercase tracking-wider text-background bg-foreground rounded-full px-3 py-1">
              All
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted border border-border rounded-full px-3 py-1 hover:border-foreground transition-colors cursor-pointer">
              Canvas
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted border border-border rounded-full px-3 py-1 hover:border-foreground transition-colors cursor-pointer">
              3D
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted border border-border rounded-full px-3 py-1 hover:border-foreground transition-colors cursor-pointer">
              DOM
            </span>
          </div>
        </div>

        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted block mb-4">
            Date pill
          </span>
          <div className="flex gap-2">
            <span className="font-mono text-[11px] text-muted bg-foreground/5 rounded-full px-3 py-1">
              2026-06
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
