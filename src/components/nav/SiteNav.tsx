"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { PlayToggle } from "./PlayToggle";

export function SiteNav() {
  const pathname = usePathname();
  const isDesignSystem = pathname.startsWith("/design-system");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 h-12 bg-background border-b border-border">
      <Link
        href="/"
        className="font-sans text-[14px] font-medium text-foreground leading-none group"
      >
        <span className="relative">
          Keith Scott
          <motion.span
            className="absolute left-0 -bottom-1 h-px bg-foreground origin-left"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ width: "100%" }}
          />
        </span>
      </Link>

      <div className="flex items-center gap-5">
        {!isDesignSystem && <PlayToggle />}

        <Link
          href={isDesignSystem ? "/" : "/design-system"}
          className="font-mono text-[12px] uppercase tracking-wider text-foreground leading-none group"
        >
          <span className="relative">
            {isDesignSystem ? "Home" : "Design System"}
            <motion.span
              className="absolute left-0 -bottom-1 h-px bg-foreground origin-left"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{ width: "100%" }}
            />
          </span>
        </Link>
      </div>
    </nav>
  );
}
