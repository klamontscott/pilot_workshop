"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  {
    label: "Overview",
    items: [{ label: "Introduction", href: "/design-system" }],
  },
  {
    label: "Foundations",
    items: [
      { label: "Color", href: "/design-system/color" },
      { label: "Typography", href: "/design-system/typography" },
      { label: "Spacing", href: "/design-system/spacing" },
      { label: "Layout", href: "/design-system/layout" },
      { label: "Motion", href: "/design-system/motion" },
    ],
  },
  {
    label: "Atoms",
    items: [
      { label: "Buttons", href: "/design-system/buttons" },
      { label: "Badges", href: "/design-system/badges" },
      { label: "Eyebrows", href: "/design-system/eyebrows" },
      { label: "Links", href: "/design-system/links" },
      { label: "Pills", href: "/design-system/pills" },
    ],
  },
  {
    label: "Molecules",
    items: [
      { label: "Play Canvas", href: "/design-system/play-canvas" },
    ],
  },
  {
    label: "Templates",
    items: [{ label: "Stage", href: "/design-system/stage" }],
  },
];

export function DesignSystemNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-56 shrink-0 border-r border-border px-6 py-4 sticky top-12 h-[calc(100vh-3rem)] overflow-y-auto">
      <Link
        href="/design-system"
        className="font-sans text-[15px] font-bold text-foreground block mb-6"
      >
        Design System
      </Link>

      <nav className="flex flex-col gap-6">
        {sections.map((section) => (
          <div key={section.label}>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted block mb-2">
              {section.label}
            </span>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block text-[13px] py-1 px-2 rounded transition-colors ${
                        isActive
                          ? "font-medium text-foreground bg-foreground/5"
                          : "text-muted hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
