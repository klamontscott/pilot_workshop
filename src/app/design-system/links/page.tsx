"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LinksPage() {
  return (
    <article>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-4">
        Atoms
      </p>
      <h1 className="font-sans text-[32px] font-bold tracking-tight text-foreground mb-4">
        Links
      </h1>
      <p className="font-sans text-[15px] leading-relaxed text-muted max-w-xl mb-12">
        Links inherit the typeface of their context. Navigation links use the
        hover underline animation. Inline links use opacity change.
      </p>

      <div className="flex flex-col gap-10">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted block mb-4">
            Navigation link (Aeonik 14px)
          </span>
          <div className="inline-block">
            <span className="font-sans text-[14px] font-medium text-foreground relative group cursor-pointer">
              Keith Scott
              <motion.span
                className="absolute left-0 -bottom-1 h-px bg-foreground origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{ width: "100%" }}
              />
            </span>
          </div>
        </div>

        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted block mb-4">
            Navigation link (Geist Mono 12px)
          </span>
          <div className="inline-block">
            <span className="font-mono text-[12px] uppercase tracking-wider text-foreground relative group cursor-pointer">
              Play
              <motion.span
                className="absolute left-0 -bottom-1 h-px bg-foreground origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{ width: "100%" }}
              />
            </span>
          </div>
        </div>

        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted block mb-4">
            Inline link
          </span>
          <p className="font-sans text-[15px] leading-relaxed text-muted">
            Read the{" "}
            <span className="text-foreground font-medium hover:opacity-70 transition-opacity cursor-pointer">
              full case study
            </span>{" "}
            for more detail.
          </p>
        </div>

        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted block mb-4">
            Card link (experiment list)
          </span>
          <div className="border border-border rounded-lg p-4 group cursor-pointer hover:border-foreground/20 transition-colors">
            <span className="font-sans text-[15px] font-medium text-foreground group-hover:opacity-70 transition-opacity">
              Shot Arcs
            </span>
            <span className="font-sans text-[13px] text-muted ml-4">
              Animated shooting arc visualization
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
