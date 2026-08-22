import { useState, useRef } from "react"

const BEATS = [
  { src: "/experiments/supervisor-video/beat-03.mp4", label: "Clip 01" },
  { src: "/experiments/supervisor-video/beat-06.mp4", label: "Clip 02" },
  { src: "/experiments/supervisor-video/beat-10.mp4", label: "Clip 03" },
]

export default function SupervisorVideo() {
  const [activeBeat, setActiveBeat] = useState<number | null>(null)
  const mainRef = useRef<HTMLVideoElement>(null)

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Main video */}
      <div style={{ position: "relative", background: "#000", width: "100%" }}>
        <video
          ref={mainRef}
          src="/experiments/supervisor-video/supervisor-experience.mp4"
          controls
          playsInline
          preload="metadata"
          style={{ width: "100%", display: "block", maxHeight: 400 }}
        />
      </div>

      {/* Beat clips row */}
      <div
        style={{
          display: "flex",
          gap: 1,
          background: "#d0d0d0",
          borderTop: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        {BEATS.map((beat, i) => (
          <button
            key={i}
            onClick={() => setActiveBeat(activeBeat === i ? null : i)}
            style={{
              flex: 1,
              padding: "8px 6px",
              background: activeBeat === i ? "#e8e8e8" : "#f0f0f0",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              transition: "background 0.15s",
            }}
          >
            <span style={{ fontSize: 9, fontWeight: 700, color: "#1a1a1a", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              {beat.label}
            </span>
          </button>
        ))}
      </div>

      {/* Expanded beat clip */}
      {activeBeat !== null && (
        <div style={{ background: "#1a1a1a" }}>
          <video
            key={activeBeat}
            src={BEATS[activeBeat].src}
            controls
            autoPlay
            playsInline
            muted
            loop
            style={{ width: "100%", display: "block", maxHeight: 200 }}
          />
        </div>
      )}
    </div>
  )
}
