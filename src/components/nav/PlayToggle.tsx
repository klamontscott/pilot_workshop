"use client";

import { motion } from "framer-motion";
import { usePlay } from "@/lib/play-context";

export function PlayToggle() {
  const { isPlaying, togglePlay } = usePlay();

  return (
    <button
      onClick={togglePlay}
      className="relative flex items-center h-7 rounded-full border border-border bg-background overflow-hidden cursor-pointer"
      aria-label={isPlaying ? "Switch to home" : "Switch to play"}
    >
      {/* Sliding pill indicator */}
      <motion.div
        className="absolute top-0.5 bottom-0.5 rounded-full bg-foreground"
        initial={false}
        animate={{
          left: isPlaying ? "50%" : "2px",
          right: isPlaying ? "2px" : "50%",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />

      {/* Labels */}
      <span
        className={`relative z-10 px-3 font-mono text-[10px] uppercase tracking-wider transition-colors duration-200 ${
          !isPlaying ? "text-background" : "text-muted"
        }`}
      >
        Home
      </span>
      <span
        className={`relative z-10 px-3 font-mono text-[10px] uppercase tracking-wider transition-colors duration-200 ${
          isPlaying ? "text-background" : "text-muted"
        }`}
      >
        Play
      </span>
    </button>
  );
}
