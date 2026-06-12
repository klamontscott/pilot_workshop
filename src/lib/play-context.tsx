"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface PlayContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  setPlaying: (value: boolean) => void;
}

const PlayContext = createContext<PlayContextType>({
  isPlaying: false,
  togglePlay: () => {},
  setPlaying: () => {},
});

export function PlayProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);
  const setPlaying = useCallback((value: boolean) => setIsPlaying(value), []);

  return (
    <PlayContext.Provider value={{ isPlaying, togglePlay, setPlaying }}>
      {children}
    </PlayContext.Provider>
  );
}

export function usePlay() {
  return useContext(PlayContext);
}
