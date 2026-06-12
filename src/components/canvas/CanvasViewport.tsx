"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { useGesture } from "@use-gesture/react";
import { experiments } from "@/components/experiments";
import { ExperimentNode } from "./ExperimentNode";

const MIN_ZOOM = 0.15;
const MAX_ZOOM = 2.0;
const DEFAULT_ZOOM = 0.6;

interface Transform {
  x: number;
  y: number;
  scale: number;
}

function getClusterCenter() {
  if (experiments.length === 0) return { x: 0, y: 0 };
  let sumX = 0;
  let sumY = 0;
  for (const exp of experiments) {
    sumX += exp.position.x + exp.size.width / 2;
    sumY += exp.position.y + exp.size.height / 2;
  }
  return { x: sumX / experiments.length, y: sumY / experiments.length };
}

function getInitialTransform(
  targetId?: string | null
): Transform {
  const target = targetId
    ? experiments.find((e) => e.id === targetId)
    : null;

  const center = target
    ? {
        x: target.position.x + target.size.width / 2,
        y: target.position.y + target.size.height / 2,
      }
    : getClusterCenter();

  return {
    x: window.innerWidth / 2 - center.x * DEFAULT_ZOOM,
    y: window.innerHeight / 2 - center.y * DEFAULT_ZOOM,
    scale: DEFAULT_ZOOM,
  };
}

export function CanvasViewport({ targetId }: { targetId?: string | null }) {
  const transformRef = useRef<Transform>({ x: 0, y: 0, scale: DEFAULT_ZOOM });
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(
    new Set(experiments.map((e) => e.id))
  );

  const applyTransform = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { x, y, scale } = transformRef.current;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  }, []);

  const updateVisibility = useCallback(() => {
    if (!viewportRef.current) return;
    const { x, y, scale } = transformRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 200;

    const next = new Set<string>();
    for (const exp of experiments) {
      const ex = x + exp.position.x * scale;
      const ey = y + exp.position.y * scale;
      const ew = exp.size.width * scale;
      const eh = exp.size.height * scale;

      if (
        ex + ew > -margin &&
        ex < vw + margin &&
        ey + eh > -margin &&
        ey < vh + margin
      ) {
        next.add(exp.id);
      }
    }
    setVisibleIds(next);
  }, []);

  useEffect(() => {
    const t = getInitialTransform(targetId);
    transformRef.current = t;
    applyTransform();
    updateVisibility();
  }, [targetId, applyTransform, updateVisibility]);

  useGesture(
    {
      onDrag: ({ delta: [dx, dy] }) => {
        transformRef.current.x += dx;
        transformRef.current.y += dy;
        applyTransform();
        updateVisibility();
      },
      onWheel: ({ delta: [, dy], event }) => {
        event.preventDefault();
        const t = transformRef.current;
        const factor = 1 - dy * 0.001;
        const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, t.scale * factor));

        const rect = viewportRef.current!.getBoundingClientRect();
        const mx = event.clientX - rect.left;
        const my = event.clientY - rect.top;

        const ratio = newScale / t.scale;
        t.x = mx - (mx - t.x) * ratio;
        t.y = my - (my - t.y) * ratio;
        t.scale = newScale;

        applyTransform();
        updateVisibility();
      },
      onPinch: ({ offset: [scale], origin: [ox, oy] }) => {
        const t = transformRef.current;
        const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale));

        const rect = viewportRef.current!.getBoundingClientRect();
        const mx = ox - rect.left;
        const my = oy - rect.top;

        const ratio = newScale / t.scale;
        t.x = mx - (mx - t.x) * ratio;
        t.y = my - (my - t.y) * ratio;
        t.scale = newScale;

        applyTransform();
        updateVisibility();
      },
    },
    {
      target: viewportRef,
      drag: { filterTaps: true },
      wheel: { eventOptions: { passive: false } },
      pinch: { scaleBounds: { min: MIN_ZOOM, max: MAX_ZOOM } },
    }
  );

  const handleZoom = useCallback(
    (direction: 1 | -1) => {
      const t = transformRef.current;
      const factor = direction === 1 ? 1.3 : 0.7;
      const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, t.scale * factor));

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const ratio = newScale / t.scale;
      t.x = cx - (cx - t.x) * ratio;
      t.y = cy - (cy - t.y) * ratio;
      t.scale = newScale;

      applyTransform();
      updateVisibility();
    },
    [applyTransform, updateVisibility]
  );

  return (
    <div
      ref={viewportRef}
      className="fixed inset-0 overflow-hidden cursor-grab active:cursor-grabbing"
      style={{ touchAction: "none" }}
    >
      <div
        ref={containerRef}
        className="absolute top-0 left-0 origin-top-left"
        style={{ willChange: "transform" }}
      >
        {experiments.map((exp) =>
          visibleIds.has(exp.id) ? (
            <ExperimentNode key={exp.id} config={exp} />
          ) : null
        )}
      </div>

      {/* Zoom controls for mobile */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50 sm:hidden">
        <button
          onClick={() => handleZoom(1)}
          className="w-10 h-10 rounded-full border border-border bg-background text-foreground flex items-center justify-center font-mono text-lg"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => handleZoom(-1)}
          className="w-10 h-10 rounded-full border border-border bg-background text-foreground flex items-center justify-center font-mono text-lg"
          aria-label="Zoom out"
        >
          -
        </button>
      </div>
    </div>
  );
}
