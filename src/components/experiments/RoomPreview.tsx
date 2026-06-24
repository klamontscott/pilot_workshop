"use client";

import { useState } from "react";

export function RoomPreview() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ backgroundColor: "#0A0A0A" }}
    >
      {/* Live room preview */}
      <iframe
        src="https://portfolio-zeta-virid-62.vercel.app/?redirect=/experiments"
        className="w-full h-full border-0 pointer-events-none"
        style={{
          transform: "scale(1.05)",
          transformOrigin: "center center",
          opacity: hovered ? 0 : 1,
          transition: "opacity 0.6s ease",
        }}
        loading="lazy"
        tabIndex={-1}
      />

      {/* Wireframe overlay — architectural blueprint style */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.6s ease",
          backgroundColor: "#0C1A2E",
        }}
      >
        <svg
          viewBox="0 0 480 360"
          fill="none"
          className="w-full h-full"
          style={{ padding: "24px" }}
        >
          {/* Grid */}
          {Array.from({ length: 13 }).map((_, i) => (
            <line
              key={`vg-${i}`}
              x1={i * 40}
              y1={0}
              x2={i * 40}
              y2={360}
              stroke="#1A3A5C"
              strokeWidth={0.5}
            />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              key={`hg-${i}`}
              x1={0}
              y1={i * 40}
              x2={480}
              y2={i * 40}
              stroke="#1A3A5C"
              strokeWidth={0.5}
            />
          ))}

          {/* Floor plane — perspective lines */}
          <line x1={240} y1={120} x2={40} y2={320} stroke="#4A9EFF" strokeWidth={0.8} />
          <line x1={240} y1={120} x2={440} y2={320} stroke="#4A9EFF" strokeWidth={0.8} />
          <line x1={40} y1={320} x2={440} y2={320} stroke="#4A9EFF" strokeWidth={1} />

          {/* Back wall */}
          <rect x={120} y={60} width={240} height={180} rx={0} stroke="#4A9EFF" strokeWidth={1} fill="none" />

          {/* Room edges — perspective */}
          <line x1={120} y1={240} x2={40} y2={320} stroke="#4A9EFF" strokeWidth={0.8} />
          <line x1={360} y1={240} x2={440} y2={320} stroke="#4A9EFF" strokeWidth={0.8} />
          <line x1={120} y1={60} x2={40} y2={20} stroke="#4A9EFF" strokeWidth={0.5} strokeDasharray="4 4" />
          <line x1={360} y1={60} x2={440} y2={20} stroke="#4A9EFF" strokeWidth={0.5} strokeDasharray="4 4" />

          {/* Window on back wall */}
          <rect x={180} y={90} width={60} height={50} stroke="#4A9EFF" strokeWidth={0.6} fill="none" strokeDasharray="3 3" />
          <line x1={210} y1={90} x2={210} y2={140} stroke="#4A9EFF" strokeWidth={0.4} />
          <line x1={180} y1={115} x2={240} y2={115} stroke="#4A9EFF" strokeWidth={0.4} />

          {/* Desk / table */}
          <rect x={260} y={160} width={80} height={5} stroke="#4A9EFF" strokeWidth={0.8} fill="none" />
          <line x1={265} y1={165} x2={265} y2={210} stroke="#4A9EFF" strokeWidth={0.6} />
          <line x1={335} y1={165} x2={335} y2={210} stroke="#4A9EFF" strokeWidth={0.6} />

          {/* Chair */}
          <ellipse cx={300} cy={230} rx={18} ry={8} stroke="#4A9EFF" strokeWidth={0.6} fill="none" />
          <line x1={300} y1={222} x2={300} y2={195} stroke="#4A9EFF" strokeWidth={0.6} />
          <line x1={288} y1={200} x2={312} y2={200} stroke="#4A9EFF" strokeWidth={0.5} />

          {/* Basketball hoop */}
          <line x1={150} y1={100} x2={150} y2={160} stroke="#FF6B35" strokeWidth={0.8} />
          <rect x={140} y={95} width={20} height={15} stroke="#FF6B35" strokeWidth={0.8} fill="none" />
          <ellipse cx={150} cy={115} rx={10} ry={4} stroke="#FF6B35" strokeWidth={0.6} fill="none" />

          {/* Dimension lines */}
          <line x1={50} y1={340} x2={430} y2={340} stroke="#2A5A8A" strokeWidth={0.5} />
          <line x1={50} y1={336} x2={50} y2={344} stroke="#2A5A8A" strokeWidth={0.5} />
          <line x1={430} y1={336} x2={430} y2={344} stroke="#2A5A8A" strokeWidth={0.5} />

          <line x1={460} y1={30} x2={460} y2={310} stroke="#2A5A8A" strokeWidth={0.5} />
          <line x1={456} y1={30} x2={464} y2={30} stroke="#2A5A8A" strokeWidth={0.5} />
          <line x1={456} y1={310} x2={464} y2={310} stroke="#2A5A8A" strokeWidth={0.5} />
        </svg>

        {/* Label */}
        <div
          className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded"
          style={{
            backgroundColor: "rgba(74, 158, 255, 0.15)",
            color: "#4A9EFF",
            border: "1px solid rgba(74, 158, 255, 0.3)",
          }}
        >
          Wireframe
        </div>
      </div>
    </div>
  );
}
