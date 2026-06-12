import type { ComponentType } from "react";

export interface ExperimentConfig {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  position: { x: number; y: number };
  size: { width: number; height: number };
  component: ComponentType;
}
