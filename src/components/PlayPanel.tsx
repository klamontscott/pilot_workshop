"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { usePlay } from "@/lib/play-context";

const Basketball3DGame = dynamic(
  () => import("@/components/Basketball3DGame"),
  { ssr: false }
);

function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0A0A0A]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Subtle top line accent */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-[#4499ff]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        style={{ originX: 0 }}
      />

      {/* Title */}
      <div className="flex flex-col items-center gap-6">
        <motion.p
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#4499ff]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        >
          Welcome to
        </motion.p>

        <motion.h1
          className="font-mono text-[36px] sm:text-[48px] font-bold text-white tracking-tight"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
        >
          Hoop Dreams
        </motion.h1>

        <motion.div
          className="w-16 h-px bg-[#ff6600]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 1.2 }}
        />

        <motion.p
          className="font-mono text-[12px] text-[#666] max-w-xs text-center leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.6 }}
        >
          Tap a ball. Charge your shot. Hit the green zone.
        </motion.p>

        {/* Loading dots */}
        <motion.div
          className="flex gap-1.5 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#444]"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

export function PlayPanel() {
  const { isPlaying, setPlaying } = usePlay();
  const [showSplash, setShowSplash] = useState(false);
  const [loadGame, setLoadGame] = useState(false);

  // When play activates, show splash and start loading the game after a short delay
  useEffect(() => {
    if (isPlaying) {
      setShowSplash(true);
      setLoadGame(false);
      // Give the slide animation time to finish, then start loading the game
      const timer = setTimeout(() => setLoadGame(true), 600);
      return () => clearTimeout(timer);
    } else {
      setShowSplash(false);
      setLoadGame(false);
    }
  }, [isPlaying]);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <AnimatePresence>
      {isPlaying && (
        <motion.div
          className="fixed left-0 right-0 bottom-0 z-40 overflow-hidden"
          style={{ top: 49 }}
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Game loads behind the splash */}
          {loadGame && (
            <div className="absolute inset-0">
              <Basketball3DGame onClose={() => setPlaying(false)} />
            </div>
          )}

          {/* Splash overlay fades away after ~4s */}
          <AnimatePresence>
            {showSplash && (
              <SplashScreen onComplete={handleSplashComplete} />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
