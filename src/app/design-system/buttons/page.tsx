"use client";

import { motion } from "framer-motion";

function Specimen({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
        {label}
      </span>
      <div className="flex items-center gap-4 flex-wrap">{children}</div>
    </div>
  );
}

export default function ButtonsPage() {
  return (
    <article>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-4">
        Atoms
      </p>
      <h1 className="font-sans text-[32px] font-bold tracking-tight text-foreground mb-4">
        Buttons
      </h1>
      <p className="font-sans text-[15px] leading-relaxed text-muted max-w-xl mb-12">
        Two variants: primary (solid) and secondary (outlined). Monochrome only.
        All buttons use Geist Mono uppercase with letter-spacing.
      </p>

      <div className="flex flex-col gap-10">
        <Specimen label="Primary">
          <button className="px-6 py-2.5 bg-foreground text-background font-mono text-[12px] uppercase tracking-[0.15em] rounded-lg hover:opacity-80 transition-opacity">
            Start Game
          </button>
          <button className="px-6 py-2.5 bg-foreground text-background font-mono text-[12px] uppercase tracking-[0.15em] rounded-lg opacity-50 cursor-not-allowed">
            Disabled
          </button>
        </Specimen>

        <Specimen label="Secondary">
          <button className="px-6 py-2.5 bg-transparent text-foreground font-mono text-[12px] uppercase tracking-[0.15em] rounded-lg border border-border hover:border-foreground transition-colors">
            View Source
          </button>
          <button className="px-6 py-2.5 bg-transparent text-muted font-mono text-[12px] uppercase tracking-[0.15em] rounded-lg border border-border cursor-not-allowed">
            Disabled
          </button>
        </Specimen>

        <Specimen label="Small">
          <button className="px-4 py-1.5 bg-foreground text-background font-mono text-[10px] uppercase tracking-[0.15em] rounded-md hover:opacity-80 transition-opacity">
            Play
          </button>
          <button className="px-4 py-1.5 bg-transparent text-foreground font-mono text-[10px] uppercase tracking-[0.15em] rounded-md border border-border hover:border-foreground transition-colors">
            Details
          </button>
        </Specimen>

        <Specimen label="Icon (zoom controls)">
          <button className="w-10 h-10 rounded-full border border-border bg-background text-foreground flex items-center justify-center font-mono text-lg hover:border-foreground transition-colors">
            +
          </button>
          <button className="w-10 h-10 rounded-full border border-border bg-background text-foreground flex items-center justify-center font-mono text-lg hover:border-foreground transition-colors">
            -
          </button>
        </Specimen>
      </div>
    </article>
  );
}
