"use client";

import { motion } from "framer-motion";
import { usePlay } from "@/lib/play-context";

export function PlayToggle() {
  const { isPlaying, togglePlay } = usePlay();

  return (
    <button
      onClick={togglePlay}
      className="relative flex items-center h-7 rounded-full border border-border bg-background cursor-pointer"
      aria-label={isPlaying ? "Switch to home" : "Switch to play"}
    >
      {/* Labels — each is the same width so the pill can slide cleanly */}
      <span className="relative z-10 w-14 text-center font-mono text-[10px] uppercase tracking-wider">
        <span className={`transition-colors duration-200 ${!isPlaying ? "text-background" : "text-muted"}`}>
          Home
        </span>
      </span>
      <span className="relative z-10 w-14 text-center font-mono text-[10px] uppercase tracking-wider">
        <span className={`transition-colors duration-200 ${isPlaying ? "text-background" : "text-muted"}`}>
          Play
        </span>
      </span>

      {/* Sliding black bubble */}
      <motion.div
        className="absolute top-[3px] bottom-[3px] w-[calc(50%-3px)] rounded-full bg-foreground"
        initial={false}
        animate={{ x: isPlaying ? "calc(100% + 3px)" : 0 }}
        style={{ left: 3 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
      />
    </button>
  );
}
