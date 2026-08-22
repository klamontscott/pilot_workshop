import { useEffect, useRef, useState, useCallback, lazy, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"
import { useStore } from "../../lib/store"

const Basketball3DGameRapier = lazy(() => import("../Basketball3DGameRapier"))
const Typewriter = lazy(() => import("./Typewriter"))
const AccordionModule = lazy(() => import("./AccordionModule"))
const MetricsGrid = lazy(() => import("./MetricsGrid"))
const PGRLogoCarousel = lazy(() => import("./PGRLogoCarousel"))
const TranslatorHero = lazy(() => import("./TranslatorHero"))
const SiteReadme = lazy(() => import("./SiteReadme"))
const ThumbnailCarousel = lazy(() => import("./ThumbnailCarousel"))
const SupervisorVideo = lazy(() => import("./SupervisorVideo"))
const EcomapEmbed = lazy(() => import("./EcomapEmbed"))

// ── Types ──────────────────────────────────────────────────

type Breakpoint = "desktop" | "tablet" | "mobile"
type ContentType = "external" | "info" | "game"

interface Experiment {
  id: string
  label: string
  number: string
  contentType: ContentType
  description: string
  thumbnail?: string
  url?: string
  tags?: string[]
  category: string
  stack: string[]
  position: { x: number; y: number }
  previewComponent?: string
  github?: string
  isNew?: boolean
}

interface ExperimentsDesktopProps {
  bgColor?: string
  folderColor?: string
  accentColor?: string
  showTexture?: boolean
}

// ── Experiments Data ───────────────────────────────────────

const EXPERIMENTS: Experiment[] = [
  {
    id: "3d-room",
    label: "3D Portfolio Room",
    number: "001",
    contentType: "external",
    description: "An immersive 3D room built in Three.js showcasing portfolio work in a navigable space. Walk through a virtual studio and interact with project displays.",
    url: "https://portfolioroom-coral.vercel.app/",
    tags: ["3D", "Immersive", "WebGL", "AI"],
    category: "3D / Immersive",
    stack: ["Three.js", "React Three Fiber", "Drei", "Blender", "GLTF"],
    position: { x: 38, y: 22 },
    github: "https://github.com/klamontscott/pilot_workshop",
  },
  {
    id: "photo-gallery",
    label: "Photo Gallery",
    number: "002",
    contentType: "info",
    description: "A masonry-style photo gallery with category filtering, lightbox navigation, and a global like system powered by a cloud API. Features sports, street, product, and event photography.",
    tags: ["Photography", "UI", "API"],
    category: "UI / Photography",
    stack: ["React", "TypeScript", "Framer Motion", "Cloud API", "CSS Grid"],
    position: { x: 68, y: 12 },
    github: "https://github.com/klamontscott/pilot_workshop",
  },
  {
    id: "basketball-game",
    label: "Hoop Dreams",
    number: "003",
    contentType: "game",
    description: "A 3D basketball shooting game with physics-based ball mechanics, a shot power meter, streak multipliers, and a global leaderboard. Built with React Three Fiber and Rapier physics.",
    tags: ["Game", "3D", "Physics", "AI"],
    category: "Game / Interactive",
    stack: ["React Three Fiber", "Rapier Physics", "Drei", "Zustand", "TypeScript"],
    position: { x: 50, y: 48 },
    github: "https://github.com/klamontscott/pilot_workshop",
  },
  {
    id: "space-runner",
    label: "Space Runner",
    number: "004",
    contentType: "game",
    description: "A side-scrolling platformer built with vanilla JavaScript and HTML5 Canvas. Features custom sprite animation, collision detection, and level design.",
    tags: ["Game", "Platformer", "Canvas"],
    category: "Game / Canvas",
    stack: ["JavaScript", "HTML5 Canvas", "Sprite Animation", "2D Physics"],
    position: { x: 80, y: 38 },
    github: "https://github.com/klamontscott/pilot_workshop",
  },
  {
    id: "bookcase",
    label: "Bookcase",
    number: "005",
    contentType: "info",
    description: "An interactive 3D bookshelf component where visitors can browse and pull out books to learn about my reading list. Each spine is clickable and reveals details about the book.",
    tags: ["3D", "Interactive", "Component"],
    category: "3D / Component",
    stack: ["React", "CSS 3D Transforms", "Framer Motion", "TypeScript"],
    position: { x: 30, y: 65 },
    github: "https://github.com/klamontscott/pilot_workshop",
  },
  {
    id: "translator-hero",
    label: "Audio-Reactive Translator",
    number: "006",
    contentType: "info",
    description: "A bilingual translation hero with a reactive particle sphere that responds to audio playback and cursor movement. Supports English-Spanish word translation with variable playback speed.",
    url: "https://www.keithscottii.com/hablamos",
    tags: ["Audio", "Bilingual", "3D", "AI"],
    category: "3D / Audio",
    stack: ["Three.js", "React Three Fiber", "Web Audio API", "GLSL Shaders", "TypeScript"],
    position: { x: 62, y: 62 },
    github: "https://github.com/klamontscott/pilot_workshop",
  },
  {
    id: "metrics-grid",
    label: "Animated Grid Banner",
    number: "007",
    contentType: "info",
    description: "An animated metrics banner with canvas-drawn grid tracers that race across rows, highlighting key portfolio stats. Features responsive layout and color-coded motion trails.",
    tags: ["Animation", "Data Viz", "Canvas"],
    category: "Component / Data Viz",
    stack: ["React", "HTML5 Canvas", "RequestAnimationFrame", "TypeScript"],
    position: { x: 82, y: 72 },
    previewComponent: "metrics-grid",
    github: "https://github.com/klamontscott/pilot_workshop",
  },
  {
    id: "typewriter",
    label: "Typewriter",
    number: "008",
    contentType: "info",
    description: "A looping typewriter animation that cycles through problem-statement words with realistic typing and deleting cadence. Features a blinking cursor and variable timing for a natural feel.",
    tags: ["Animation", "Text", "Micro-interaction"],
    category: "Component / Animation",
    stack: ["React", "TypeScript", "CSS Transitions", "setTimeout"],
    position: { x: 15, y: 42 },
    previewComponent: "typewriter",
    github: "https://github.com/klamontscott/pilot_workshop",
  },
  {
    id: "accordion-module",
    label: "Dynamic Carousel",
    number: "009",
    contentType: "info",
    description: "An interactive before/after carousel with spring-animated pill buttons, image sequences with peel-off transitions, and chevron navigation. Built for the Jump Start onboarding case study.",
    tags: ["Interactive", "Animation", "Case Study", "AI"],
    category: "Component / Interactive",
    stack: ["React", "Framer Motion", "Spring Physics", "TypeScript"],
    position: { x: 20, y: 78 },
    previewComponent: "accordion-module",
    github: "https://github.com/klamontscott/pilot_workshop",
  },
  {
    id: "pgr-logo-animation",
    label: "PGR Logo Animation",
    number: "010",
    contentType: "info",
    description: "A step-by-step breakdown of the Progressive logo animation built in After Effects. Walk through each layer — movement paths, scale, motion blur, and sound design — to see how a polished logo reveal comes together.",
    tags: ["Motion Design", "Tutorial", "After Effects"],
    category: "Motion / Tutorial",
    stack: ["After Effects", "Illustrator"],
    position: { x: 50, y: 85 },
    previewComponent: "pgr-logo-carousel",
  },
  {
    id: "interactive-thumbnails",
    label: "Interactive Thumbnails",
    number: "011",
    contentType: "info",
    description: "Three interactive portfolio thumbnails — each with a unique hover interaction. Hablamos plays a video reveal, Jump Start scatters spheres into icon bubbles, and Experiments drives a particle field with cursor physics and font-cycling easter eggs.",
    tags: ["UI", "Motion Design", "Interactive", "AI"],
    category: "Component / Interactive",
    stack: ["HTML", "CSS", "Canvas", "JavaScript"],
    position: { x: 72, y: 82 },
    previewComponent: "thumbnail-carousel",
  },
  {
    id: "supervisor-video",
    label: "Progressive Animation",
    number: "012",
    contentType: "info",
    description: "A 3:30 motion design video created to socialize the Supervisor Experience Principles across a large organization. Character illustrations built in Illustrator, transferred to After Effects via Overlord, then composed with kinetic typography and sound design into a narrative video.",
    tags: ["Motion Design", "Video", "Organizational Design"],
    category: "Motion / Video",
    stack: ["After Effects", "Illustrator", "Overlord", "Code"],
    position: { x: 42, y: 38 },
    previewComponent: "supervisor-video",
    isNew: true,
  },
  {
    id: "ecomap",
    label: "Challenging Caller Ecomap",
    number: "013",
    contentType: "info",
    description: "An interactive ecomap visualizing the organizational response to challenging callers. Click through a 9-step progressive reveal showing how roles, escalation paths, and support systems connect across the organization. Built in Figma with interactive prototype wiring.",
    tags: ["Information Design", "Figma", "Interactive", "AI"],
    category: "Information Design / Interactive",
    stack: ["Figma", "Prototyping", "Information Architecture"],
    position: { x: 25, y: 55 },
    previewComponent: "ecomap-embed",
    isNew: true,
  },
]

// ── Folder SVG ─────────────────────────────────────────────

function FolderSVG({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Back panel */}
      <path
        d="M6 16C6 13.79 7.79 12 10 12H24L30 18H54C56.21 18 58 19.79 58 22V50C58 52.21 56.21 54 54 54H10C7.79 54 6 52.21 6 50V16Z"
        fill="#888"
        opacity={0.5}
      />
      {/* Front panel */}
      <path
        d="M6 24C6 22.34 7.34 21 9 21H55C56.66 21 58 22.34 58 24V50C58 52.21 56.21 54 54 54H10C7.79 54 6 52.21 6 50V24Z"
        fill="#aaa"
      />
      {/* Shine */}
      <path
        d="M6 24C6 22.34 7.34 21 9 21H55C56.66 21 58 22.34 58 24V28H6V24Z"
        fill="rgba(255,255,255,0.12)"
      />
    </svg>
  )
}

// ── Background Image Texture ─────────────────────────────

const BG_IMAGE_URL = "/textures/experiments-bg.png"

// ── Marquee Ticker ─────────────────────────────────────────

// ── Route Overlay (background cycling route) ───────────────

function RouteOverlay({ onClick, isAnimating }: { onClick: () => void; isAnimating: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)
  const pathRef = useRef<SVGPathElement | null>(null)
  const dotRef = useRef<SVGCircleElement | null>(null)
  const glowRef = useRef<SVGCircleElement | null>(null)
  const trailRef = useRef<SVGPathElement | null>(null)
  const startTimeRef = useRef<number>(0)
  const onClickRef = useRef(onClick)
  onClickRef.current = onClick

  useEffect(() => {
    const wrapper = wrapperRef.current
    const container = containerRef.current
    if (!wrapper || !container) return

    const updateSize = () => {
      const parentW = wrapper.parentElement?.clientWidth || wrapper.clientWidth
      const parentH = wrapper.parentElement?.clientHeight || wrapper.clientHeight
      const imgRatio = 8000 / 4500
      const parentRatio = parentW / parentH

      let renderedW: number, renderedH: number, offsetX: number, offsetY: number
      if (parentRatio > imgRatio) {
        renderedW = parentW
        renderedH = parentW / imgRatio
        offsetX = 0
        offsetY = (parentH - renderedH) / 2
      } else {
        renderedH = parentH
        renderedW = parentH * imgRatio
        offsetX = (parentW - renderedW) / 2
        offsetY = 0
      }

      const routeLeft = 0.005
      const routeTop = 0.032
      const routeWidth = 0.315 * 1.005
      const routeHeight = 0.317

      container.style.left = `${offsetX + renderedW * routeLeft + 34}px`
      container.style.top = `${offsetY + renderedH * routeTop + 8}px`
      container.style.width = `${renderedW * routeWidth}px`
      container.style.height = `${renderedH * routeHeight}px`
    }

    updateSize()
    const ro = new ResizeObserver(updateSize)
    ro.observe(wrapper.parentElement || wrapper)
    return () => ro.disconnect()
  }, [])

  // Load SVG once
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    fetch("/cycling/levi-grandfondo.svg")
      .then((r) => r.text())
      .then((svgText) => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(svgText, "image/svg+xml")
        const svg = doc.querySelector("svg")
        if (!svg) return

        svg.style.width = "100%"
        svg.style.height = "100%"
        svg.style.overflow = "visible"
        svg.setAttribute("preserveAspectRatio", "none")

        const styleEl = svg.querySelector("style")
        if (styleEl) styleEl.remove()

        const path = svg.querySelector("path")
        if (path) {
          // Transparent fill so clicks register inside the route shape
          path.style.fill = "rgba(232,93,4,0)"
          path.style.stroke = "rgba(232,93,4,0)"
          path.style.strokeWidth = "8"
          path.setAttribute("fill", "rgba(232,93,4,0)")
          path.setAttribute("stroke", "rgba(232,93,4,0)")
          path.setAttribute("stroke-width", "8")
          path.style.cursor = "pointer"
          path.style.transition = "fill 0.6s ease, stroke 0.6s ease, filter 0.6s ease"
          path.style.filter = "none"
          path.setAttribute("pointer-events", "all")

          // Click handler on the path itself
          path.addEventListener("click", () => onClickRef.current())

          // Hover effect — soft diffused glow on the route
          path.addEventListener("mouseenter", () => {
            path.style.fill = "rgba(232,93,4,0.03)"
            path.style.stroke = "rgba(232,93,4,0.15)"
            path.style.filter = "drop-shadow(0 0 12px rgba(232,93,4,0.2)) drop-shadow(0 0 30px rgba(232,93,4,0.08))"
          })
          path.addEventListener("mouseleave", () => {
            path.style.fill = "rgba(232,93,4,0)"
            path.style.stroke = "rgba(232,93,4,0)"
            path.style.filter = "none"
          })
        }

        const ns = "http://www.w3.org/2000/svg"

        // Trail that draws on behind the dot (trim path)
        const trail = document.createElementNS(ns, "path")
        trail.setAttribute("d", path?.getAttribute("d") || "")
        trail.setAttribute("fill", "none")
        trail.setAttribute("stroke", "#e85d04")
        trail.setAttribute("stroke-width", "4")
        trail.setAttribute("stroke-linecap", "round")
        trail.setAttribute("opacity", "0.45")
        trail.setAttribute("stroke-dasharray", "0 999999")
        trail.setAttribute("pointer-events", "none")
        svg.appendChild(trail)

        const glow = document.createElementNS(ns, "circle")
        glow.setAttribute("r", "18")
        glow.setAttribute("fill", "none")
        glow.setAttribute("stroke", "#e85d04")
        glow.setAttribute("stroke-width", "2")
        glow.setAttribute("opacity", "0.3")
        glow.setAttribute("pointer-events", "none")
        svg.appendChild(glow)

        const dot = document.createElementNS(ns, "circle")
        dot.setAttribute("r", "12")
        dot.setAttribute("fill", "#e85d04")
        dot.setAttribute("filter", "drop-shadow(0 0 8px #e85d04) drop-shadow(0 0 16px rgba(232,93,4,0.4))")
        dot.setAttribute("pointer-events", "none")
        svg.appendChild(dot)

        container.innerHTML = ""
        container.appendChild(svg)

        pathRef.current = path
        dotRef.current = dot
        glowRef.current = glow
        trailRef.current = trail

        // Place dot at start position (static)
        if (path) {
          const startPoint = path.getPointAtLength(0)
          dot.setAttribute("cx", String(startPoint.x))
          dot.setAttribute("cy", String(startPoint.y))
          glow.setAttribute("cx", String(startPoint.x))
          glow.setAttribute("cy", String(startPoint.y))
        }
      })

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  // Start/stop animation based on isAnimating
  useEffect(() => {
    const path = pathRef.current
    const dot = dotRef.current
    const glow = glowRef.current
    const trail = trailRef.current
    if (!path || !dot || !glow) return

    if (isAnimating) {
      const totalLength = path.getTotalLength()
      const halfLength = totalLength / 2 // Path is a filled shape; half = one edge of the route
      const duration = 20000
      startTimeRef.current = 0

      const animate = (now: number) => {
        if (!startTimeRef.current) startTimeRef.current = now
        const elapsed = now - startTimeRef.current
        const progress = (elapsed % duration) / duration
        // Traverse one edge of the route shape (reversed for clockwise)
        const point = path.getPointAtLength(halfLength - progress * halfLength)
        dot.setAttribute("cx", String(point.x))
        dot.setAttribute("cy", String(point.y))
        glow.setAttribute("cx", String(point.x))
        glow.setAttribute("cy", String(point.y))

        const pulse = 0.2 + Math.sin(now / 400) * 0.15
        glow.setAttribute("opacity", String(pulse))

        // Trim path: draw trail behind the dot
        if (trail) {
          trail.setAttribute("stroke-dashoffset", String(-(halfLength * (1 - progress))))
          trail.setAttribute("stroke-dasharray", `${halfLength * progress} ${totalLength}`)
        }

        animRef.current = requestAnimationFrame(animate)
      }
      animRef.current = requestAnimationFrame(animate)
    } else {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      // Reset trail
      if (trail) trail.setAttribute("stroke-dasharray", "0 999999")
      // Reset dot to start position
      const startPoint = path.getPointAtLength(0)
      dot.setAttribute("cx", String(startPoint.x))
      dot.setAttribute("cy", String(startPoint.y))
      glow.setAttribute("cx", String(startPoint.x))
      glow.setAttribute("cy", String(startPoint.y))
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [isAnimating])

  return (
    <div
      ref={wrapperRef}
      style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none" }}
    >
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          pointerEvents: "none",
          overflow: "visible",
        }}
      />
    </div>
  )
}

// ── Elevation profile data (sampled from Levi Grand Fondo) ──

const ELEVATION_POINTS = [
  0,0,0,5,10,15,10,5,0,0,0,0,5,10,15,20,30,50,80,120,180,250,350,500,700,
  900,1100,1300,1200,1050,900,1100,1350,1400,1200,1000,850,700,500,350,200,
  150,100,80,60,50,40,30,25,20,30,50,80,120,200,350,550,800,1050,1300,1500,
  1700,1850,1800,1700,1850,1750,1500,1200,900,600,400,300,250,200,150,120,
  100,150,250,350,300,200,150,100,80,60,50,40,30,50,60,50,30,20,10,5,0
]

// ── Cycling Lightbox ────────────────────────────────────────

function CyclingLightbox({ onClose, isMobile }: { onClose: () => void; isMobile: boolean }) {
  const svgContainerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement | null>(null)
  const dotRef = useRef<SVGCircleElement | null>(null)
  const trailRef = useRef<SVGPathElement | null>(null)
  const mileRef = useRef<HTMLSpanElement>(null)
  const elevMarkerRef = useRef<HTMLDivElement>(null)
  const elevContainerRef = useRef<HTMLDivElement>(null)
  const [animationDone, setAnimationDone] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [svgLoaded, setSvgLoaded] = useState(false)
  const animFrameRef = useRef<number>(0)

  // Load SVG (don't start animation)
  useEffect(() => {
    const container = svgContainerRef.current
    if (!container) return

    fetch("/cycling/levi-grandfondo.svg")
      .then((r) => r.text())
      .then((svgText) => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(svgText, "image/svg+xml")
        const svg = doc.querySelector("svg")
        if (!svg) return

        svg.style.width = "100%"
        svg.style.height = "100%"

        const path = svg.querySelector("path")
        if (path) {
          path.setAttribute("fill", "none")
          path.setAttribute("stroke", "rgba(0,0,0,0.2)")
          path.setAttribute("stroke-width", "3")
          pathRef.current = path
        }

        const ns = "http://www.w3.org/2000/svg"

        const trail = document.createElementNS(ns, "path")
        trail.setAttribute("fill", "none")
        trail.setAttribute("stroke", "#e85d04")
        trail.setAttribute("stroke-width", "2.5")
        trail.setAttribute("stroke-linecap", "round")
        trail.setAttribute("opacity", "0.7")
        trail.setAttribute("stroke-dasharray", "0 999999")
        svg.appendChild(trail)
        trailRef.current = trail

        const dot = document.createElementNS(ns, "circle")
        dot.setAttribute("r", "20")
        dot.setAttribute("fill", "#e85d04")
        dot.setAttribute("filter", "drop-shadow(0 0 8px #e85d04) drop-shadow(0 0 16px rgba(232,93,4,0.4))")
        dot.setAttribute("opacity", "0")
        svg.appendChild(dot)
        dotRef.current = dot

        container.innerHTML = ""
        container.appendChild(svg)
        setSvgLoaded(true)
      })

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  // Start animation when play is pressed
  useEffect(() => {
    if (!isPlaying || !pathRef.current || !dotRef.current) return

    const dot = dotRef.current
    const trail = trailRef.current
    const path = pathRef.current
    const totalLength = path.getTotalLength()
    const halfLength = totalLength / 2 // Path is a filled shape; half = one edge of the route
    const duration = 12000
    const startTime = performance.now()

    dot.setAttribute("opacity", "1")

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      const point = path.getPointAtLength(halfLength - eased * halfLength)
      dot.setAttribute("cx", String(point.x))
      dot.setAttribute("cy", String(point.y))

      if (trail) {
        trail.setAttribute("d", path.getAttribute("d") || "")
        trail.setAttribute("stroke-dashoffset", String(halfLength - eased * halfLength))
        trail.setAttribute("stroke-dasharray", `${eased * halfLength} ${totalLength}`)
      }

      if (mileRef.current) {
        mileRef.current.textContent = (eased * 119.5).toFixed(1)
      }

      // Move elevation marker in sync
      if (elevMarkerRef.current && elevContainerRef.current) {
        const containerWidth = elevContainerRef.current.clientWidth
        const markerX = eased * containerWidth
        elevMarkerRef.current.style.left = `${markerX}px`
        elevMarkerRef.current.style.opacity = "1"
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate)
      } else {
        setAnimationDone(true)
        setIsPlaying(false)
      }
    }
    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isPlaying])

  const statLabelStyle: React.CSSProperties = {
    fontSize: 11,
    color: "rgba(0,0,0,0.45)",
    fontWeight: 400,
    letterSpacing: "0.03em",
  }
  const statValueStyle: React.CSSProperties = {
    fontSize: 28,
    fontWeight: 900,
    color: "#1a1a1a",
    letterSpacing: -1,
    lineHeight: 1,
  }
  const statUnitStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 400,
    color: "rgba(0,0,0,0.45)",
    marginLeft: 2,
  }
  const detailLabelStyle: React.CSSProperties = {
    fontSize: 11,
    color: "rgba(0,0,0,0.45)",
    minWidth: 90,
  }
  const detailValueStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    color: "#1a1a1a",
    minWidth: 70,
  }

  // Draw elevation profile
  const elevCanvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = elevCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    const maxElev = Math.max(...ELEVATION_POINTS)
    const padding = { top: 10, bottom: 20, left: 0, right: 0 }
    const plotW = w - padding.left - padding.right
    const plotH = h - padding.top - padding.bottom

    // Fill area
    ctx.beginPath()
    ctx.moveTo(padding.left, h - padding.bottom)
    ELEVATION_POINTS.forEach((elev, i) => {
      const x = padding.left + (i / (ELEVATION_POINTS.length - 1)) * plotW
      const y = padding.top + plotH - (elev / maxElev) * plotH
      if (i === 0) ctx.lineTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.lineTo(padding.left + plotW, h - padding.bottom)
    ctx.closePath()

    const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom)
    gradient.addColorStop(0, "rgba(232, 93, 4, 0.3)")
    gradient.addColorStop(1, "rgba(232, 93, 4, 0.02)")
    ctx.fillStyle = gradient
    ctx.fill()

    // Stroke line
    ctx.beginPath()
    ELEVATION_POINTS.forEach((elev, i) => {
      const x = padding.left + (i / (ELEVATION_POINTS.length - 1)) * plotW
      const y = padding.top + plotH - (elev / maxElev) * plotH
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.strokeStyle = "#e85d04"
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Mile labels
    ctx.fillStyle = "rgba(0,0,0,0.35)"
    ctx.font = "9px Inter, system-ui, sans-serif"
    ctx.textAlign = "center"
    const mileLabels = [0, 20, 40, 60, 80, 100, 119]
    mileLabels.forEach((mi) => {
      const x = padding.left + (mi / 119) * plotW
      ctx.fillText(`${mi}mi`, x, h - 4)
    })
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? 8 : 24,
        cursor: "pointer",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 30, stiffness: 350 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 900,
          maxHeight: "90vh",
          background: "#f5f5f5",
          borderRadius: 2,
          border: "1px solid rgba(0,0,0,0.15)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          cursor: "default",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 10px",
            height: 28,
            background: "linear-gradient(to bottom, #eee, #d8d8d8)",
            borderBottom: "1px solid rgba(0,0,0,0.12)",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", letterSpacing: "0.02em", fontFamily: "'Inter', system-ui, sans-serif" }}>
            Levi Grand Fondo — Longest Ride
          </span>
          <button
            onClick={onClose}
            style={{
              width: 16, height: 16, borderRadius: 0,
              border: "1px solid rgba(0,0,0,0.2)",
              background: "rgba(0,0,0,0.06)",
              color: "rgba(0,0,0,0.5)",
              fontSize: 10, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 0, lineHeight: 1, outline: "none",
            }}
          >
            &#x2715;
          </button>
        </div>
        <div style={{ height: 6, background: "repeating-linear-gradient(to bottom, #e0e0e0 0px, #e0e0e0 1px, #d4d4d4 1px, #d4d4d4 2px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }} />

        {/* Scrollable content */}
        <div style={{ overflow: "auto", flex: 1, padding: isMobile ? 16 : 24, fontFamily: "'Inter', system-ui, sans-serif" }}>

          {/* Route SVG + mile counter + play button */}
          <div style={{ position: "relative", marginBottom: 24 }}>
            <div ref={svgContainerRef} style={{ width: "100%", height: isMobile ? 180 : 260, background: "rgba(0,0,0,0.03)", borderRadius: 4, border: "1px solid rgba(0,0,0,0.08)" }} />
            <div style={{
              position: "absolute", bottom: 12, left: 12,
              background: "rgba(255,255,255,0.85)", padding: "6px 12px", borderRadius: 4,
              display: "flex", alignItems: "baseline", gap: 4,
            }}>
              <span ref={mileRef} style={{ fontSize: 24, fontWeight: 900, color: "#e85d04" }}>0.0</span>
              <span style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>mi</span>
            </div>
            {/* Play button */}
            {svgLoaded && !isPlaying && (
              <button
                onClick={() => {
                  setAnimationDone(false)
                  setIsPlaying(true)
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  border: "2px solid rgba(232,93,4,0.6)",
                  background: "rgba(232,93,4,0.15)",
                  backdropFilter: "blur(8px)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.2s, border-color 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(232,93,4,0.3)"
                  e.currentTarget.style.borderColor = "rgba(232,93,4,0.8)"
                  e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.08)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(232,93,4,0.15)"
                  e.currentTarget.style.borderColor = "rgba(232,93,4,0.6)"
                  e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)"
                }}
              >
                <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
                  <path d="M2 2L18 12L2 22V2Z" fill="#e85d04" />
                </svg>
              </button>
            )}
          </div>

          {/* Primary stats row */}
          <div style={{ display: "flex", gap: isMobile ? 16 : 32, marginBottom: 20, flexWrap: "wrap" }}>
            <div>
              <div style={statValueStyle}>119.50<span style={statUnitStyle}>mi</span></div>
              <div style={statLabelStyle}>Distance</div>
            </div>
            <div>
              <div style={statValueStyle}>7:49:28</div>
              <div style={statLabelStyle}>Moving Time</div>
            </div>
            <div>
              <div style={statValueStyle}>9,163<span style={statUnitStyle}>ft</span></div>
              <div style={statLabelStyle}>Elevation</div>
            </div>
          </div>

          {/* Secondary stats row */}
          <div style={{
            display: "flex", gap: isMobile ? 16 : 24, marginBottom: 24, flexWrap: "wrap",
            padding: "12px 16px", background: "rgba(0,0,0,0.03)", borderRadius: 4,
            border: "1px solid rgba(0,0,0,0.08)",
          }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a" }}>233<span style={{ ...statUnitStyle, fontSize: 11 }}>W</span></div>
              <div style={statLabelStyle}>Avg Power</div>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a" }}>5,941<span style={{ ...statUnitStyle, fontSize: 11 }}>kJ</span></div>
              <div style={statLabelStyle}>Total Work</div>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a" }}>699</div>
              <div style={statLabelStyle}>Training Load</div>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a" }}>93<span style={{ ...statUnitStyle, fontSize: 11 }}>%</span></div>
              <div style={statLabelStyle}>Intensity</div>
            </div>
          </div>

          {/* Elevation profile with synced marker */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ fontSize: 10, color: "rgba(0,0,0,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Elevation Profile</div>
            </div>
            <div ref={elevContainerRef} style={{ position: "relative" }}>
              <canvas ref={elevCanvasRef} style={{ width: "100%", height: 80, display: "block" }} />
              {/* Synced elevation marker */}
              <div
                ref={elevMarkerRef}
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 20,
                  width: 2,
                  background: "#e85d04",
                  opacity: 0,
                  pointerEvents: "none",
                  boxShadow: "0 0 6px rgba(232,93,4,0.5)",
                  transition: "opacity 0.3s",
                }}
              />
            </div>
          </div>

          {/* Detail stats table */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 12,
            marginBottom: 24,
            padding: "16px",
            background: "rgba(0,0,0,0.03)",
            borderRadius: 4,
            border: "1px solid rgba(0,0,0,0.06)",
          }}>
            {/* Left column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={detailLabelStyle}>Speed (Avg)</span>
                <span style={detailValueStyle}>15.3 mi/h</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={detailLabelStyle}>Speed (Max)</span>
                <span style={detailValueStyle}>42.9 mi/h</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={detailLabelStyle}>Cadence (Avg)</span>
                <span style={detailValueStyle}>69 rpm</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={detailLabelStyle}>Cadence (Max)</span>
                <span style={detailValueStyle}>109 rpm</span>
              </div>
            </div>
            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={detailLabelStyle}>Power (Avg)</span>
                <span style={detailValueStyle}>213 W</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={detailLabelStyle}>Power (Max)</span>
                <span style={detailValueStyle}>659 W</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={detailLabelStyle}>Calories</span>
                <span style={detailValueStyle}>5,941</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={detailLabelStyle}>Elapsed Time</span>
                <span style={detailValueStyle}>8:24:52</span>
              </div>
            </div>
          </div>

          {/* Weather + Equipment */}
          <div style={{
            display: "flex",
            gap: isMobile ? 16 : 32,
            flexWrap: "wrap",
            padding: "12px 16px",
            background: "rgba(0,0,0,0.03)",
            borderRadius: 4,
            border: "1px solid rgba(0,0,0,0.06)",
          }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ fontSize: 10, color: "rgba(0,0,0,0.35)", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>Weather</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={detailLabelStyle}>Conditions</span>
                  <span style={detailValueStyle}>Foggy</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={detailLabelStyle}>Temperature</span>
                  <span style={detailValueStyle}>48 °F</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={detailLabelStyle}>Feels Like</span>
                  <span style={detailValueStyle}>51 °F</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={detailLabelStyle}>Humidity</span>
                  <span style={detailValueStyle}>94%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={detailLabelStyle}>Wind</span>
                  <span style={detailValueStyle}>2.0 mi/h SSE</span>
                </div>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ fontSize: 10, color: "rgba(0,0,0,0.35)", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>Equipment</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={detailLabelStyle}>Computer</span>
                  <span style={detailValueStyle}>Wahoo ELEMNT ROAM</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={detailLabelStyle}>Bike</span>
                  <span style={detailValueStyle}>Canyon Ultimate SL8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Component ──────────────────────────────────────────────

export default function ExperimentsDesktop({
  bgColor = "#2e2e2e",
  folderColor = "#5AB4F0",
  accentColor = "#bd5931",
  showTexture = true,
}: ExperimentsDesktopProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop")
  const [activeExperiment, setActiveExperiment] = useState<Experiment | null>(null)
  const [zStack, setZStack] = useState<Record<string, number>>({})
  const zCounterRef = useRef(1)
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)
  const [iframeGame, setIframeGame] = useState<string | null>(null)
  const [showCycling, setShowCycling] = useState(false)
  const [showReadme, setShowReadme] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [sortMode, setSortMode] = useState<"none" | "name" | "number" | "category">("none")
  const [translatorFs, setTranslatorFs] = useState(false)
  const [shutdownActive, setShutdownActive] = useState(false)
  const [shutdownPhase, setShutdownPhase] = useState(0) // 0=idle, 1=dim, 2=squeeze, 3=dot, 4=gone
  const { setShowBasketballGame, setShowPhotoGallery } = useStore()

  // ── Breakpoint observer ────────────────────────────────

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      setBreakpoint(w >= 1024 ? "desktop" : w >= 640 ? "tablet" : "mobile")
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // ── Escape key ─────────────────────────────────────────

  useEffect(() => {
    if (!activeExperiment && !iframeGame && !showCycling) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (iframeGame) setIframeGame(null)
        else if (showCycling) setShowCycling(false)
        else setActiveExperiment(null)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [activeExperiment, iframeGame, showCycling])

  // ── Sound Effects ──────────────────────────────────────

  const playClick = useCallback((soft?: boolean) => {
    try {
      const audio = new Audio("/audio/click.mp3")
      audio.volume = soft ? 0.15 : 0.4
      audio.playbackRate = soft ? 1.4 : 1.2
      audio.play().catch(() => {})
    } catch {}
  }, [])

  const playMenuClick = useCallback(() => playClick(), [playClick])
  const playSubClick = useCallback(() => playClick(true), [playClick])
  const playFolderOpen = useCallback(() => {}, [])

  // ── Handlers ───────────────────────────────────────────

  const triggerShutdown = useCallback(() => {
    setActiveMenu(null)
    setShutdownActive(true)
    setShutdownPhase(1) // dim
    setTimeout(() => setShutdownPhase(2), 600)   // squeeze to horizontal line
    setTimeout(() => setShutdownPhase(3), 1400)  // shrink to dot
    setTimeout(() => setShutdownPhase(4), 2000)  // gone — powered off screen
  }, [])

  const handleFolderClick = useCallback((exp: Experiment) => {
    playFolderOpen()
    if (exp.id === "levi-grandfondo") {
      setShowCycling(true)
    } else if (exp.id === "photo-gallery") {
      setShowPhotoGallery(true)
    } else {
      setActiveExperiment(exp)
    }
  }, [playFolderOpen])

  const bringToFront = useCallback((id: string) => {
    const z = ++zCounterRef.current
    setZStack((prev) => ({ ...prev, [id]: z }))
  }, [])

  // ── Derived ────────────────────────────────────────────

  const isDesktop = breakpoint === "desktop"
  const isTablet = breakpoint === "tablet"
  const isMobile = breakpoint === "mobile"
  const folderSize = isDesktop ? 64 : isTablet ? 56 : 48
  const gridCols = isTablet ? 3 : 2

  const matchesFilter = useCallback((exp: Experiment) => {
    if (!activeFilter) return true
    if (activeFilter === "arcade") return exp.contentType === "game"
    if (activeFilter === "components") return exp.category.startsWith("Component")
    if (activeFilter === "3d") return (exp.tags || []).includes("3D") || exp.category.startsWith("3D")
    if (activeFilter === "motion") return exp.category.startsWith("Motion") || (exp.tags || []).includes("Motion Design")
    if (activeFilter === "ai") return (exp.tags || []).includes("AI")
    return true
  }, [activeFilter])

  // ── Sorted positions ──────────────────────────────────
  const sortedExperiments = sortMode === "none"
    ? EXPERIMENTS
    : [...EXPERIMENTS].sort((a, b) => {
        if (sortMode === "name") return a.label.localeCompare(b.label)
        if (sortMode === "number") return a.number.localeCompare(b.number)
        if (sortMode === "category") return a.category.localeCompare(b.category) || a.number.localeCompare(b.number)
        return 0
      })

  const getGridPosition = useCallback((exp: Experiment) => {
    if (sortMode === "none") return { x: exp.position.x, y: exp.position.y }
    const idx = sortedExperiments.findIndex(e => e.id === exp.id)
    const cols = 4
    const col = idx % cols
    const row = Math.floor(idx / cols)
    return {
      x: 45 + col * 15,
      y: 8 + row * 28,
    }
  }, [sortMode, sortedExperiments])

  // ── Render ─────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 500,
        background: bgColor,
        overflow: "hidden",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Background texture image */}
      {showTexture && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${BG_IMAGE_URL})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              pointerEvents: "none",
              zIndex: 0,
              opacity: 0.6,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.25)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        </>
      )}

      {/* Route overlay (cycling route on background) */}
      <RouteOverlay onClick={() => setShowCycling(true)} isAnimating={showCycling} />

      {/* Finder menu bar */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: 30,
          background: "linear-gradient(to bottom, #eee, #c8c8c8)",
          borderBottom: "1px solid #999",
          display: "flex",
          alignItems: "center",
          padding: "0 10px",
          gap: 18,
          fontFamily: "'Chicago', 'Geneva', 'Charcoal', system-ui, sans-serif",
          flexShrink: 0,
          boxShadow: "0 1px 0 rgba(255,255,255,0.5) inset",
        }}
        onClick={() => setActiveMenu(null)}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: "#000" }}>
          KS
        </span>

        {/* File menu with dropdown */}
        <span
          style={{ position: "relative" }}
          onClick={(e) => { e.stopPropagation(); playMenuClick(); setActiveMenu(activeMenu === "file" ? null : "file") }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "#000",
              cursor: "default",
              padding: "2px 6px",
              borderRadius: 2,
              background: activeMenu === "file" ? "#3068d4" : "transparent",
              ...(activeMenu === "file" ? { color: "#fff" } : {}),
            }}
          >
            File
          </span>
          {activeMenu === "file" && (
            <div
              style={{
                position: "absolute",
                top: 18,
                left: 0,
                minWidth: 180,
                background: "#f5f5f5",
                border: "1px solid #999",
                borderRadius: 4,
                boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                padding: "4px 0",
                zIndex: 100,
              }}
            >
              <div
                onClick={() => { playSubClick(); setShowReadme(true); setActiveMenu(null) }}
                style={{
                  padding: "4px 16px",
                  fontSize: 12,
                  color: "#000",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#3068d4"
                  e.currentTarget.style.color = "#fff"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color = "#000"
                }}
              >
                About This Portfolio (readme.md)
              </div>
              <div style={{ height: 1, background: "rgba(0,0,0,0.1)", margin: "4px 0" }} />
              <div
                onClick={() => { playSubClick(); triggerShutdown() }}
                style={{
                  padding: "4px 16px",
                  fontSize: 12,
                  color: "#000",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#3068d4"
                  e.currentTarget.style.color = "#fff"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color = "#000"
                }}
              >
                Shut Down…
              </div>
            </div>
          )}
        </span>

        {/* Edit menu — greyed out items */}
        <span
          style={{ position: "relative" }}
          onClick={(e) => { e.stopPropagation(); playMenuClick(); setActiveMenu(activeMenu === "edit" ? null : "edit") }}
        >
          <span
            style={{
              fontSize: 12, fontWeight: 500, color: "#000", cursor: "default",
              padding: "2px 6px", borderRadius: 2,
              background: activeMenu === "edit" ? "#3068d4" : "transparent",
              ...(activeMenu === "edit" ? { color: "#fff" } : {}),
            }}
          >
            Edit
          </span>
          {activeMenu === "edit" && (
            <div style={{
              position: "absolute", top: 18, left: 0, minWidth: 200,
              background: "#f5f5f5", border: "1px solid #999", borderRadius: 4,
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)", padding: "4px 0", zIndex: 100,
            }}>
              {[
                { label: "Undo", shortcut: "⌘Z" },
                { label: "Redo", shortcut: "⇧⌘Z" },
                { divider: true },
                { label: "Cut", shortcut: "⌘X" },
                { label: "Copy", shortcut: "⌘C" },
                { label: "Paste", shortcut: "⌘V" },
                { label: "Select All", shortcut: "⌘A" },
                { divider: true },
                { label: "Find…", shortcut: "⌘F" },
              ].map((item, i) =>
                'divider' in item ? (
                  <div key={i} style={{ height: 1, background: "rgba(0,0,0,0.1)", margin: "4px 0" }} />
                ) : (
                  <div key={i} style={{
                    padding: "4px 16px", fontSize: 12, color: "rgba(0,0,0,0.3)",
                    display: "flex", justifyContent: "space-between", cursor: "default",
                  }}>
                    <span>{item.label}</span>
                    <span style={{ fontSize: 11, color: "rgba(0,0,0,0.2)", marginLeft: 24 }}>{item.shortcut}</span>
                  </div>
                )
              )}
            </div>
          )}
        </span>

        {/* View menu — greyed out items */}
        <span
          style={{ position: "relative" }}
          onClick={(e) => { e.stopPropagation(); playMenuClick(); setActiveMenu(activeMenu === "view" ? null : "view") }}
        >
          <span
            style={{
              fontSize: 12, fontWeight: 500, color: "#000", cursor: "default",
              padding: "2px 6px", borderRadius: 2,
              background: activeMenu === "view" ? "#3068d4" : "transparent",
              ...(activeMenu === "view" ? { color: "#fff" } : {}),
            }}
          >
            View
          </span>
          {activeMenu === "view" && (
            <div style={{
              position: "absolute", top: 18, left: 0, minWidth: 220,
              background: "#f5f5f5", border: "1px solid #999", borderRadius: 4,
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)", padding: "4px 0", zIndex: 100,
            }}>
              {[
                { label: "as Icons", disabled: true },
                { label: "as List", disabled: true },
                { label: "as Columns", disabled: true },
                { divider: true },
                { label: "Sort by Name", sort: "name" as const },
                { label: "Sort by Number", sort: "number" as const },
                { label: "Sort by Category", sort: "category" as const },
                { divider: true },
                { label: "Scatter", sort: "none" as const },
              ].map((item, i) =>
                'divider' in item ? (
                  <div key={i} style={{ height: 1, background: "rgba(0,0,0,0.1)", margin: "4px 0" }} />
                ) : item.disabled ? (
                  <div key={i} style={{
                    padding: "4px 16px", fontSize: 12, color: "rgba(0,0,0,0.3)", cursor: "default",
                  }}>
                    {item.label}
                  </div>
                ) : (
                  <div
                    key={i}
                    onClick={(e) => { e.stopPropagation(); playSubClick(); setSortMode(item.sort!); setActiveMenu(null) }}
                    style={{
                      padding: "4px 16px", fontSize: 12, cursor: "default",
                      color: sortMode === item.sort ? "#000" : "rgba(0,0,0,0.7)",
                      fontWeight: sortMode === item.sort ? 600 : 400,
                      display: "flex", alignItems: "center", gap: 8,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#3068d4", e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent", e.currentTarget.style.color = sortMode === item.sort ? "#000" : "rgba(0,0,0,0.7)")}
                  >
                    <span style={{ width: 14, fontSize: 11 }}>{sortMode === item.sort ? "✓" : ""}</span>
                    {item.label}
                  </div>
                )
              )}
            </div>
          )}
        </span>

        {/* Go menu — filter experiments */}
        <span
          style={{ position: "relative" }}
          onClick={(e) => { e.stopPropagation(); playMenuClick(); setActiveMenu(activeMenu === "go" ? null : "go") }}
        >
          <span
            style={{
              fontSize: 12, fontWeight: 500, color: "#000", cursor: "default",
              padding: "2px 6px", borderRadius: 2,
              background: activeMenu === "go" ? "#3068d4" : "transparent",
              ...(activeMenu === "go" ? { color: "#fff" } : {}),
            }}
          >
            Go
          </span>
          {activeMenu === "go" && (
            <div style={{
              position: "absolute", top: 18, left: 0, minWidth: 200,
              background: "#f5f5f5", border: "1px solid #999", borderRadius: 4,
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)", padding: "4px 0", zIndex: 100,
            }}>
              {[
                { label: "All Experiments", filter: null },
                { divider: true },
                { label: "Arcade", filter: "arcade" },
                { label: "Components", filter: "components" },
                { label: "3D / Immersive", filter: "3d" },
                { label: "Motion", filter: "motion" },
                { label: "AI", filter: "ai" },
              ].map((item, i) =>
                'divider' in item && !('label' in item) ? (
                  <div key={i} style={{ height: 1, background: "rgba(0,0,0,0.1)", margin: "4px 0" }} />
                ) : (
                  <div
                    key={i}
                    onClick={() => {
                      playSubClick()
                      setActiveFilter('filter' in item ? item.filter as string | null : null)
                      setActiveMenu(null)
                    }}
                    style={{
                      padding: "4px 16px", fontSize: 12, color: "#000", cursor: "default",
                      display: "flex", alignItems: "center", gap: 8,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#3068d4"; e.currentTarget.style.color = "#fff" }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#000" }}
                  >
                    <span style={{
                      width: 12, fontSize: 11,
                      visibility: activeFilter === ('filter' in item ? item.filter : null) ? "visible" : "hidden",
                    }}>✓</span>
                    {'label' in item ? item.label : ''}
                  </div>
                )
              )}
            </div>
          )}
        </span>

        {/* Help — opens readme directly */}
        <span
          onClick={(e) => { e.stopPropagation(); playMenuClick(); setShowReadme(true); setActiveMenu(null) }}
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#000",
            cursor: "default",
          }}
        >
          Help
        </span>

        {/* Power button — far right */}
        <span
          onClick={(e) => { e.stopPropagation(); triggerShutdown() }}
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "2px 8px",
            borderRadius: 3,
            border: "1px solid rgba(0,0,0,0.15)",
            background: "rgba(0,0,0,0.05)",
            cursor: "default",
            transition: "background 0.2s, border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0,0,0,0.12)"
            e.currentTarget.style.borderColor = "rgba(0,0,0,0.3)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(0,0,0,0.05)"
            e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)"
          }}
          title="Shut Down — Return to portfolio"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="2" x2="12" y2="12" />
            <path d="M16.24 7.76a8 8 0 1 1-8.49-.01" />
          </svg>
          <span style={{ fontSize: 11, fontWeight: 500, color: "#000" }}>Exit</span>
        </span>
      </div>

      {/* Folder layer */}
      {isDesktop ? (
        // Desktop: scattered, draggable
        <div
          onClick={() => setActiveMenu(null)}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
          }}
        >
          {EXPERIMENTS.map((exp, i) => (
            <motion.div
              key={exp.id}
              drag
              dragMomentum={false}
              dragElastic={0}
              dragConstraints={containerRef}
              whileDrag={{ scale: 1.05 }}
              whileHover={{ scale: 1.02 }}
              onDragStart={() => {
                bringToFront(exp.id)
                const el = containerRef.current
                if (el) {
                  const rect = el.getBoundingClientRect()
                  dragStartRef.current = { x: rect.left, y: rect.top }
                }
              }}
              onPointerDown={(e) => {
                dragStartRef.current = { x: e.clientX, y: e.clientY }
              }}
              onPointerUp={(e) => {
                if (dragStartRef.current) {
                  const dx = Math.abs(e.clientX - dragStartRef.current.x)
                  const dy = Math.abs(e.clientY - dragStartRef.current.y)
                  if (dx < 5 && dy < 5) {
                    handleFolderClick(exp)
                  }
                }
                dragStartRef.current = null
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: matchesFilter(exp) ? 1 : 0.25,
                y: 0,
                left: `${getGridPosition(exp).x}%`,
                top: `${getGridPosition(exp).y}%`,
                filter: matchesFilter(exp) ? "none" : "grayscale(1)",
              }}
              transition={{
                delay: i * 0.06,
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
                left: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
                top: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
              }}
              style={{
                position: "absolute",
                left: `${getGridPosition(exp).x}%`,
                top: `${getGridPosition(exp).y}%`,
                zIndex: zStack[exp.id] || 1,
                cursor: "grab",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                userSelect: "none",
                WebkitUserSelect: "none",
              }}
            >
              <FolderSVG size={folderSize} />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.85)",
                  textAlign: "center",
                  maxWidth: 90,
                  lineHeight: 1.3,
                  textShadow: "0 1px 4px rgba(0,0,0,0.6)",
                }}
              >
                <span style={{ fontSize: 9, opacity: 0.5, display: "block", marginBottom: 1 }}>{exp.number}</span>
                {exp.label}
              </span>
              {exp.contentType === "external" && (
                <span
                  style={{
                    fontSize: 7,
                    fontWeight: 700,
                    color: "#fff",
                    background: accentColor,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    padding: "2px 5px",
                    borderRadius: 3,
                    lineHeight: 1,
                  }}
                >
                  Live
                </span>
              )}
              {exp.isNew && (
                <span
                  style={{
                    fontSize: 7,
                    fontWeight: 700,
                    color: "#fff",
                    background: "#e85d04",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    padding: "2px 5px",
                    borderRadius: 3,
                    lineHeight: 1,
                  }}
                >
                  New
                </span>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        // Tablet/Mobile: grid layout
        <div
          onClick={() => setActiveMenu(null)}
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
            gap: isMobile ? 24 : 32,
            padding: isMobile ? "32px 24px" : "40px 40px",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          {EXPERIMENTS.map((exp, i) => (
            <motion.div
              key={exp.id}
              onClick={() => handleFolderClick(exp)}
              initial={{ opacity: 0, y: 16 }}
              animate={{
                opacity: matchesFilter(exp) ? 1 : 0.25,
                y: 0,
                filter: matchesFilter(exp) ? "none" : "grayscale(1)",
              }}
              transition={{
                delay: i * 0.05,
                duration: 0.35,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
                userSelect: "none",
                WebkitUserSelect: "none",
              }}
            >
              <FolderSVG size={folderSize} />
              <span
                style={{
                  fontSize: isMobile ? 10 : 11,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.85)",
                  textAlign: "center",
                  maxWidth: 80,
                  lineHeight: 1.3,
                }}
              >
                <span style={{ fontSize: 9, opacity: 0.5, display: "block", marginBottom: 1 }}>{exp.number}</span>
                {exp.label}
              </span>
              {exp.contentType === "external" && (
                <span
                  style={{
                    fontSize: 7,
                    fontWeight: 700,
                    color: "#fff",
                    background: accentColor,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    padding: "2px 5px",
                    borderRadius: 3,
                    lineHeight: 1,
                  }}
                >
                  Live
                </span>
              )}
              {exp.isNew && (
                <span
                  style={{
                    fontSize: 7,
                    fontWeight: 700,
                    color: "#fff",
                    background: "#e85d04",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    padding: "2px 5px",
                    borderRadius: 3,
                    lineHeight: 1,
                  }}
                >
                  New
                </span>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal overlay — retro Finder window */}
      <AnimatePresence>
        {activeExperiment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActiveExperiment(null)}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 100,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: isMobile ? 12 : 40,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: isMobile ? "100%" : (activeExperiment?.previewComponent ? 720 : 420),
                maxHeight: isMobile ? "100%" : "85%",
                background: "#f5f5f5",
                borderRadius: 2,
                border: "2px solid rgba(0,0,0,0.15)",
                boxShadow: "6px 6px 0px rgba(0,0,0,0.12)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* ── Title bar (retro Finder style) ── */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 10px",
                  height: 28,
                  background: "linear-gradient(to bottom, #e8e8e8, #d4d4d4)",
                  borderBottom: "1px solid rgba(0,0,0,0.1)",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    letterSpacing: "0.02em",
                    fontFamily: "'Inter', system-ui, sans-serif",
                  }}
                >
                  {activeExperiment.label}
                </span>
                <button
                  onClick={() => setActiveExperiment(null)}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 0,
                    border: "1px solid rgba(0,0,0,0.2)",
                    background: "rgba(0,0,0,0.05)",
                    color: "rgba(0,0,0,0.5)",
                    fontSize: 10,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    lineHeight: 1,
                    outline: "none",
                  }}
                >
                  &#x2715;
                </button>
              </div>

              {/* ── Horizontal stripes (Finder chrome detail) ── */}
              <div style={{ height: 6, background: "repeating-linear-gradient(to bottom, #d0d0d0 0px, #d0d0d0 1px, #c4c4c4 1px, #c4c4c4 2px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }} />

              {/* ── Live Preview Hero ── */}
              {activeExperiment.previewComponent && (
                <div
                  style={{
                    background: "#eaeaea",
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      height: activeExperiment.previewComponent === "site-readme"
                        ? "auto"
                        : activeExperiment.previewComponent === "pgr-logo-carousel"
                          ? 420
                        : activeExperiment.previewComponent === "thumbnail-carousel"
                          ? 420
                          : activeExperiment.previewComponent === "accordion-module"
                            ? 410
                            : activeExperiment.previewComponent === "metrics-grid"
                              ? 220
                              : activeExperiment.previewComponent === "supervisor-video"
                                ? 480
                                : activeExperiment.previewComponent === "ecomap-embed"
                                  ? 560
                                  : 140,
                      flex: activeExperiment.previewComponent === "site-readme" ? 1 : undefined,
                      minHeight: activeExperiment.previewComponent === "site-readme" ? 0 : undefined,
                      overflow: activeExperiment.previewComponent === "site-readme" ? "auto" : undefined,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Suspense
                      fallback={
                        <div style={{ color: "rgba(0,0,0,0.3)", fontSize: 12 }}>
                          Loading preview...
                        </div>
                      }
                    >
                      {activeExperiment.previewComponent === "typewriter" && <Typewriter />}
                      {activeExperiment.previewComponent === "accordion-module" && (
                        <AccordionModule />
                      )}
                      {activeExperiment.previewComponent === "metrics-grid" && (
                        <div style={{ width: "100%", height: "100%" }}>
                          <MetricsGrid />
                        </div>
                      )}
                      {activeExperiment.previewComponent === "pgr-logo-carousel" && (
                        <div style={{ width: "100%", height: "100%" }}>
                          <PGRLogoCarousel />
                        </div>
                      )}
                      {activeExperiment.previewComponent === "thumbnail-carousel" && (
                        <div style={{ width: "100%", height: "100%" }}>
                          <ThumbnailCarousel />
                        </div>
                      )}
                      {activeExperiment.previewComponent === "supervisor-video" && (
                        <div style={{ width: "100%", height: "100%" }}>
                          <SupervisorVideo />
                        </div>
                      )}
                      {activeExperiment.previewComponent === "ecomap-embed" && (
                        <div style={{ width: "100%", height: "100%" }}>
                          <EcomapEmbed />
                        </div>
                      )}
                      {activeExperiment.previewComponent === "site-readme" && (
                        <div style={{ width: "100%", height: "100%" }}>
                          <SiteReadme />
                        </div>
                      )}
                    </Suspense>
                  </div>
                </div>
              )}

              {/* ── Content area (hidden for readme since the preview IS the content) ── */}
              {activeExperiment.previewComponent !== "site-readme" && (
              <div style={{ padding: isMobile ? 16 : 24, overflow: "auto", flex: 1 }}>

                {/* Description */}
                <p
                  style={{
                    margin: "0 0 16px",
                    fontSize: 13,
                    lineHeight: 1.65,
                    color: "#1a1a1a",
                  }}
                >
                  {activeExperiment.description}
                </p>

                {/* Tags row */}
                {activeExperiment.tags && activeExperiment.tags.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                    {activeExperiment.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: "3px 8px",
                          border: "1px solid rgba(0,0,0,0.12)",
                          background: "rgba(0,0,0,0.04)",
                          color: "rgba(0,0,0,0.55)",
                          fontSize: 10,
                          fontWeight: 600,
                          letterSpacing: "0.03em",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* ── Metadata rows ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 12, color: "rgba(0,0,0,0.4)", minWidth: 80 }}>
                      Experiment
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>
                      No. {activeExperiment.number}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 12, color: "rgba(0,0,0,0.4)", minWidth: 80 }}>
                      Name
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>
                      {activeExperiment.label}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 12, color: "rgba(0,0,0,0.4)", minWidth: 80 }}>
                      Category
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>
                      {activeExperiment.category}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 12, color: "rgba(0,0,0,0.4)", minWidth: 80 }}>
                      Stack
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {activeExperiment.stack.map((item) => (
                        <span
                          key={item}
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#1a1a1a",
                            padding: "2px 7px",
                            background: "rgba(0,0,0,0.05)",
                            border: "1px solid rgba(0,0,0,0.1)",
                            borderRadius: 3,
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 12, color: "rgba(0,0,0,0.4)", minWidth: 80 }}>
                      Author
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>
                      KEITH SCOTT
                    </span>
                  </div>
                </div>

                {/* ── Action buttons ── */}
                <div style={{ marginTop: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {/* Play button for games */}
                  {activeExperiment.contentType === "game" && (
                    <button
                      onClick={() => {
                        if (activeExperiment.id === "basketball-game") {
                          setActiveExperiment(null)
                          setShowBasketballGame(true)
                        } else if (activeExperiment.id === "space-runner") {
                          setActiveExperiment(null)
                          setIframeGame("/games/mario/index.html")
                        }
                      }}
                      style={{
                        padding: "10px 28px",
                        border: "none",
                        background: "#e85d04",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        fontFamily: "'Inter', system-ui, sans-serif",
                        transition: "background 0.15s, transform 0.15s",
                        borderRadius: 4,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f48c06"
                        e.currentTarget.style.transform = "scale(1.03)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#e85d04"
                        e.currentTarget.style.transform = "scale(1)"
                      }}
                    >
                      &#9654; Play
                    </button>
                  )}

                  {/* Fullscreen preview for translator */}
                  {activeExperiment.id === "translator-hero" && (
                    <button
                      onClick={() => {
                        setActiveExperiment(null)
                        setTranslatorFs(true)
                      }}
                      style={{
                        padding: "10px 28px",
                        border: "none",
                        background: "#e85d04",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        fontFamily: "'Inter', system-ui, sans-serif",
                        transition: "background 0.15s, transform 0.15s",
                        borderRadius: 4,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f48c06"
                        e.currentTarget.style.transform = "scale(1.03)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#e85d04"
                        e.currentTarget.style.transform = "scale(1)"
                      }}
                    >
                      &#9654; Preview
                    </button>
                  )}

                  {/* View Live for external links */}
                  {activeExperiment.url && (
                    <a
                      href={activeExperiment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "10px 28px",
                        border: "2px solid rgba(0,0,0,0.15)",
                        background: "rgba(0,0,0,0.04)",
                        color: "#1a1a1a",
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        textDecoration: "none",
                        cursor: "pointer",
                        fontFamily: "'Inter', system-ui, sans-serif",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        transition: "background 0.15s, border-color 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(0,0,0,0.08)"
                        e.currentTarget.style.borderColor = "rgba(0,0,0,0.25)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(0,0,0,0.04)"
                        e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)"
                      }}
                    >
                      View Live
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7" />
                        <path d="M7 7h10v10" />
                      </svg>
                    </a>
                  )}

                  {/* GitHub link */}
                  {activeExperiment.github && (
                    <a
                      href={activeExperiment.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "10px 28px",
                        border: "2px solid rgba(0,0,0,0.15)",
                        background: "rgba(0,0,0,0.04)",
                        color: "#1a1a1a",
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        textDecoration: "none",
                        cursor: "pointer",
                        fontFamily: "'Inter', system-ui, sans-serif",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        transition: "background 0.15s, border-color 0.15s",
                        borderRadius: 4,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(0,0,0,0.08)"
                        e.currentTarget.style.borderColor = "rgba(0,0,0,0.25)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(0,0,0,0.04)"
                        e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)"
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      GitHub
                    </a>
                  )}
                </div>
              </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Readme modal */}
      <AnimatePresence>
        {showReadme && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={() => setShowReadme(false)}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 100,
              background: "rgba(0,0,0,0.65)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: isMobile ? 12 : 40,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1], delay: 0.05 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: 620,
                maxHeight: isMobile ? "100%" : "85%",
                background: "#f5f5f5",
                borderRadius: 2,
                border: "2px solid rgba(0,0,0,0.15)",
                boxShadow: "6px 6px 0px rgba(0,0,0,0.12)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Title bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 10px",
                  height: 28,
                  background: "linear-gradient(to bottom, #e8e8e8, #d4d4d4)",
                  borderBottom: "1px solid rgba(0,0,0,0.1)",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    letterSpacing: "0.02em",
                    fontFamily: "'Inter', system-ui, sans-serif",
                  }}
                >
                  readme.md
                </span>
                <button
                  onClick={() => setShowReadme(false)}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 0,
                    border: "1px solid rgba(0,0,0,0.2)",
                    background: "rgba(0,0,0,0.05)",
                    color: "rgba(0,0,0,0.5)",
                    fontSize: 10,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    lineHeight: 1,
                    outline: "none",
                  }}
                >
                  &#x2715;
                </button>
              </div>
              {/* Stripes */}
              <div style={{ height: 6, background: "repeating-linear-gradient(to bottom, #d0d0d0 0px, #d0d0d0 1px, #c4c4c4 1px, #c4c4c4 2px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }} />
              {/* Content */}
              <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
                <Suspense fallback={<div style={{ padding: 24, color: "rgba(0,0,0,0.3)", fontSize: 12 }}>Loading...</div>}>
                  <SiteReadme />
                </Suspense>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Translator fullscreen */}
      <AnimatePresence>
        {translatorFs && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "#000",
            }}
          >
            <Suspense fallback={null}>
              <TranslatorHero />
            </Suspense>
            <button
              onClick={() => setTranslatorFs(false)}
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cycling lightbox */}
      <AnimatePresence>
        {showCycling && (
          <CyclingLightbox onClose={() => setShowCycling(false)} isMobile={isMobile} />
        )}
      </AnimatePresence>

      {/* Iframe game overlay (Space Runner, etc.) */}
      {iframeGame && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "#000",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <button
            onClick={() => setIframeGame(null)}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.3)",
              background: "rgba(0,0,0,0.7)",
              color: "#fff",
              fontSize: 20,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              outline: "none",
            }}
          >
            &#x2715;
          </button>
          <iframe
            src={iframeGame}
            style={{
              flex: 1,
              width: "100%",
              border: "none",
            }}
            title="Game"
          />
        </div>
      )}

      {/* Basketball game (full-screen overlay, self-managed) */}
      <Suspense fallback={null}>
        <Basketball3DGameRapier />
      </Suspense>

      {/* Old-school Mac shutdown animation */}
      {shutdownActive && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: shutdownPhase >= 1 ? "#000" : "transparent",
            transition: "background 0.5s ease",
            pointerEvents: "all",
          }}
        >
          {/* The bright white rectangle that squeezes and shrinks */}
          {shutdownPhase >= 1 && shutdownPhase < 4 && (
            <div
              style={{
                width:
                  shutdownPhase === 1 ? "100vw"
                  : shutdownPhase === 2 ? "60vw"
                  : "0px",
                height:
                  shutdownPhase === 1 ? "100vh"
                  : shutdownPhase === 2 ? "2px"
                  : "0px",
                background: "#fff",
                borderRadius: shutdownPhase >= 2 ? "1px" : "0",
                boxShadow: shutdownPhase >= 2
                  ? "0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(255,255,255,0.4)"
                  : "none",
                transition: shutdownPhase === 1
                  ? "width 0.1s ease, height 0.1s ease"
                  : shutdownPhase === 2
                  ? "width 0.7s cubic-bezier(0.4, 0, 0.2, 1), height 0.7s cubic-bezier(0.4, 0, 0.2, 1)"
                  : "width 0.5s cubic-bezier(0.4, 0, 0.2, 1), height 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                opacity: shutdownPhase === 3 ? 0 : 1,
              }}
            />
          )}

          {/* Powered-off screen with restart + back buttons */}
          {shutdownPhase === 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 48,
              }}
            >
              {/* Back */}
              <button
                onClick={() => window.history.back()}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "border-color 0.3s, box-shadow 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"
                    e.currentTarget.style.boxShadow = "0 0 20px rgba(255,255,255,0.1)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5" />
                    <path d="M12 19l-7-7 7-7" />
                  </svg>
                </div>
                <span style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.2)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontFamily: "'Inter', system-ui, sans-serif",
                }}>
                  Back
                </span>
              </button>

              {/* Restart */}
              <button
                onClick={() => window.location.reload()}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "border-color 0.3s, box-shadow 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"
                    e.currentTarget.style.boxShadow = "0 0 20px rgba(255,255,255,0.1)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round">
                    <line x1="12" y1="2" x2="12" y2="12" />
                    <path d="M16.24 7.76a8 8 0 1 1-8.49-.01" />
                  </svg>
                </div>
                <span style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.2)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontFamily: "'Inter', system-ui, sans-serif",
                }}>
                  Restart
                </span>
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Framer Property Controls ─────────────────────────────

addPropertyControls(ExperimentsDesktop, {
  bgColor: {
    type: ControlType.Color,
    title: "Background",
    defaultValue: "#1a1a1a",
  },
  folderColor: {
    type: ControlType.Color,
    title: "Folder Color",
    defaultValue: "#5AB4F0",
  },
  accentColor: {
    type: ControlType.Color,
    title: "Accent Color",
    defaultValue: "#bd5931",
  },
  showTexture: {
    type: ControlType.Boolean,
    title: "Show Texture",
    defaultValue: true,
  },
})
