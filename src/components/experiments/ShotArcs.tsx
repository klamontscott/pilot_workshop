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
  progress: number;
  speed: number;
}

function createArc(width: number, height: number): Arc {
  const courtLeft = width * 0.15;
  const courtRight = width * 0.85;
  const startX = courtLeft + Math.random() * (courtRight - courtLeft);
  const startY = height * 0.7 + Math.random() * (height * 0.2);

  const rimX = width * 0.5;
  const rimY = height * 0.25;

  const peakY = Math.min(startY, rimY) - height * 0.15 - Math.random() * height * 0.1;
  const peakX = (startX + rimX) / 2 + (Math.random() - 0.5) * width * 0.05;

  const hue = 35 + Math.random() * 15;
  const sat = 85 + Math.random() * 15;
  const light = 55 + Math.random() * 15;

  return {
    startX,
    startY,
    peakX,
    peakY,
    endX: rimX + (Math.random() - 0.5) * 8,
    endY: rimY,
    color: `hsl(${hue}, ${sat}%, ${light}%)`,
    progress: 0,
    speed: 0.004 + Math.random() * 0.004,
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

    ctx.fillStyle = "#0A0A0A";
    ctx.fillRect(0, 0, w, h);

    // Draw rim
    const rimX = w * 0.5;
    const rimY = h * 0.25;
    ctx.strokeStyle = "#FF6B35";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(rimX - 18, rimY);
    ctx.lineTo(rimX + 18, rimY);
    ctx.stroke();

    // Spawn new arcs
    if (arcsRef.current.length < 5 && Math.random() < 0.03) {
      arcsRef.current.push(createArc(w, h));
    }

    // Draw arcs
    for (const arc of arcsRef.current) {
      arc.progress += arc.speed;

      const steps = Math.floor(arc.progress * 60);
      if (steps < 2) continue;

      ctx.strokeStyle = arc.color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = Math.min(1, 1 - (arc.progress - 0.8) * 5);
      ctx.beginPath();

      for (let i = 0; i <= steps; i++) {
        const t = i / 60;
        if (t > 1) break;
        const x = quadBezier(arc.startX, arc.peakX, arc.endX, t);
        const y = quadBezier(arc.startY, arc.peakY, arc.endY, t);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    arcsRef.current = arcsRef.current.filter((a) => a.progress < 1.2);
    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
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
