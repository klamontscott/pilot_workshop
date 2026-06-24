"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PlayProvider } from "@/lib/play-context";
import { SiteNav } from "@/components/nav/SiteNav";
import { PlayPanel } from "@/components/PlayPanel";

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isRoom = pathname === "/";

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.type === "navigate" && typeof e.data.path === "string") {
        router.push(e.data.path);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [router]);

  return (
    <PlayProvider>
      {!isRoom && <SiteNav />}
      {!isRoom && <PlayPanel />}
      {children}
    </PlayProvider>
  );
}
