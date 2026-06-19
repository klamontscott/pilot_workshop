"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tokens } from "@/lib/tokens";

function AudioVisualizer({ audioRef, playing }: { audioRef: React.RefObject<HTMLAudioElement | null>; playing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!playing || !audioRef.current || !canvasRef.current) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
      analyserRef.current = ctxRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
      sourceRef.current = ctxRef.current.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(ctxRef.current.destination);
    }

    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }

    const analyser = analyserRef.current!;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const barCount = 5;

    function draw() {
      analyser.getByteFrequencyData(dataArray);

      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const barWidth = 2.5;
      const gap = 3;
      const totalWidth = barCount * barWidth + (barCount - 1) * gap;
      const startX = (w - totalWidth) / 2;
      const centerY = h / 2;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * (dataArray.length * 0.6)) + 2;
        const value = dataArray[dataIndex] / 255;
        const minHeight = 4;
        const maxHeight = h * 0.8;
        const barHeight = minHeight + value * (maxHeight - minHeight);

        const x = startX + i * (barWidth + gap);
        const y = centerY - barHeight / 2;

        ctx.fillStyle = "#D4845A";
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, barWidth / 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, audioRef]);

  if (!playing) return null;

  return (
    <canvas
      ref={canvasRef}
      className="w-8 h-6"
    />
  );
}

function ListenButton() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/website-story.mp3"
        preload="none"
        onEnded={() => setPlaying(false)}
      />
      <button
        onClick={toggle}
        className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full transition-all duration-300 cursor-pointer"
        style={{
          backgroundColor: playing ? "#D4845A" : "rgba(212, 132, 90, 0.1)",
          border: "1px solid",
          borderColor: playing ? "#D4845A" : "#D4845A",
          color: playing ? "white" : "#D4845A",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          {playing ? (
            <>
              <rect x="4" y="3" width="2.5" height="10" rx="0.5" fill="currentColor" />
              <rect x="9.5" y="3" width="2.5" height="10" rx="0.5" fill="currentColor" />
            </>
          ) : (
            <path d="M4 3l9 5-9 5V3z" fill="currentColor" />
          )}
        </svg>
        <span className="font-mono text-[12px] tracking-wide">
          {playing ? "Pause" : "Don\u2019t want to read? Listen here"}
        </span>
        <AudioVisualizer audioRef={audioRef} playing={playing} />
      </button>
    </>
  );
}

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 cursor-pointer hover:bg-foreground/[0.02] transition-colors"
      >
        <h2 className="font-sans text-[20px] font-bold text-foreground">
          {title}
        </h2>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
              opacity: { duration: 0.3, ease: "easeOut" },
            }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DesignSystemIntroduction() {
  return (
    <article className="flex flex-col gap-4">
      <div className="mb-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-4">
          Design System
        </p>

        <h1 className="font-sans text-[36px] sm:text-[44px] font-bold leading-[1.1] tracking-tight text-foreground mb-8">
          A small system, fully documented.
        </h1>

        <p className="font-sans text-[16px] leading-relaxed text-muted max-w-xl mb-6">
          This site is a monochrome editorial system for Keith Scott&apos;s
          experiments portfolio. It documents its foundations and components
          organized by Atomic Design, with every specimen rendered from the real
          source so the docs can never drift.
        </p>

        <ListenButton />
      </div>

      <Accordion title="The Playground" defaultOpen>
        <div className="flex flex-col gap-4 max-w-xl">
          <p className="font-sans text-[15px] leading-relaxed text-muted">
            The site is a playground &mdash; a space for going back and forth
            between experimenting and playing. Animations, visualizations, and
            games all live side by side. You explore, you tinker, you have fun.
          </p>
          <p className="font-sans text-[15px] leading-relaxed text-muted">
            The monochrome shell is intentional. The website itself is the{" "}
            <strong className="text-foreground">vehicle</strong> &mdash; clean,
            quiet, and out of the way. Color lives inside the experiments and
            games, because{" "}
            <strong className="text-foreground">
              the games are the fun part
            </strong>
            . The contrast between the neutral frame and the vivid content inside
            it is the whole point.
          </p>
        </div>
      </Accordion>

      <Accordion title="Atomic design, mapped to the code">
        <p className="font-sans text-[15px] leading-relaxed text-muted max-w-xl mb-6">
          Each layer below points at the exact files it documents. Components are
          imported live into their specimens, so what you see here is what ships.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted py-3 pr-6">
                  Layer
                </th>
                <th className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted py-3 pr-6">
                  Source in Repo
                </th>
                <th className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted py-3">
                  Documented As
                </th>
              </tr>
            </thead>
            <tbody className="font-sans text-[13px]">
              <tr className="border-b border-border">
                <td className="py-3 pr-6 text-foreground">Foundations</td>
                <td className="py-3 pr-6">
                  <code className="font-mono text-[12px] text-muted">
                    globals.css
                  </code>
                  {" · "}
                  <code className="font-mono text-[12px] text-muted">
                    tokens.ts
                  </code>
                </td>
                <td className="py-3 text-muted">
                  Color, Typography, Spacing, Layout, Motion
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-6 text-foreground">Atoms</td>
                <td className="py-3 pr-6">
                  <code className="font-mono text-[12px] text-muted">
                    components/
                  </code>
                </td>
                <td className="py-3 text-muted">
                  Buttons, Badges, Eyebrows, Links, Pills
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-6 text-foreground">Molecules</td>
                <td className="py-3 pr-6">
                  <code className="font-mono text-[12px] text-muted">
                    Basketball3DGame.tsx
                  </code>
                </td>
                <td className="py-3 text-muted">Play Canvas</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-foreground">Templates</td>
                <td className="py-3 pr-6">
                  <code className="font-mono text-[12px] text-muted">
                    app/layout.tsx
                  </code>
                </td>
                <td className="py-3 text-muted">Stage &mdash; the shell</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Accordion>

      <Accordion title="Design tokens">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(tokens.color).map(([name, value]) => (
            <div key={name} className="flex flex-col gap-2">
              <div
                className="w-full aspect-square rounded-lg border border-border"
                style={{ backgroundColor: value }}
              />
              <span className="font-mono text-[11px] text-muted">{name}</span>
              <span className="font-mono text-[11px] text-foreground">
                {value}
              </span>
            </div>
          ))}
        </div>
      </Accordion>
    </article>
  );
}
