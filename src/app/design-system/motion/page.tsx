export default function MotionPage() {
  return (
    <article>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-4">
        Foundations
      </p>
      <h1 className="font-sans text-[32px] font-bold tracking-tight text-foreground mb-4">
        Motion
      </h1>
      <p className="font-sans text-[15px] leading-relaxed text-muted max-w-xl mb-12">
        Motion is purposeful and restrained. Framer Motion handles all
        animations. Every animation has a clear trigger and a short duration.
      </p>

      <h2 className="font-sans text-[20px] font-bold text-foreground mb-6">
        Animation tokens
      </h2>

      <div className="flex flex-col gap-0 mb-12">
        {[
          {
            name: "Entrance",
            duration: "0.5s",
            ease: "easeOut",
            desc: "Page sections fade up on load",
            props: "opacity: 0→1, y: 12→0",
          },
          {
            name: "Stagger",
            duration: "0.08s delay",
            ease: "easeOut",
            desc: "List items appear sequentially",
            props: "staggerChildren: 0.08–0.12",
          },
          {
            name: "Hover underline",
            duration: "0.2s",
            ease: "easeOut",
            desc: "Nav links reveal underline",
            props: "scaleX: 0→1, origin-left",
          },
          {
            name: "Card lift",
            duration: "0.2s",
            ease: "default",
            desc: "Experiment cards rise on hover",
            props: "y: 0→-4",
          },
          {
            name: "Viewport reveal",
            duration: "0.5s",
            ease: "easeOut",
            desc: "Sections animate when scrolled into view",
            props: "whileInView, once: true",
          },
        ].map((anim) => (
          <div
            key={anim.name}
            className="flex flex-col sm:flex-row gap-1 sm:gap-6 py-4 border-b border-border"
          >
            <span className="font-sans text-[15px] font-medium text-foreground w-36 shrink-0">
              {anim.name}
            </span>
            <div className="flex-1 flex flex-col gap-1">
              <span className="font-sans text-[13px] text-muted">
                {anim.desc}
              </span>
              <span className="font-mono text-[11px] text-muted">
                {anim.duration} &middot; {anim.ease} &middot; {anim.props}
              </span>
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-sans text-[20px] font-bold text-foreground mb-4">
        Principles
      </h2>
      <ul className="flex flex-col gap-3 font-sans text-[15px] leading-relaxed text-muted">
        <li>
          <strong className="text-foreground">No animation for decoration.</strong>{" "}
          Every motion communicates state change, entrance, or interaction feedback.
        </li>
        <li>
          <strong className="text-foreground">Short durations.</strong> 200–500ms
          maximum. Users should never wait for an animation to finish.
        </li>
        <li>
          <strong className="text-foreground">easeOut for entrances.</strong>{" "}
          Elements decelerate into their final position, feeling natural.
        </li>
        <li>
          <strong className="text-foreground">Respect prefers-reduced-motion.</strong>{" "}
          All animations should be skippable for accessibility.
        </li>
      </ul>
    </article>
  );
}
