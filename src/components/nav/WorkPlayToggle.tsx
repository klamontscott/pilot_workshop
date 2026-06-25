"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const ITEMS = [
  { label: "Work", href: "/experiments" },
  { label: "Play", href: "/" },
] as const;

export function WorkPlayToggle() {
  const pathname = usePathname();
  const activeIndex = pathname === "/" ? 1 : 0;

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-0 rounded-full px-1.5 py-1.5 border border-border bg-background/80 backdrop-blur-xl shadow-lg">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border shrink-0">
          <Image
            src="/images/profile.jpg"
            alt="Keith Scott"
            width={40}
            height={40}
            className="w-full h-full object-cover"
            style={{ objectPosition: "68% 25%" }}
          />
        </div>

        {/* Divider */}
        <div className="w-px h-7 bg-border mx-2.5 shrink-0" />

        {/* Toggle pills */}
        <div className="flex items-center gap-1 pr-1">
          {ITEMS.map((item, i) => {
            const isActive = i === activeIndex;
            return (
              <Link key={item.label} href={item.href} className="relative">
                {isActive && (
                  <motion.span
                    layoutId="toggle-pill"
                    className="absolute inset-0 rounded-full bg-foreground"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span
                  className={`relative z-10 block px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
                    isActive ? "text-background" : "text-muted"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
