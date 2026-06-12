import { DesignSystemNav } from "@/components/design-system/DesignSystemNav";

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <DesignSystemNav />
      <main className="flex-1 min-w-0 px-8 sm:px-16 lg:px-24 py-12 max-w-4xl">
        {children}
      </main>
    </div>
  );
}
