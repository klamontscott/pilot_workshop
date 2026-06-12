export default function StagePage() {
  return (
    <article>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-4">
        Templates
      </p>
      <h1 className="font-sans text-[32px] font-bold tracking-tight text-foreground mb-4">
        Stage
      </h1>
      <p className="font-sans text-[15px] leading-relaxed text-muted max-w-xl mb-12">
        The Stage is the root shell that holds everything. It manages the two
        rooms (Read and Play), the navigation, and the global layout. Built as
        the Next.js root layout.
      </p>

      <h2 className="font-sans text-[20px] font-bold text-foreground mb-6">
        Structure
      </h2>

      <div className="border border-border rounded-lg overflow-hidden mb-12">
        {/* Visual diagram */}
        <div className="p-6 bg-foreground/[0.02]">
          <div className="border-2 border-dashed border-border rounded-lg p-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted block mb-3">
              html + body (root layout)
            </span>

            {/* Nav */}
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="font-sans text-[12px] font-medium text-foreground">
                Keith Scott
              </span>
              <div className="flex gap-4">
                <span className="font-mono text-[10px] uppercase text-muted">
                  System
                </span>
                <span className="font-mono text-[10px] uppercase text-foreground">
                  Play
                </span>
              </div>
            </div>

            {/* Rooms */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-border rounded-lg p-4 bg-background">
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted block mb-2">
                  Read Room
                </span>
                <div className="space-y-2">
                  <div className="h-3 bg-foreground/10 rounded w-3/4" />
                  <div className="h-2 bg-foreground/5 rounded w-full" />
                  <div className="h-2 bg-foreground/5 rounded w-5/6" />
                </div>
              </div>
              <div className="border border-border rounded-lg p-4 bg-[#0A0A0A]">
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted block mb-2">
                  Play Room
                </span>
                <div className="flex items-center justify-center h-12">
                  <span className="font-mono text-[10px] text-[#4499ff]">
                    WebGL
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="font-sans text-[20px] font-bold text-foreground mb-4">
        File mapping
      </h2>

      <div className="flex flex-col gap-0 mb-12">
        {[
          {
            file: "app/layout.tsx",
            role: "Root layout — fonts, metadata, SiteNav",
          },
          {
            file: "app/page.tsx",
            role: "Read room — hero + experiment cards",
          },
          {
            file: "app/play/page.tsx",
            role: "Play room — basketball game (dynamic import, no SSR)",
          },
          {
            file: "app/design-system/layout.tsx",
            role: "Design system shell — sidebar + content area",
          },
          {
            file: "components/nav/SiteNav.tsx",
            role: "Fixed corner nav — hides on /play",
          },
        ].map((row) => (
          <div
            key={row.file}
            className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-3 border-b border-border"
          >
            <code className="font-mono text-[12px] text-foreground w-56 shrink-0">
              {row.file}
            </code>
            <span className="font-sans text-[13px] text-muted">{row.role}</span>
          </div>
        ))}
      </div>

      <h2 className="font-sans text-[20px] font-bold text-foreground mb-4">
        Behavior
      </h2>
      <ul className="flex flex-col gap-3 font-sans text-[15px] leading-relaxed text-muted">
        <li>
          <strong className="text-foreground">Read → Play:</strong> User clicks
          &ldquo;Play&rdquo; in nav or a card link. Next.js client-side
          navigation loads the game component. Nav hides.
        </li>
        <li>
          <strong className="text-foreground">Play → Read:</strong> User clicks
          the &times; button in the game. Router pushes back to /. Nav
          reappears.
        </li>
        <li>
          <strong className="text-foreground">Design System:</strong> Nested
          layout with sidebar. Nav shows &ldquo;Home&rdquo; instead of
          &ldquo;Play&rdquo; to return to the Read room.
        </li>
      </ul>
    </article>
  );
}
