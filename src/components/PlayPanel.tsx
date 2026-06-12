"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { usePlay } from "@/lib/play-context";

const Basketball3DGame = dynamic(
  () => import("@/components/Basketball3DGame"),
  { ssr: false }
);

export function PlayPanel() {
  const { isPlaying, setPlaying } = usePlay();

  return (
    <AnimatePresence>
      {isPlaying && (
        <motion.div
          className="fixed inset-0 z-40 pt-[49px]"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Basketball3DGame onClose={() => setPlaying(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
