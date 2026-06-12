"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const Basketball3DGame = dynamic(
  () => import("@/components/Basketball3DGame"),
  { ssr: false }
);

export default function PlayPage() {
  const router = useRouter();

  return <Basketball3DGame onClose={() => router.push("/")} />;
}
