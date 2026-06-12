import { tokens } from "@/lib/tokens";

const palette = [
  { name: "Background", token: "background", value: tokens.color.background },
  { name: "Foreground", token: "foreground", value: tokens.color.foreground },
  { name: "Muted", token: "muted", value: tokens.color.muted },
  { name: "Border", token: "border", value: tokens.color.border },
];

export default function ColorPage() {
  return (
    <article>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-4">
        Foundations
      </p>
      <h1 className="font-sans text-[32px] font-bold tracking-tight text-foreground mb-4">
        Color
      </h1>
      <p className="font-sans text-[15px] leading-relaxed text-muted max-w-xl mb-12">
        Monochrome only. No accent color. Imagery brings the color. The palette
        is four values &mdash; background, foreground, muted, and border &mdash;
        applied via CSS custom properties in{" "}
        <code className="font-mono text-[13px]">globals.css</code>.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {palette.map((c) => (
          <div key={c.token} className="flex gap-4 items-start">
            <div
              className="w-20 h-20 rounded-lg border border-border shrink-0"
              style={{ backgroundColor: c.value }}
            />
            <div className="flex flex-col gap-1 pt-1">
              <span className="font-sans text-[15px] font-medium text-foreground">
                {c.name}
              </span>
              <span className="font-mono text-[12px] text-muted">
                --color-{c.token}
              </span>
              <span className="font-mono text-[12px] text-foreground">
                {c.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-sans text-[20px] font-bold text-foreground mb-4">
        Usage
      </h2>
      <div className="bg-foreground/[0.03] border border-border rounded-lg p-6 font-mono text-[13px] text-foreground leading-relaxed">
        <div className="text-muted">{"/* Tailwind classes */"}</div>
        <div>text-foreground</div>
        <div>text-muted</div>
        <div>bg-background</div>
        <div>border-border</div>
      </div>
    </article>
  );
}
