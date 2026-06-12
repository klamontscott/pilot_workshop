"use client";

import { PlayProvider } from "@/lib/play-context";
import { SiteNav } from "@/components/nav/SiteNav";
import { PlayPanel } from "@/components/PlayPanel";

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <PlayProvider>
      <SiteNav />
      <PlayPanel />
      {children}
    </PlayProvider>
  );
}
