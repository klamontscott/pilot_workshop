"use client";

import { useState, useEffect, useRef } from "react";

const words = [
  "chaos.",
  "disarray.",
  "confusing.",
  "overwhelming.",
  "fragmented.",
  "inconsistent.",
  "scattered.",
  "broken.",
];

const START_DELAY = 1500;

export function Typewriter() {
  const [displayed, setDisplayed] = useState("");
  const [cursorVisible, setCursorVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    function tick() {
      const word = words[wordIndex];
      if (!deleting) {
        charIndex++;
        setDisplayed(word.slice(0, charIndex));
        if (charIndex === word.length) {
          timeout = setTimeout(() => {
            deleting = true;
            tick();
          }, 1800);
          return;
        }
        timeout = setTimeout(tick, 80 + Math.random() * 40);
      } else {
        charIndex--;
        setDisplayed(word.slice(0, charIndex));
        if (charIndex <= 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          timeout = setTimeout(tick, 400);
          return;
        }
        timeout = setTimeout(tick, 40 + Math.random() * 20);
      }
    }

    timeout = setTimeout(tick, START_DELAY);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      setCursorVisible(true);
      const interval = setInterval(() => {
        setCursorVisible((v) => !v);
      }, 530);
      return () => clearInterval(interval);
    }, START_DELAY);
    return () => clearTimeout(delay);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center w-full h-full bg-background px-6"
    >
      <p className="font-mono text-[14px] sm:text-[16px] text-foreground leading-relaxed">
        <span className="text-muted">Onboarding is </span>
        <span className="font-bold">{displayed || "\u200B"}</span>
        <span
          className="inline-block w-[2px] h-[1.1em] bg-foreground ml-0.5 align-text-bottom transition-opacity duration-100"
          style={{ opacity: cursorVisible ? 1 : 0 }}
        />
      </p>
    </div>
  );
}
