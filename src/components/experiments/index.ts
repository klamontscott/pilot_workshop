import { lazy } from "react";
import type { ExperimentConfig } from "@/types/experiment";

export const experiments: ExperimentConfig[] = [
  {
    id: "shot-arcs",
    title: "Shot Arcs",
    description: "Animated shooting arc visualization inspired by Curry's form",
    date: "2026-06",
    tags: ["canvas", "animation"],
    position: { x: 200, y: 200 },
    size: { width: 480, height: 360 },
    component: lazy(() =>
      import("./ShotArcs").then((m) => ({ default: m.ShotArcs }))
    ),
  },
  {
    id: "typewriter",
    title: "Typewriter",
    description: "Looping typewriter text animation with blinking cursor",
    date: "2026-06",
    tags: ["dom", "animation"],
    position: { x: 800, y: 300 },
    size: { width: 400, height: 240 },
    component: lazy(() =>
      import("./Typewriter").then((m) => ({ default: m.Typewriter }))
    ),
  },
];
