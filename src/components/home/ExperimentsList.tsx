"use client";

import { Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { experiments } from "@/components/experiments";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function ExperimentsList() {
  return (
    <motion.section
      className="px-8 sm:px-16 lg:px-24 pb-24 w-full"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-16">
        {experiments.map((exp) => {
          const Component = exp.component;
          return (
            <motion.div key={exp.id} variants={item}>
              <Link href={`/play`} className="group block">
                {/* Preview thumbnail */}
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-border bg-[#F5F5F5] mb-4">
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

                {/* Title + Tags row */}
                <div className="flex items-baseline justify-between gap-4 mb-2">
                  <h3 className="font-sans text-[20px] sm:text-[22px] font-bold text-foreground group-hover:opacity-70 transition-opacity">
                    {exp.title}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0">
                    {exp.tags.map((tag, i) => (
                      <span key={tag} className="flex items-center">
                        {i > 0 && (
                          <span className="font-mono text-[10px] text-muted mx-1.5">
                            &middot;
                          </span>
                        )}
                        <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                          {tag}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="font-sans text-[14px] leading-relaxed text-muted max-w-md">
                  {exp.description}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
