import Link from "next/link";
import { HeroIntro } from "@/components/home/HeroIntro";
import { ExperimentsList } from "@/components/home/ExperimentsList";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <HeroIntro />
      <ExperimentsList />
      <footer className="w-full px-8 sm:px-16 lg:px-24 pb-8 flex items-center justify-between">
        <span className="font-mono text-[11px] text-muted">Designed and coded by Keith Scott &middot; 2026</span>
        <div className="flex items-center gap-4">
          <a
            href="mailto:klamontscott@gmail.com"
            className="font-mono text-[11px] uppercase tracking-wider text-muted hover:text-foreground transition-colors"
          >
            Contact
          </a>
          <a
            href="https://www.linkedin.com/in/keith-scottii/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] uppercase tracking-wider text-muted hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </main>
  );
}
