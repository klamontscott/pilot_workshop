import { tokens } from "@/lib/tokens";

export default function DesignSystemIntroduction() {
  return (
    <article>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-4">
        Design System
      </p>

      <h1 className="font-sans text-[36px] sm:text-[44px] font-bold leading-[1.1] tracking-tight text-foreground mb-8">
        A small system, fully documented.
      </h1>

      <p className="font-sans text-[16px] leading-relaxed text-muted max-w-xl mb-12">
        This site is a monochrome editorial system for Keith Scott&apos;s
        experiments portfolio. It documents its foundations and components
        organized by Atomic Design, with every specimen rendered from the real
        source so the docs can never drift.
      </p>

      <hr className="border-border mb-12" />

      <h2 className="font-sans text-[24px] font-bold text-foreground mb-4">
        The &ldquo;Two Rooms&rdquo; idea
      </h2>

      <p className="font-sans text-[15px] leading-relaxed text-muted max-w-xl mb-8">
        The whole page is one shell &mdash; holding two rooms that swap with a
        single animated transition: a <strong className="text-foreground">Read</strong> room
        (structured editorial content) and a{" "}
        <strong className="text-foreground">Play</strong> room (a Three.js
        canvas). A toggle flips between them. Everything else in this system
        exists to fill, frame, or theme those two rooms.
      </p>

      <h2 className="font-sans text-[24px] font-bold text-foreground mb-4">
        Atomic design, mapped to the code
      </h2>

      <p className="font-sans text-[15px] leading-relaxed text-muted max-w-xl mb-8">
        Each layer below points at the exact files it documents. Components are
        imported live into their specimens, so what you see here is what ships.
      </p>

      <div className="overflow-x-auto mb-12">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted py-3 pr-6">
                Layer
              </th>
              <th className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted py-3 pr-6">
                Source in Repo
              </th>
              <th className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted py-3">
                Documented As
              </th>
            </tr>
          </thead>
          <tbody className="font-sans text-[13px]">
            <tr className="border-b border-border">
              <td className="py-3 pr-6 text-foreground">Foundations</td>
              <td className="py-3 pr-6">
                <code className="font-mono text-[12px] text-muted">globals.css</code>
                {" · "}
                <code className="font-mono text-[12px] text-muted">tokens.ts</code>
              </td>
              <td className="py-3 text-muted">Color, Typography, Spacing, Layout, Motion</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 pr-6 text-foreground">Atoms</td>
              <td className="py-3 pr-6">
                <code className="font-mono text-[12px] text-muted">components/</code>
              </td>
              <td className="py-3 text-muted">Buttons, Badges, Eyebrows, Links, Pills</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 pr-6 text-foreground">Molecules</td>
              <td className="py-3 pr-6">
                <code className="font-mono text-[12px] text-muted">Basketball3DGame.tsx</code>
              </td>
              <td className="py-3 text-muted">Play Canvas</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 pr-6 text-foreground">Templates</td>
              <td className="py-3 pr-6">
                <code className="font-mono text-[12px] text-muted">app/layout.tsx</code>
              </td>
              <td className="py-3 text-muted">Stage &mdash; the shell</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="font-sans text-[24px] font-bold text-foreground mb-4">
        Design tokens
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(tokens.color).map(([name, value]) => (
          <div key={name} className="flex flex-col gap-2">
            <div
              className="w-full aspect-square rounded-lg border border-border"
              style={{ backgroundColor: value }}
            />
            <span className="font-mono text-[11px] text-muted">{name}</span>
            <span className="font-mono text-[11px] text-foreground">{value}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
