"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { usePlay } from "@/lib/play-context";

export function GameButtons() {
  const { togglePlay } = usePlay();
  const [showMario, setShowMario] = useState(false);

  return (
    <>
      <div className="flex items-center gap-4">
        {/* Basketball — opens basketball game */}
        <button
          onClick={togglePlay}
          className="w-9 h-9 flex items-center justify-center overflow-hidden hover:scale-110 transition-transform cursor-pointer"
          aria-label="Play basketball game"
        >
          <span className="text-[36px] leading-none">🏀</span>
        </button>

        {/* Mario — opens Mario game */}
        <button
          onClick={() => setShowMario(true)}
          className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden hover:scale-110 transition-transform cursor-pointer bg-[#6B93D6]"
          aria-label="Play Mario game"
        >
          <Image
            src="/mario-stand.png"
            alt="Mario"
            width={24}
            height={24}
            className="object-contain"
            style={{ width: "auto", height: "24px" }}
          />
        </button>
      </div>

      {/* Mario lightbox */}
      <AnimatePresence>
        {showMario && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowMario(false)}
            />

            <motion.div
              className="relative w-[90vw] max-w-[1024px] aspect-[16/9] rounded-lg overflow-hidden"
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 12 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <button
                onClick={() => setShowMario(false)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              <iframe
                src="/mario/index.html"
                className="w-full h-full border-0"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
