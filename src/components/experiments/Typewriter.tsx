import { useState, useEffect, useRef } from "react"

const words = [
  "chaos.",
  "disarray.",
  "confusing.",
  "overwhelming.",
  "fragmented.",
  "inconsistent.",
  "scattered.",
  "broken.",
]

const START_DELAY = 1500

export default function Typewriter() {
  const [displayed, setDisplayed] = useState("")
  const [cursorVisible, setCursorVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let wordIndex = 0
    let charIndex = 0
    let deleting = false
    let timeout: ReturnType<typeof setTimeout>

    function tick() {
      const word = words[wordIndex]
      if (!deleting) {
        charIndex++
        setDisplayed(word.slice(0, charIndex))
        if (charIndex === word.length) {
          timeout = setTimeout(() => {
            deleting = true
            tick()
          }, 1800)
          return
        }
        timeout = setTimeout(tick, 80 + Math.random() * 40)
      } else {
        charIndex--
        setDisplayed(word.slice(0, charIndex))
        if (charIndex <= 0) {
          deleting = false
          wordIndex = (wordIndex + 1) % words.length
          timeout = setTimeout(tick, 400)
          return
        }
        timeout = setTimeout(tick, 40 + Math.random() * 20)
      }
    }

    timeout = setTimeout(tick, START_DELAY)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const delay = setTimeout(() => {
      setCursorVisible(true)
      const interval = setInterval(() => {
        setCursorVisible((v) => !v)
      }, 530)
      return () => clearInterval(interval)
    }, START_DELAY)
    return () => clearTimeout(delay)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#1a1a1a",
        padding: "0 24px",
      }}
    >
      <p
        style={{
          fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontSize: 16,
          color: "rgba(255,255,255,0.7)",
          lineHeight: 1.6,
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.5)" }}>Onboarding is </span>
        <span style={{ fontWeight: 700, color: "#fff" }}>{displayed || "\u200B"}</span>
        <span
          style={{
            display: "inline-block",
            width: 2,
            height: "1.1em",
            backgroundColor: "#fff",
            marginLeft: 2,
            verticalAlign: "text-bottom",
            opacity: cursorVisible ? 1 : 0,
            transition: "opacity 100ms",
          }}
        />
      </p>
    </div>
  )
}
