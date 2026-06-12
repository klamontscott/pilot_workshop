"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import type { ExperimentConfig } from "@/types/experiment";

export function ExperimentNode({ config }: { config: ExperimentConfig }) {
  const Component = config.component;

  return (
    <motion.div
      className="absolute"
      style={{
        left: config.position.x,
        top: config.position.y,
        width: config.size.width,
        height: config.size.height,
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div className="w-full h-full flex flex-col border border-border rounded-lg overflow-hidden bg-background shadow-sm">
        <div className="px-3 py-2 border-b border-border flex items-center justify-between shrink-0">
          <span className="font-mono text-[11px] text-foreground truncate">
            {config.title}
          </span>
          <div className="flex gap-1.5 ml-2">
            {config.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] uppercase tracking-wider text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-mono text-[11px] text-muted animate-pulse">
                  Loading...
                </span>
              </div>
            }
          >
            <Component />
          </Suspense>
        </div>
      </div>
    </motion.div>
  );
}
