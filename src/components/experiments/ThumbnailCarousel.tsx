import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const APPLE_EASE = [0.25, 0.1, 0.25, 1] as const

const SLIDES = [
  {
    html: "/thumbnails/jumpstart.html",
    title: "01 — Jump Start",
    description:
      "Spheres scatter outward on hover, revealing icon-filled bubbles that represent onboarding touchpoints. Each dot transitions from a frosted glass sphere to its icon state with staggered easing — creating a sense of depth and discovery.",
  },
  {
    html: "/thumbnails/experiments.html",
    title: "02 — Experiments",
    description:
      "A canvas-based particle field that reacts to cursor movement. Particles are repelled by the mouse with spring physics pulling them back home. Each letter in the title cycles fonts on hover, and the dot on the 'i' has an easter egg — it taps the 'r' and triggers a font loop.",
  },
  {
    html: "/thumbnails/hablamos.html",
    title: "03 — Hablamos",
    description:
      "A hover-triggered word translator that strikes through each term with a chalk-textured wavy line and fades in its translation below. The words cycle automatically on hover — using a CSS class-based state machine with staggered timing for the strikethrough draw-on, translation reveal, and swap transitions.",
  },
]

export default function ThumbnailCarousel() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const go = (next: number) => {
    setDirection(next > current ? 1 : -1)
    setCurrent(next)
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && current > 0) go(current - 1)
      if (e.key === "ArrowRight" && current < SLIDES.length - 1) go(current + 1)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  })

  const slide = SLIDES[current]

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#eaeaea",
        overflow: "hidden",
      }}
    >
      {/* Interactive thumbnail area */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          background: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: APPLE_EASE }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <iframe
              ref={iframeRef}
              src={slide.html}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
              title={slide.title}
            />
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next arrows */}
        {current > 0 && (
          <button
            onClick={() => go(current - 1)}
            style={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              width: 32,
              height: 32,
              border: "1px solid rgba(0,0,0,0.15)",
              borderRadius: 4,
              background: "rgba(255,255,255,0.8)",
              color: "#333",
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 3,
            }}
          >
            &#8249;
          </button>
        )}
        {current < SLIDES.length - 1 && (
          <button
            onClick={() => go(current + 1)}
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              width: 32,
              height: 32,
              border: "1px solid rgba(0,0,0,0.15)",
              borderRadius: 4,
              background: "rgba(255,255,255,0.8)",
              color: "#333",
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 3,
            }}
          >
            &#8250;
          </button>
        )}
      </div>

      {/* Caption + dots */}
      <div
        style={{
          padding: "10px 16px 12px",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          background: "#eaeaea",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            height: 110,
          }}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: APPLE_EASE }}
              style={{ position: "absolute", left: 0, right: 0, top: 0 }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  marginBottom: 6,
                  letterSpacing: "0.02em",
                }}
              >
                {slide.title}
              </div>
              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: "rgba(0,0,0,0.7)",
                }}
              >
                {slide.description}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot navigation */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginTop: 10,
            justifyContent: "center",
          }}
        >
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              style={{
                width: i === current ? 18 : 7,
                height: 7,
                borderRadius: 4,
                border: "none",
                background:
                  i === current
                    ? "#e85d04"
                    : "rgba(0,0,0,0.15)",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
