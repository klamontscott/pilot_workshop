import { lazy } from "react";
import type { ExperimentConfig } from "@/types/experiment";

export const experiments: ExperimentConfig[] = [
  {
    id: "3d-room",
    title: "3D Room",
    description: "Interactive 3D portfolio room with basketball mini-game",
    date: "2026-06",
    tags: ["three.js", "3d"],
    position: { x: 200, y: 200 },
    size: { width: 480, height: 360 },
    component: lazy(() =>
      import("./RoomPreview").then((m) => ({ default: m.RoomPreview }))
    ),
    localUrl: "/",
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
  {
    id: "goodreads",
    title: "Bookshelf",
    description: "A curated collection of my favorite reads on Goodreads",
    date: "2026-06",
    tags: ["reading", "curation"],
    position: { x: 500, y: 500 },
    size: { width: 400, height: 300 },
    component: lazy(() =>
      import("./GoodreadsPreview").then((m) => ({
        default: m.GoodreadsPreview,
      }))
    ),
    fullUrl:
      "https://www.goodreads.com/review/list/71910989-keith-scott-ii?shelf=favorites",
  },
];
