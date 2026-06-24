"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { experiments } from "@/components/experiments";
import type { ExperimentConfig } from "@/types/experiment";

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

function Lightbox({
  experiment,
  onClose,
}: {
  experiment: ExperimentConfig;
  onClose: () => void;
}) {
  const Component = experiment.component;
  const hasFullUrl = !!experiment.fullUrl;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        className={`relative rounded-lg overflow-hidden ${
          hasFullUrl
            ? "w-[92vw] max-w-[1200px] h-[85vh]"
            : "w-[90vw] max-w-[900px] aspect-[4/3]"
        }`}
        initial={{ scale: 0.95, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 12 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1l12 12M13 1L1 13"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {hasFullUrl ? (
          <iframe
            src={experiment.fullUrl}
            className="w-full h-full border-0"
            allow="autoplay"
          />
        ) : (
          <Component />
        )}
      </motion.div>
    </motion.div>
  );
}

export function ExperimentsList() {
  const router = useRouter();
  const [activeExperiment, setActiveExperiment] =
    useState<ExperimentConfig | null>(null);

  return (
    <>
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
                <button
                  onClick={() => {
                    if (exp.localUrl) {
                      router.push(exp.localUrl);
                    } else if (exp.fullUrl) {
                      window.open(exp.fullUrl, "_blank");
                    } else {
                      setActiveExperiment(exp);
                    }
                  }}
                  className="group block w-full text-left cursor-pointer"
                >
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
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      <AnimatePresence>
        {activeExperiment && (
          <Lightbox
            experiment={activeExperiment}
            onClose={() => setActiveExperiment(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
