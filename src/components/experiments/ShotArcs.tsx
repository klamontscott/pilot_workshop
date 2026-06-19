"use client";

import { useRef, useEffect, useCallback } from "react";

interface Arc {
  startX: number;
  startY: number;
  peakX: number;
  peakY: number;
  endX: number;
  endY: number;
  color: string;
  glowColor: string;
  progress: number;
  speed: number;
  opacity: number;
  lineWidth: number;
}

function createArc(width: number, height: number): Arc {
  const courtLeft = width * 0.15;
  const courtRight = width * 0.85;
  const startX = courtLeft + Math.random() * (courtRight - courtLeft);
  const startY = height * 0.7 + Math.random() * (height * 0.2);

  const rimX = width * 0.5;
  const rimY = height * 0.25;

  const peakY =
    Math.min(startY, rimY) - height * 0.15 - Math.random() * height * 0.1;
  const peakX =
    (startX + rimX) / 2 + (Math.random() - 0.5) * width * 0.05;

  // Vivid color palette: orange, gold, hot pink, cyan
  const palettes = [
    { color: "#FF6B35", glow: "rgba(255, 107, 53, 0.6)" },
    { color: "#FFB800", glow: "rgba(255, 184, 0, 0.6)" },
    { color: "#FF3CAC", glow: "rgba(255, 60, 172, 0.5)" },
    { color: "#00D4FF", glow: "rgba(0, 212, 255, 0.5)" },
    { color: "#FFA500", glow: "rgba(255, 165, 0, 0.6)" },
  ];
  const palette = palettes[Math.floor(Math.random() * palettes.length)];

  return {
    startX,
    startY,
    peakX,
    peakY,
    endX: rimX + (Math.random() - 0.5) * 8,
    endY: rimY,
    color: palette.color,
    glowColor: palette.glow,
    progress: 0,
    speed: 0.006 + Math.random() * 0.005,
    opacity: 1,
    lineWidth: 2 + Math.random() * 1.5,
  };
}

function quadBezier(p0: number, p1: number, p2: number, t: number) {
  return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
}

export function ShotArcs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arcsRef = useRef<Arc[]>([]);
  const rafRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Slight fade for trail persistence
    ctx.fillStyle = "rgba(10, 10, 10, 0.15)";
    ctx.fillRect(0, 0, w, h);

    // Draw rim
    const rimX = w * 0.5;
    const rimY = h * 0.25;
    ctx.strokeStyle = "#FF6B35";
    ctx.lineWidth = 4;
    ctx.shadowColor = "rgba(255, 107, 53, 0.8)";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(rimX - 22, rimY);
    ctx.lineTo(rimX + 22, rimY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Backboard
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rimX + 22, rimY - 30);
    ctx.lineTo(rimX + 22, rimY + 10);
    ctx.stroke();

    // Spawn new arcs
    if (arcsRef.current.length < 6 && Math.random() < 0.04) {
      arcsRef.current.push(createArc(w, h));
    }

    // Draw arcs
    for (const arc of arcsRef.current) {
      arc.progress += arc.speed;

      // Fade out after arc completes
      if (arc.progress > 1) {
        arc.opacity = Math.max(0, arc.opacity - 0.008);
      }

      const drawProgress = Math.min(arc.progress, 1);
      const steps = Math.floor(drawProgress * 80);
      if (steps < 2) continue;

      // Arc trail with glow
      ctx.save();
      ctx.globalAlpha = arc.opacity;
      ctx.shadowColor = arc.glowColor;
      ctx.shadowBlur = 12;
      ctx.strokeStyle = arc.color;
      ctx.lineWidth = arc.lineWidth;
      ctx.beginPath();

      for (let i = 0; i <= steps; i++) {
        const t = i / 80;
        const x = quadBezier(arc.startX, arc.peakX, arc.endX, t);
        const y = quadBezier(arc.startY, arc.peakY, arc.endY, t);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Traveling sphere at the tip of the arc
      if (arc.progress <= 1) {
        const tipT = drawProgress;
        const tipX = quadBezier(arc.startX, arc.peakX, arc.endX, tipT);
        const tipY = quadBezier(arc.startY, arc.peakY, arc.endY, tipT);

        // Outer glow
        ctx.shadowColor = arc.glowColor;
        ctx.shadowBlur = 20;
        ctx.fillStyle = arc.color;
        ctx.beginPath();
        ctx.arc(tipX, tipY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Inner bright core
        ctx.shadowBlur = 0;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(tipX, tipY, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    // Remove fully faded arcs
    arcsRef.current = arcsRef.current.filter((a) => a.opacity > 0.01);
    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;

    // Initial black fill
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded"
      style={{ background: "#0A0A0A" }}
    />
  );
}
