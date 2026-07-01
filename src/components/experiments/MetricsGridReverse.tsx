import { useEffect, useRef, useState, CSSProperties } from "react"

const FONT_URL =
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap"

const CELL = 48
const COLORS: [number, number, number][] = [
    [255, 90, 90],
    [255, 155, 50],
    [255, 210, 60],
    [80, 200, 120],
    [60, 160, 240],
    [130, 100, 240],
    [230, 80, 180],
    [50, 200, 200],
    [255, 130, 100],
    [100, 180, 255],
]

interface Tracer {
    x: number
    y: number
    rowIndex: number
    length: number
    speed: number
    progress: number
    maxTravel: number
    opacity: number
    lineWidth: number
    color: [number, number, number]
}

export default function MetricsGridReverse() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const bannerRef = useRef<HTMLDivElement>(null)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        if (!document.querySelector(`link[href="${FONT_URL}"]`)) {
            const link = document.createElement("link")
            link.rel = "stylesheet"
            link.href = FONT_URL
            document.head.appendChild(link)
        }
    }, [])

    // Breakpoint observer
    useEffect(() => {
        const el = bannerRef.current
        if (!el) return
        const ro = new ResizeObserver(([entry]) => {
            setIsMobile(entry.contentRect.width < 640)
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        const banner = bannerRef.current
        if (!canvas || !banner) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let W = 0,
            H = 0,
            cols = 0,
            rows = 0
        const tracers: Tracer[] = []
        const occupiedRows = new Set<number>()
        let lastTime = performance.now()
        let spawnTimer = 0
        let animId: number

        function resize() {
            const rect = banner!.getBoundingClientRect()
            const dpr = window.devicePixelRatio || 1
            W = rect.width
            H = rect.height
            if (W === 0 || H === 0) return
            canvas!.width = W * dpr
            canvas!.height = H * dpr
            ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
            cols = Math.ceil(W / CELL)
            rows = Math.ceil(H / CELL)
        }

        function spawnTracer() {
            const availableRows: number[] = []
            for (let r = 1; r < rows; r++) {
                if (!occupiedRows.has(r)) availableRows.push(r)
            }
            if (availableRows.length === 0) return

            const rowIndex =
                availableRows[Math.floor(Math.random() * availableRows.length)]
            occupiedRows.add(rowIndex)

            const length = 220 + Math.floor(Math.random() * (672 - 220))
            const speed = 480 + Math.random() * 960
            const y = rowIndex * CELL
            // Start from right side
            const x = W + length
            const color = COLORS[Math.floor(Math.random() * COLORS.length)]

            tracers.push({
                x,
                y,
                rowIndex,
                length,
                speed,
                progress: 0,
                maxTravel: W + length,
                opacity: 0.25 + Math.random() * 0.55,
                lineWidth: 1 + Math.random() * 0.5,
                color,
            })
        }

        function drawStaticGrid() {
            ctx!.strokeStyle = "rgba(226, 226, 226, 0.3)"
            ctx!.lineWidth = 1
            ctx!.beginPath()
            for (let c = 0; c <= cols; c++) {
                const x = c * CELL
                ctx!.moveTo(x, 0)
                ctx!.lineTo(x, H)
            }
            for (let r = 0; r <= rows; r++) {
                const y = r * CELL
                ctx!.moveTo(0, y)
                ctx!.lineTo(W, y)
            }
            ctx!.stroke()
        }

        function drawTracers(dt: number) {
            for (let i = tracers.length - 1; i >= 0; i--) {
                const t = tracers[i]
                t.progress += t.speed * dt

                if (t.progress > t.maxTravel) {
                    occupiedRows.delete(t.rowIndex)
                    tracers.splice(i, 1)
                    continue
                }

                // Moving right to left: head moves left, tail follows
                const headPos = t.x - t.progress
                const tailPos = t.x - Math.max(0, t.progress - t.length)
                if (headPos === tailPos) continue

                const [r, g, b] = t.color
                // Gradient: tail (right) is transparent, head (left) is opaque
                const grad = ctx!.createLinearGradient(
                    tailPos,
                    t.y,
                    headPos,
                    t.y
                )
                grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`)
                grad.addColorStop(
                    0.4,
                    `rgba(${r}, ${g}, ${b}, ${t.opacity * 0.5})`
                )
                grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${t.opacity})`)

                ctx!.strokeStyle = grad
                ctx!.lineWidth = t.lineWidth
                ctx!.beginPath()
                ctx!.moveTo(tailPos, t.y)
                ctx!.lineTo(headPos, t.y)
                ctx!.stroke()
            }
        }

        function loop(now: number) {
            const dt = (now - lastTime) / 1000
            lastTime = now

            ctx!.clearRect(0, 0, W, H)
            drawStaticGrid()

            spawnTimer += dt
            if (spawnTimer >= 0.15) {
                spawnTracer()
                spawnTimer = 0
            }

            drawTracers(dt)
            animId = requestAnimationFrame(loop)
        }

        const ro = new ResizeObserver(() => resize())
        ro.observe(banner)
        resize()
        animId = requestAnimationFrame(loop)

        return () => {
            ro.disconnect()
            cancelAnimationFrame(animId)
        }
    }, [])

    const banner: CSSProperties = {
        position: "relative",
        width: "100%",
        padding: isMobile ? "48px 0" : "80px 0",
        background: "#ffffff",
        overflow: "hidden",
        fontFamily: "'Inter', system-ui, sans-serif",
    }

    const canvasStyle: CSSProperties = {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
    }

    const fadeBase: CSSProperties = {
        position: "absolute",
        top: 0,
        bottom: 0,
        width: 80,
        zIndex: 1,
        pointerEvents: "none",
    }

    const fadeLeft: CSSProperties = {
        ...fadeBase,
        left: 0,
        background: "linear-gradient(to right, #ffffff, transparent)",
    }

    const fadeRight: CSSProperties = {
        ...fadeBase,
        right: 0,
        background: "linear-gradient(to left, #ffffff, transparent)",
    }

    const row: CSSProperties = {
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-around",
        alignItems: isMobile ? "center" : "flex-start",
        gap: isMobile ? 36 : 40,
        maxWidth: 960,
        margin: "0 auto",
        padding: isMobile ? "0 24px" : "0 60px",
    }

    const metricStyle: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        flex: isMobile ? undefined : 1,
    }

    const numberRow: CSSProperties = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        marginBottom: isMobile ? 8 : 12,
        whiteSpace: "nowrap",
    }

    const numberText: CSSProperties = {
        fontWeight: 900,
        fontSize: isMobile ? 40 : 56,
        color: "#1a1a1a",
        letterSpacing: -2,
        lineHeight: 1,
    }

    const arrowStyle: CSSProperties = {
        fontSize: isMobile ? 28 : 36,
        fontWeight: 900,
        color: "#CC2222",
        lineHeight: 1,
    }

    const labelStyle: CSSProperties = {
        fontWeight: 400,
        fontSize: isMobile ? 13 : 15,
        color: "#777",
        lineHeight: 1.4,
        position: "relative",
        zIndex: 3,
    }

    return (
        <div ref={bannerRef} style={banner}>
            <canvas ref={canvasRef} style={canvasStyle} />
            <div style={fadeLeft} />
            <div style={fadeRight} />

            <div style={row}>
                <div style={metricStyle}>
                    <div style={numberRow}>
                        <span style={arrowStyle}>&#8595;</span>
                        <span style={numberText}>25%</span>
                    </div>
                    <div style={labelStyle}>Fewer calls taken per week</div>
                </div>
                <div style={metricStyle}>
                    <div style={numberRow}>
                        <span style={arrowStyle}>&#8593;</span>
                        <span style={numberText}>3-5min</span>
                    </div>
                    <div style={labelStyle}>Longer handle time per call</div>
                </div>
                <div style={metricStyle}>
                    <div style={numberRow}>
                        <span style={arrowStyle}>&#8595;</span>
                        <span style={numberText}>20-30%</span>
                    </div>
                    <div style={labelStyle}>Drop in weekly sales</div>
                </div>
            </div>
        </div>
    )
}
