export default function SiteReadme() {
  const h1: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 800,
    color: "#1a1a1a",
    margin: "0 0 6px",
    letterSpacing: "-0.01em",
    fontFamily: "'Inter', system-ui, sans-serif",
  }
  const subtitle: React.CSSProperties = {
    fontSize: 13,
    color: "rgba(0,0,0,0.5)",
    margin: "0 0 24px",
    lineHeight: 1.5,
  }
  const h2: React.CSSProperties = {
    fontSize: 15,
    fontWeight: 700,
    color: "#1a1a1a",
    margin: "28px 0 12px",
    paddingBottom: 6,
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    fontFamily: "'Inter', system-ui, sans-serif",
  }
  const p: React.CSSProperties = {
    fontSize: 13,
    lineHeight: 1.65,
    color: "rgba(0,0,0,0.7)",
    margin: "0 0 12px",
  }
  const li: React.CSSProperties = {
    fontSize: 13,
    lineHeight: 1.65,
    color: "rgba(0,0,0,0.7)",
    marginBottom: 4,
    paddingLeft: 4,
  }
  const bold: React.CSSProperties = {
    fontWeight: 700,
    color: "#1a1a1a",
  }
  const code: React.CSSProperties = {
    fontSize: 11,
    fontFamily: "'SF Mono', 'Fira Code', monospace",
    background: "rgba(0,0,0,0.06)",
    padding: "2px 5px",
    borderRadius: 3,
    color: "#1a1a1a",
  }
  const tableRow: React.CSSProperties = {
    display: "flex",
    gap: 12,
    padding: "6px 0",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
    fontSize: 13,
    color: "rgba(0,0,0,0.7)",
  }
  const tableLabel: React.CSSProperties = {
    minWidth: 28,
    color: "rgba(0,0,0,0.35)",
    fontWeight: 600,
    fontSize: 11,
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        padding: "24px 28px 32px",
        background: "#f5f5f5",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <h1 style={h1}>Keith Scott — Interactive Portfolio</h1>
      <p style={subtitle}>
        An interactive portfolio built with React, TypeScript, and Three.js.
        Each folder on this desktop is a standalone experiment — click to explore.
      </p>

      <h2 style={h2}>Experiments</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {[
          ["001", "3D Portfolio Room", "Immersive Three.js workspace with navigable space"],
          ["002", "Photo Gallery", "Masonry layout with filtering, lightbox, and cloud likes"],
          ["003", "Hoop Dreams", "3D basketball arcade with physics and global leaderboard"],
          ["004", "Space Runner", "Canvas 2D platformer with sprite animation"],
          ["005", "Bookcase", "Interactive 3D bookshelf with pull-out details"],
          ["006", "Audio-Reactive Translator", "Bilingual translation hero with audio-reactive particle sphere"],
          ["007", "Grid Banner", "Canvas tracers racing across rows with motion trails"],
          ["008", "Typewriter", "Looping type/delete animation with realistic cadence"],
          ["009", "Dynamic Carousel", "Spring-animated before/after carousel"],
          ["010", "PGR Logo Animation", "Step-by-step After Effects tutorial carousel"],
        ].map(([num, name, desc]) => (
          <div key={num} style={tableRow}>
            <span style={tableLabel}>{num}</span>
            <span>
              <span style={bold}>{name}</span>
              <span style={{ color: "rgba(0,0,0,0.4)" }}> — </span>
              {desc}
            </span>
          </div>
        ))}
      </div>

      <h2 style={h2}>How to Navigate</h2>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        <li style={li}>Click any <span style={bold}>folder</span> to open its info card with a live preview, description, and tech stack</li>
        <li style={li}>Experiments with live previews render interactive components directly in the modal</li>
        <li style={li}>Look for <span style={bold}>GitHub</span> links on code-based experiments to browse the source</li>
        <li style={li}>Some experiments have <span style={bold}>View Live</span> links to standalone pages</li>
      </ul>

      <h2 style={h2}>Stack</h2>
      <p style={p}>
        <span style={code}>React 19</span>{" "}
        <span style={code}>TypeScript</span>{" "}
        <span style={code}>Three.js</span>{" "}
        <span style={code}>React Three Fiber</span>{" "}
        <span style={code}>Framer Motion</span>{" "}
        <span style={code}>Rapier Physics</span>{" "}
        <span style={code}>Zustand</span>{" "}
        <span style={code}>Tailwind CSS</span>{" "}
        <span style={code}>Vite</span>
      </p>

      <h2 style={h2}>About</h2>
      <p style={p}>
        Built by <span style={bold}>Keith Scott</span> — Senior Product Designer (Harvard GSD) specializing in
        enterprise systems design. This portfolio is a working showcase of interaction design,
        3D development, motion, and front-end craft.
      </p>

      <div
        style={{
          marginTop: 28,
          paddingTop: 16,
          borderTop: "1px solid rgba(0,0,0,0.08)",
          fontSize: 11,
          color: "rgba(0,0,0,0.3)",
        }}
      >
        readme.md — last updated 2026
      </div>
    </div>
  )
}
