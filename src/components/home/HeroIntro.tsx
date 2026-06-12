"use client";

import { motion } from "framer-motion";

export function HeroIntro() {
  return (
    <motion.section
      className="min-h-screen flex flex-col justify-center px-8 sm:px-16 lg:px-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h1 className="font-sans text-[36px] sm:text-[48px] lg:text-[56px] font-bold leading-[1.15] tracking-tight text-foreground max-w-[680px]">
        Hi, I&apos;m Keith, a Bay Area designer working where design meets
        engineering.
      </h1>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="text-foreground"
        >
          <path
            d="M10 3v14m0 0l-5-5m5 5l5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </motion.section>
  );
}
