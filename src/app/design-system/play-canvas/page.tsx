import Link from "next/link";

export default function PlayCanvasPage() {
  return (
    <article>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-4">
        Molecules
      </p>
      <h1 className="font-sans text-[32px] font-bold tracking-tight text-foreground mb-4">
        Play Canvas
      </h1>
      <p className="font-sans text-[15px] leading-relaxed text-muted max-w-xl mb-12">
        The Play room is a full-viewport Three.js scene running the Hoop Dreams
        basketball game. It takes over the entire screen, hiding the site nav
        and rendering its own HUD with arcade-style controls.
      </p>

      <h2 className="font-sans text-[20px] font-bold text-foreground mb-4">
        Architecture
      </h2>
      <div className="flex flex-col gap-0 mb-12">
        {[
          {
            label: "Renderer",
            value: "React Three Fiber (WebGL)",
          },
          {
            label: "Physics",
            value: "@react-three/rapier (Rapier3D WASM)",
          },
          {
            label: "Scene model",
            value: "basketball.glb (4MB, loaded via useGLTF)",
          },
          {
            label: "Textures",
            value: "Procedural — canvas-generated basketball, brick walls",
          },
          {
            label: "Audio",
            value: "Web Audio API — synthesized rim hits, bounces, swish, crowd",
          },
          {
            label: "SSR",
            value: "Disabled — loaded via next/dynamic with ssr: false",
          },
        ].map((row) => (
          <div
            key={row.label}
            className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-3 border-b border-border"
          >
            <span className="font-sans text-[14px] font-medium text-foreground w-32 shrink-0">
              {row.label}
            </span>
            <span className="font-sans text-[13px] text-muted">{row.value}</span>
          </div>
        ))}
      </div>

      <h2 className="font-sans text-[20px] font-bold text-foreground mb-4">
        Game mechanics
      </h2>
      <ul className="flex flex-col gap-3 font-sans text-[15px] leading-relaxed text-muted mb-12">
        <li>
          <strong className="text-foreground">Select:</strong> Tap a ball on the
          ramp to pick it up (floats above the cluster)
        </li>
        <li>
          <strong className="text-foreground">Charge:</strong> Press and hold to
          charge the power meter
        </li>
        <li>
          <strong className="text-foreground">Release:</strong> Let go in the
          green zone for a perfect shot (3 pts vs 2 pts)
        </li>
        <li>
          <strong className="text-foreground">Streak:</strong> 3+ consecutive
          makes activates 2x multiplier
        </li>
        <li>
          <strong className="text-foreground">Timer:</strong> 30 seconds.
          Difficulty ramps in final 15s (perfect zone shrinks)
        </li>
      </ul>

      <Link
        href="/play"
        className="inline-block px-6 py-2.5 bg-foreground text-background font-mono text-[12px] uppercase tracking-[0.15em] rounded-lg hover:opacity-80 transition-opacity"
      >
        Launch Game
      </Link>
    </article>
  );
}
