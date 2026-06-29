"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PlayProvider } from "@/lib/play-context";
import { SiteNav } from "@/components/nav/SiteNav";
import { PlayPanel } from "@/components/PlayPanel";
import { WorkPlayToggle } from "@/components/nav/WorkPlayToggle";

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isRoom = pathname === "/";
  const isImmersive = pathname.startsWith("/experiments/translator");
  const showChrome = !isRoom && !isImmersive;

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
      {showChrome && <SiteNav />}
      {showChrome && <PlayPanel />}
      {showChrome && <WorkPlayToggle />}
      <div className={`flex-1 flex flex-col ${showChrome ? "pt-12" : ""}`}>
        {children}
      </div>
    </PlayProvider>
  );
}
