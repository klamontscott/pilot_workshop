"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const words = [
  "Design is how it works.",
  "Clarity over decoration.",
  "Every pixel is a decision.",
  "Systems, not pages.",
  "Prototype in code.",
  "Ship and iterate.",
];

export function Typewriter() {
  const [displayed, setDisplayed] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const cursorRef = useRef<HTMLSpanElement>(null);

  const tick = useCallback(() => {
    const current = words[wordIndex];

    if (!isDeleting) {
      if (charIndex < current.length) {
        setDisplayed(current.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
        return 40 + Math.random() * 60;
      } else {
        return 2000;
      }
    } else {
      if (charIndex > 0) {
        setDisplayed(current.slice(0, charIndex - 1));
        setCharIndex((c) => c - 1);
        return 25;
      } else {
        setIsDeleting(false);
        setWordIndex((w) => (w + 1) % words.length);
        return 400;
      }
    }
  }, [wordIndex, charIndex, isDeleting]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const step = () => {
      const delay = tick();

      if (!isDeleting && charIndex === words[wordIndex].length) {
        timeout = setTimeout(() => {
          setIsDeleting(true);
          step();
        }, delay);
      } else {
        timeout = setTimeout(step, delay);
      }
    };

    step();
    return () => clearTimeout(timeout);
  }, [tick, isDeleting, charIndex, wordIndex]);

  return (
    <div className="flex items-center justify-center w-full h-full bg-background px-6">
      <p className="font-mono text-[14px] sm:text-[16px] text-foreground leading-relaxed">
        {displayed}
        <span
          ref={cursorRef}
          className="inline-block w-[2px] h-[1.1em] bg-foreground ml-0.5 align-text-bottom animate-[blink_1s_step-end_infinite]"
        />
      </p>

      <style jsx>{`
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
