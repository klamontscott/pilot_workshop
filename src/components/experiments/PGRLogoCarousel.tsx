import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const APPLE_EASE = [0.25, 0.1, 0.25, 1] as const

const SLIDES = [
  {
    video: "/pgr-logo/01-overall.mp4",
    title: "01 — Overall Animation",
    description:
      "The complete Progressive logo animation with sound design. Used as an introduction to Progressive's internal motion language for animations and materials.",
  },
  {
    video: "/pgr-logo/02-movement-path.mp4",
    title: "02 — Movement Path",
    description:
      "Still the overall animation, but this breakdown shows the movement path. While it looks like there are multiple paths, I defined a single path and the code offsets it along the X axis for each letter — creating more consistency while saving a ton of time. Offset code: value + [-82.7, 0]",
  },
  {
    video: "/pgr-logo/03-no-scale.mp4",
    title: "03 — Movement Only (No Scale)",
    description:
      "Without scale, the animation is missing that three-dimensional feel. But this step ensures the path to the final destination is set correctly before layering on additional properties.",
  },
  {
    video: "/pgr-logo/04-with-scale.mp4",
    title: "04 — Movement + Scale",
    description:
      "Added scale to give the letters closer to the viewer a larger size, creating the illusion of depth. The letters scale down to their final position using an ease curve.",
  },
  {
    video: "/pgr-logo/05-motion-blur.mp4",
    title: "05 — Movement + Scale + Motion Blur",
    description:
      "Motion blur smooths out the animation and adds a stronger feeling of speed and movement. This is the finishing touch that makes the animation feel polished and cinematic. The easing curve starts fast and decelerates into a slower finish — this gives the viewer the perception that the movement is happening quicker than it actually is, because the eye registers the initial burst of speed before the settle.",
  },
  {
    video: "/pgr-logo/06-alt-bump.mp4",
    title: "06 — Alternate Bump Logo",
    description:
      "An alternate approach using a bump animation. This direction was explored but ultimately not selected for the final delivery.",
  },
  {
    video: "/pgr-logo/01-overall.mp4",
    title: "07 — Final with Sound Design",
    description:
      "The completed animation again — but pay attention to the sound effect. The audio ties everything together, giving the motion weight and punctuating the logo's arrival. Sound design is the invisible layer that makes animation feel real.",
    hasAudio: true,
  },
]

export default function PGRLogoCarousel() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fullscreenRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }, [current])

  const go = (next: number) => {
    setDirection(next > current ? 1 : -1)
    setCurrent(next)
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false)
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
      {/* Video area */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          background: "#1a1a1a",
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
            <video
              ref={videoRef}
              src={slide.video}
              autoPlay
              loop
              muted={!slide.hasAudio}
              playsInline
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Edge masks — slides dissolve into these */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 48,
            background: "linear-gradient(to right, #1a1a1a, transparent)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 48,
            background: "linear-gradient(to left, #1a1a1a, transparent)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

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
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 4,
              background: "rgba(0,0,0,0.5)",
              color: "#fff",
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
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 4,
              background: "rgba(0,0,0,0.5)",
              color: "#fff",
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
        {/* Fullscreen button */}
        <button
          onClick={() => setIsFullscreen(true)}
          style={{
            position: "absolute",
            right: 8,
            bottom: 8,
            width: 28,
            height: 28,
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 4,
            background: "rgba(0,0,0,0.5)",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3,
          }}
          title="View fullscreen"
        >
          <svg width={14} height={14} viewBox="0 0 16 16" fill="none">
            <path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
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
            height: 130,
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
      {/* Fullscreen overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            ref={fullscreenRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: APPLE_EASE }}
            onClick={() => setIsFullscreen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(0,0,0,0.92)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setIsFullscreen(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                fontSize: 18,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
            >
              &#10005;
            </button>

            {/* Fullscreen video + caption */}
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "90vw",
                maxWidth: 1200,
                background: "#fff",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              {/* Video area */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 9",
                }}
              >
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={`fs-${current}`}
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
                    <video
                      src={slide.video}
                      autoPlay
                      loop
                      muted={!slide.hasAudio}
                      playsInline
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Fullscreen nav arrows */}
                {current > 0 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); go(current - 1) }}
                    style={{
                      position: "absolute",
                      left: -48,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 36,
                      height: 36,
                      border: "1px solid rgba(255,255,255,0.25)",
                      borderRadius: 4,
                      background: "rgba(255,255,255,0.1)",
                      color: "#fff",
                      fontSize: 18,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    &#8249;
                  </button>
                )}
                {current < SLIDES.length - 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); go(current + 1) }}
                    style={{
                      position: "absolute",
                      right: -48,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 36,
                      height: 36,
                      border: "1px solid rgba(255,255,255,0.25)",
                      borderRadius: 4,
                      background: "rgba(255,255,255,0.1)",
                      color: "#fff",
                      fontSize: 18,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    &#8250;
                  </button>
                )}
              </div>

              {/* Caption */}
              <div
                style={{
                  height: 140,
                  padding: "16px 24px",
                  textAlign: "center",
                  overflow: "hidden",
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
                  {slide.title}
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.55, color: "rgba(0,0,0,0.6)" }}>
                  {slide.description}
                </div>
              </div>
            </div>

            {/* Fullscreen dots */}
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ display: "flex", gap: 6, marginTop: 16 }}
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
                    background: i === current ? "#e85d04" : "rgba(255,255,255,0.25)",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
