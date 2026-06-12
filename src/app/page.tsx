import Link from "next/link";
import { HeroIntro } from "@/components/home/HeroIntro";
import { ExperimentsList } from "@/components/home/ExperimentsList";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <HeroIntro />
      <ExperimentsList />
      <footer className="w-full px-8 sm:px-16 lg:px-24 pb-8 flex items-center justify-between">
        <span className="font-mono text-[11px] text-muted">2026</span>
        <Link
          href="/design-system"
          className="font-mono text-[11px] uppercase tracking-wider text-muted hover:text-foreground transition-colors"
        >
          Design System
        </Link>
      </footer>
    </main>
  );
}
