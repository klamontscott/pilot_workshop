import type { Metadata } from "next";
import { geistMono } from "@/lib/fonts";
import { ClientShell } from "@/components/ClientShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Keith Scott II — Experiments",
  description:
    "Creative coding experiments at the intersection of design and code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ClientShell>
          <div className="pt-12 flex-1 flex flex-col">{children}</div>
        </ClientShell>
      </body>
    </html>
  );
}
