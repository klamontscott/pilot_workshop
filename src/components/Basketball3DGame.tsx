"use client";

import { Canvas, useFrame } from '@react-three/fiber'
import { Physics, RigidBody, CuboidCollider, BallCollider, RapierRigidBody } from '@react-three/rapier'
import { useGLTF } from '@react-three/drei'
import { useEffect, useRef, useState, useMemo, useCallback, Suspense } from 'react'
import * as THREE from 'three'

// ═══════════════════════════════════════════════════════════════
// Sound effects via Web Audio API (no files needed)
// ═══════════════════════════════════════════════════════════════

let _audioCtx: AudioContext | null = null
function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new AudioContext()
  return _audioCtx
}

function playTone(freq: number, duration: number, volume = 0.3, type: OscillatorType = 'sine') {
  try {
    const ctx = getAudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch { /* audio not available */ }
}

function playCountdownBeep() { playTone(660, 0.15, 0.25, 'square') }
function playGoBeep() { playTone(880, 0.3, 0.35, 'square') }
function playTickSound() { playTone(440, 0.08, 0.15, 'sine') }
function playUrgentTick() { playTone(580, 0.1, 0.25, 'square') }
function playBuzzer() {
  playTone(220, 0.5, 0.3, 'sawtooth')
  setTimeout(() => playTone(180, 0.4, 0.2, 'sawtooth'), 150)
}

// Rim hit — metallic iron ring, not a digital beep
function playRimHit(force: number) {
  const vol = Math.min(0.2, force * 0.025)
  if (vol < 0.025) return
  try {
    const ctx = getAudioCtx()
    const t = ctx.currentTime

    // Layer 1: Primary ring — two detuned sines beating against each other
    // gives the wobbling, imperfect quality of a real metal rim
    const freqBase = 680 + Math.random() * 60
    const ring1 = ctx.createOscillator()
    const ring2 = ctx.createOscillator()
    ring1.type = 'sine'
    ring2.type = 'sine'
    ring1.frequency.setValueAtTime(freqBase, t)
    ring2.frequency.setValueAtTime(freqBase * 1.007, t) // slight detune for beating
    const ringGain = ctx.createGain()
    ringGain.gain.setValueAtTime(vol * 0.5, t)
    ringGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25)
    ring1.connect(ringGain)
    ring2.connect(ringGain)
    ringGain.connect(ctx.destination)
    ring1.start(t)
    ring2.start(t)
    ring1.stop(t + 0.25)
    ring2.stop(t + 0.25)

    // Layer 2: Higher harmonic ring (overtone of the metal)
    const harm = ctx.createOscillator()
    harm.type = 'sine'
    harm.frequency.setValueAtTime(freqBase * 2.76, t) // inharmonic — like real metal
    const harmGain = ctx.createGain()
    harmGain.gain.setValueAtTime(vol * 0.15, t)
    harmGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
    harm.connect(harmGain)
    harmGain.connect(ctx.destination)
    harm.start(t)
    harm.stop(t + 0.12)

    // Layer 3: Short broadband "clank" — the initial contact impact
    const clankLen = Math.floor(ctx.sampleRate * 0.012)
    const clankBuf = ctx.createBuffer(1, clankLen, ctx.sampleRate)
    const clankData = clankBuf.getChannelData(0)
    for (let i = 0; i < clankLen; i++) {
      clankData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (clankLen * 0.3))
    }
    const clankSrc = ctx.createBufferSource()
    clankSrc.buffer = clankBuf
    const clankFilter = ctx.createBiquadFilter()
    clankFilter.type = 'bandpass'
    clankFilter.frequency.setValueAtTime(1800, t)
    clankFilter.Q.setValueAtTime(2, t)
    const clankGain = ctx.createGain()
    clankGain.gain.setValueAtTime(vol * 0.6, t)
    clankGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02)
    clankSrc.connect(clankFilter)
    clankFilter.connect(clankGain)
    clankGain.connect(ctx.destination)
    clankSrc.start(t)
  } catch { /* audio not available */ }
}

// Basketball bounce — synthesized to mimic a real leather ball on hardwood
function playBounce(force: number) {
  const vol = Math.min(0.35, force * 0.045)
  if (vol < 0.04) return
  try {
    const ctx = getAudioCtx()
    const t = ctx.currentTime

    // Layer 1: The initial "thud" — low-frequency body of the bounce
    // A real basketball has a resonant cavity around 150-250Hz
    const body = ctx.createOscillator()
    const bodyGain = ctx.createGain()
    body.type = 'sine'
    body.frequency.setValueAtTime(180 + Math.random() * 40, t)
    body.frequency.exponentialRampToValueAtTime(90, t + 0.1)
    bodyGain.gain.setValueAtTime(vol * 0.7, t)
    bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1)
    body.connect(bodyGain)
    bodyGain.connect(ctx.destination)
    body.start(t)
    body.stop(t + 0.1)

    // Layer 2: The "slap" — broadband noise burst shaped by the ball's skin
    const slapLen = Math.floor(ctx.sampleRate * 0.04)
    const slapBuf = ctx.createBuffer(1, slapLen, ctx.sampleRate)
    const slapData = slapBuf.getChannelData(0)
    for (let i = 0; i < slapLen; i++) {
      const env = Math.exp(-i / (slapLen * 0.15))
      slapData[i] = (Math.random() * 2 - 1) * env
    }
    const slapSrc = ctx.createBufferSource()
    slapSrc.buffer = slapBuf
    // Lowpass to remove harsh digital highs
    const slapFilter = ctx.createBiquadFilter()
    slapFilter.type = 'lowpass'
    slapFilter.frequency.setValueAtTime(2500, t)
    slapFilter.frequency.exponentialRampToValueAtTime(600, t + 0.04)
    const slapGain = ctx.createGain()
    slapGain.gain.setValueAtTime(vol * 0.5, t)
    slapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05)
    slapSrc.connect(slapFilter)
    slapFilter.connect(slapGain)
    slapGain.connect(ctx.destination)
    slapSrc.start(t)

    // Layer 3: Short mid-frequency "knock" — the hollow air pop
    const knock = ctx.createOscillator()
    const knockGain = ctx.createGain()
    knock.type = 'triangle'
    knock.frequency.setValueAtTime(400 + Math.random() * 60, t)
    knock.frequency.exponentialRampToValueAtTime(120, t + 0.06)
    knockGain.gain.setValueAtTime(vol * 0.25, t)
    knockGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07)
    knock.connect(knockGain)
    knockGain.connect(ctx.destination)
    knock.start(t)
    knock.stop(t + 0.07)
  } catch { /* audio not available */ }
}

// Swish — ball dropping through the net, rope/chain texture
function playSwish() {
  try {
    const ctx = getAudioCtx()
    const duration = 0.35
    const bufferSize = Math.floor(ctx.sampleRate * duration)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      const t = i / ctx.sampleRate
      // Envelope: quick attack, slow decay
      const env = t < 0.02 ? t / 0.02 : Math.pow(1 - (t - 0.02) / (duration - 0.02), 1.5)
      // Mix noise with a slight rhythmic flutter (net strands snapping)
      const flutter = 1 + 0.3 * Math.sin(t * 600)
      data[i] = (Math.random() * 2 - 1) * env * flutter
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    // Sweeping bandpass — starts higher, drops down like ball pulling through net
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.setValueAtTime(2200, ctx.currentTime)
    bp.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + duration)
    bp.Q.setValueAtTime(1.2, ctx.currentTime)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.22, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    source.connect(bp)
    bp.connect(gain)
    gain.connect(ctx.destination)
    source.start()
  } catch { /* audio not available */ }
}

// Crowd cheer — layered noise burst for high score celebration
function playCrowdCheer() {
  try {
    const ctx = getAudioCtx()
    const duration = 2.5
    const bufferSize = ctx.sampleRate * duration
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch)
      for (let i = 0; i < bufferSize; i++) {
        const t = i / ctx.sampleRate
        const envelope = t < 0.3 ? t / 0.3 : Math.max(0, 1 - (t - 0.3) / (duration - 0.3))
        data[i] = (Math.random() * 2 - 1) * envelope * 0.6
      }
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    // Bandpass to sound like muffled crowd
    const bp1 = ctx.createBiquadFilter()
    bp1.type = 'bandpass'
    bp1.frequency.setValueAtTime(800, ctx.currentTime)
    bp1.Q.setValueAtTime(0.8, ctx.currentTime)
    const bp2 = ctx.createBiquadFilter()
    bp2.type = 'bandpass'
    bp2.frequency.setValueAtTime(1600, ctx.currentTime)
    bp2.Q.setValueAtTime(0.5, ctx.currentTime)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.4)
    gain.gain.linearRampToValueAtTime(0.0, ctx.currentTime + duration)
    source.connect(bp1)
    bp1.connect(bp2)
    bp2.connect(gain)
    gain.connect(ctx.destination)
    source.start()
    // Add a second higher-pitched layer for "whistles"
    for (let w = 0; w < 3; w++) {
      setTimeout(() => {
        playTone(1800 + Math.random() * 600, 0.3, 0.06, 'sine')
      }, 200 + w * 400)
    }
  } catch { /* audio not available */ }
}

// Pac-Man death jingle — descending chromatic notes
function playPacManDeath() {
  const notes = [
    { freq: 523, delay: 0 },    // C5
    { freq: 494, delay: 80 },   // B4
    { freq: 466, delay: 160 },  // Bb4
    { freq: 440, delay: 240 },  // A4
    { freq: 415, delay: 340 },  // Ab4
    { freq: 392, delay: 440 },  // G4
    { freq: 370, delay: 540 },  // F#4
    { freq: 349, delay: 640 },  // F4
    { freq: 330, delay: 760 },  // E4
    { freq: 311, delay: 880 },  // Eb4
    { freq: 294, delay: 1000 }, // D4
    { freq: 277, delay: 1120 }, // C#4
    { freq: 262, delay: 1260 }, // C4
    { freq: 247, delay: 1420 }, // B3
    { freq: 220, delay: 1600 }, // A3 — final low note, longer
  ]
  notes.forEach(({ freq, delay }, i) => {
    const isLast = i === notes.length - 1
    setTimeout(() => playTone(freq, isLast ? 0.4 : 0.12, 0.2, 'square'), delay)
  })
}

// ═══════════════════════════════════════════════════════════════
// Confetti effect
// ═══════════════════════════════════════════════════════════════

const CONFETTI_COLORS = ['#ff6600', '#4499ff', '#f39c12', '#2ecc71', '#e74c3c', '#9b59b6', '#fff']
const CONFETTI_COUNT = 80

function Confetti({ active }: { active: boolean }) {
  const pieces = useMemo(() => {
    return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
      drift: (Math.random() - 0.5) * 40,
    }))
  }, [active]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!active) return null

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 20 }}>
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: '-20px',
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            backgroundColor: p.color,
            borderRadius: '2px',
            animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
            transform: `rotate(${p.rotation}deg)`,
            '--drift': `${p.drift}px`,
          } as React.CSSProperties}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { opacity: 1; transform: translateY(0) translateX(0) rotate(0deg); }
          100% { opacity: 0; transform: translateY(100vh) translateX(var(--drift)) rotate(720deg); }
        }
      `}</style>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Global high score leaderboard (jsonblob.com — no account needed)
// ═══════════════════════════════════════════════════════════════

const LEADERBOARD_BLOB_ID = '019d7897-6745-778c-a563-609108181e7c'
const LEADERBOARD_URL = `https://jsonblob.com/api/jsonBlob/${LEADERBOARD_BLOB_ID}`
const LOCAL_CACHE_KEY = 'hoop-dreams-high-scores-cache'

interface HighScoreEntry {
  initials: string
  score: number
}

// Local cache for instant reads
function getCachedScores(): HighScoreEntry[] {
  try {
    const stored = localStorage.getItem(LOCAL_CACHE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function setCachedScores(scores: HighScoreEntry[]) {
  try { localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(scores)) } catch { /* */ }
}

// Fetch global leaderboard
async function fetchHighScores(): Promise<HighScoreEntry[]> {
  try {
    const res = await fetch(LEADERBOARD_URL, {
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) return getCachedScores()
    const data = await res.json()
    const scores = (Array.isArray(data) ? data : [])
      .sort((a: HighScoreEntry, b: HighScoreEntry) => b.score - a.score)
      .slice(0, 5)
    setCachedScores(scores)
    return scores
  } catch {
    return getCachedScores()
  }
}

// Save score globally (read → merge → write)
async function saveHighScoreGlobal(entry: HighScoreEntry): Promise<HighScoreEntry[]> {
  try {
    const current = await fetchHighScores()
    const merged = [...current, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
    await fetch(LEADERBOARD_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merged),
    })
    setCachedScores(merged)
    return merged
  } catch {
    // Fallback: save locally
    const cached = [...getCachedScores(), entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
    setCachedScores(cached)
    return cached
  }
}

function isNewHighScore(score: number): boolean {
  if (score === 0) return false
  const scores = getCachedScores()
  return scores.length < 5 || score > scores[scores.length - 1].score
}

// ═══════════════════════════════════════════════════════════════
// Procedural NBA basketball texture (canvas-based)
// ═══════════════════════════════════════════════════════════════

function createBasketballTexture(): THREE.CanvasTexture {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // ── Base: warm Wilson orange with subtle radial gradient ──
  const grad = ctx.createRadialGradient(size * 0.45, size * 0.4, size * 0.1, size * 0.5, size * 0.5, size * 0.7)
  grad.addColorStop(0, '#d4702a')  // lighter center
  grad.addColorStop(1, '#b85518')  // darker edges
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)

  // ── Leather grain: warm micro-noise ──
  for (let i = 0; i < 40000; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const v = Math.random() * 24 - 12
    const r = Math.min(255, Math.max(0, 200 + v))
    const g = Math.min(255, Math.max(0, 100 + v * 0.55))
    const b = Math.min(255, Math.max(0, 36 + v * 0.25))
    ctx.fillStyle = `rgb(${r},${g},${b})`
    ctx.fillRect(x, y, 1.8, 1.8)
  }

  // ── Pebble dots: dense, prominent, uniform coverage ──
  // Two passes: dark dimples then subtle highlights
  for (let i = 0; i < 12000; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const r = 1.4 + Math.random() * 0.8
    ctx.fillStyle = `rgba(0,0,0,${0.12 + Math.random() * 0.08})`
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  for (let i = 0; i < 6000; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    ctx.fillStyle = `rgba(255,200,140,${0.06 + Math.random() * 0.04})`
    ctx.beginPath()
    ctx.arc(x, y, 1.0, 0, Math.PI * 2)
    ctx.fill()
  }

  // ── Seam channels: wide dark groove with lighter edge ──
  function drawSeam(drawFn: () => void, width: number) {
    ctx.strokeStyle = '#7a3a0e'
    ctx.lineWidth = width + 3
    ctx.lineCap = 'round'
    drawFn()
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = width
    drawFn()
  }

  // 1. Horizontal seam (equator)
  drawSeam(() => {
    ctx.beginPath()
    ctx.moveTo(0, size / 2)
    ctx.lineTo(size, size / 2)
    ctx.stroke()
  }, 7)

  // 2. Vertical seam (pole to pole)
  drawSeam(() => {
    ctx.beginPath()
    ctx.moveTo(size / 2, 0)
    ctx.lineTo(size / 2, size)
    ctx.stroke()
  }, 7)

  // 3-8. Six curved ribs — 3 on each side of the vertical seam
  // Inner curves (close to vertical, tight arc)
  drawSeam(() => {
    ctx.beginPath()
    ctx.moveTo(size * 0.35, size * 0.05)
    ctx.bezierCurveTo(size * 0.2, size * 0.35, size * 0.2, size * 0.65, size * 0.35, size * 0.95)
    ctx.stroke()
  }, 6)
  drawSeam(() => {
    ctx.beginPath()
    ctx.moveTo(size * 0.65, size * 0.05)
    ctx.bezierCurveTo(size * 0.8, size * 0.35, size * 0.8, size * 0.65, size * 0.65, size * 0.95)
    ctx.stroke()
  }, 6)

  // Middle curves (wider arc)
  drawSeam(() => {
    ctx.beginPath()
    ctx.moveTo(size * 0.15, size * 0.05)
    ctx.bezierCurveTo(size * 0.04, size * 0.35, size * 0.04, size * 0.65, size * 0.15, size * 0.95)
    ctx.stroke()
  }, 6)
  drawSeam(() => {
    ctx.beginPath()
    ctx.moveTo(size * 0.85, size * 0.05)
    ctx.bezierCurveTo(size * 0.96, size * 0.35, size * 0.96, size * 0.65, size * 0.85, size * 0.95)
    ctx.stroke()
  }, 6)

  // Outer curves (near edges — back of ball, wrapping around)
  drawSeam(() => {
    ctx.beginPath()
    ctx.moveTo(size * 0.02, size * 0.15)
    ctx.bezierCurveTo(size * -0.08, size * 0.38, size * -0.08, size * 0.62, size * 0.02, size * 0.85)
    ctx.stroke()
  }, 5)
  drawSeam(() => {
    ctx.beginPath()
    ctx.moveTo(size * 0.98, size * 0.15)
    ctx.bezierCurveTo(size * 1.08, size * 0.38, size * 1.08, size * 0.62, size * 0.98, size * 0.85)
    ctx.stroke()
  }, 5)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

function createBasketballBumpMap(): THREE.CanvasTexture {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Neutral grey base
  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, size, size)

  // Pebble bumps: white dots = raised
  for (let i = 0; i < 14000; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const r = 1.2 + Math.random() * 0.8
    ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.2})`
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  // Seam grooves: dark = recessed (all 8 lines)
  ctx.strokeStyle = '#333'
  ctx.lineCap = 'round'

  ctx.lineWidth = 10
  ctx.beginPath(); ctx.moveTo(0, size / 2); ctx.lineTo(size, size / 2); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(size / 2, 0); ctx.lineTo(size / 2, size); ctx.stroke()

  ctx.lineWidth = 8
  // Inner curves
  ctx.beginPath()
  ctx.moveTo(size * 0.35, size * 0.05)
  ctx.bezierCurveTo(size * 0.2, size * 0.35, size * 0.2, size * 0.65, size * 0.35, size * 0.95)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(size * 0.65, size * 0.05)
  ctx.bezierCurveTo(size * 0.8, size * 0.35, size * 0.8, size * 0.65, size * 0.65, size * 0.95)
  ctx.stroke()
  // Middle curves
  ctx.beginPath()
  ctx.moveTo(size * 0.15, size * 0.05)
  ctx.bezierCurveTo(size * 0.04, size * 0.35, size * 0.04, size * 0.65, size * 0.15, size * 0.95)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(size * 0.85, size * 0.05)
  ctx.bezierCurveTo(size * 0.96, size * 0.35, size * 0.96, size * 0.65, size * 0.85, size * 0.95)
  ctx.stroke()
  // Outer curves (back of ball)
  ctx.lineWidth = 7
  ctx.beginPath()
  ctx.moveTo(size * 0.02, size * 0.15)
  ctx.bezierCurveTo(size * -0.08, size * 0.38, size * -0.08, size * 0.62, size * 0.02, size * 0.85)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(size * 0.98, size * 0.15)
  ctx.bezierCurveTo(size * 1.08, size * 0.38, size * 1.08, size * 0.62, size * 0.98, size * 0.85)
  ctx.stroke()

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

// Create once, share across all balls
let _ballTexture: THREE.CanvasTexture | null = null
let _ballBump: THREE.CanvasTexture | null = null
function getBasketballTexture() {
  if (!_ballTexture) _ballTexture = createBasketballTexture()
  return _ballTexture
}
function getBasketballBump() {
  if (!_ballBump) _ballBump = createBasketballBumpMap()
  return _ballBump
}

// Scene constants (Three.js Y-up)
const GRAVITY = 9.81

const RAMP = {
  frontZ: 0,
  frontY: 0.05,
  backZ: -4,
  backY: 1.5,
}

const BACKBOARD = {
  xMin: -0.6491,
  xMax: 0.6491,
  yMin: 2.4254,
  yMax: 2.9645,
  z: -2.5268,
}

const RIM = {
  center: new THREE.Vector3(0, 2.2788, -2.2507),
  radius: 0.2419,
  tubeThickness: 0.02,
}

// Ramp surface Y at a given Z (Three.js coords)
function rampSurfaceY(z: number) {
  return 0.05 + (-z / 4) * 1.45
}

// Randomize spawn so balls settle naturally instead of a clean grid
function randomSpawns() {
  const basePositions = [
    [-0.25, -1.05],
    [0.05, -1.15],
    [0.30, -1.00],
    [-0.15, -1.35],
    [0.10, -1.40],
    [0.35, -1.30],
  ]
  return basePositions.map(([x, z]) => {
    const rx = x + (Math.random() - 0.5) * 0.15
    const rz = z + (Math.random() - 0.5) * 0.12
    // Drop from above so they bounce and settle randomly
    const ry = rampSurfaceY(rz) + 0.1367 + 0.3 + Math.random() * 0.4
    return new THREE.Vector3(rx, ry, rz)
  })
}

const BALL = {
  radius: 0.1367,
  spawns: randomSpawns(),
}

const SHOT_METER = {
  MAX_HOLD: 1.2,
  PERFECT_HOLD: 0.85,
  VISUAL_SPEED: 1.2, // meter animation fills 1.2x faster; power unchanged
  TOLERANCE: 0.05,
}

function computeShotVelocity(fromPos: THREE.Vector3, aimOffsetX = 0, apexAboveRim = 0.6) {
  const dx = (RIM.center.x + aimOffsetX) - fromPos.x
  const dy = RIM.center.y - fromPos.y
  const dz = RIM.center.z - fromPos.z

  const peakAboveStart = dy + apexAboveRim
  const vy = Math.sqrt(2 * GRAVITY * peakAboveStart)

  const tAscent = vy / GRAVITY
  const tDescent = Math.sqrt((2 * apexAboveRim) / GRAVITY)
  const tof = tAscent + tDescent

  return { x: dx / tof, y: vy, z: dz / tof }
}

function holdToPower(holdDuration: number) {
  // Perfect hold (0.85s) → 1.0. Deviation is 65% as punishing as raw ratio.
  const raw = holdDuration / SHOT_METER.PERFECT_HOLD
  return Math.max(0.4, 0.35 + raw * 0.65)
}

function getDifficulty(timeLeft: number) {
  return timeLeft <= 15 ? 1 + (15 - timeLeft) / 15 : 1 // 1.0 → 2.0 in last 15s
}

function isPerfect(holdDuration: number, timeLeft = 30) {
  const tol = SHOT_METER.TOLERANCE / getDifficulty(timeLeft)
  return Math.abs(holdDuration - SHOT_METER.PERFECT_HOLD) < tol
}

function Environment() {
  const rampLen = Math.hypot(RAMP.backZ - RAMP.frontZ, RAMP.backY - RAMP.frontY)
  const rampAngle = Math.atan2(RAMP.backY - RAMP.frontY, RAMP.frontZ - RAMP.backZ)

  return (
    <>
      <RigidBody type="fixed" friction={0.4} restitution={0.3}>
        <CuboidCollider
          args={[1.0, 0.05, rampLen / 2]}
          position={[0, (RAMP.frontY + RAMP.backY) / 2, (RAMP.frontZ + RAMP.backZ) / 2]}
          rotation={[rampAngle, 0, 0]}
        />
      </RigidBody>

      {/* Front bumper — tall invisible wall catches balls bouncing back */}
      <RigidBody type="fixed" friction={0.5} restitution={0.3}>
        <CuboidCollider
          args={[1.0, 1.5, 0.05]}
          position={[0, rampSurfaceY(-0.8) + 1.5, -0.8]}
        />
      </RigidBody>

      <RigidBody type="fixed" friction={0.5} restitution={0.5}>
        <CuboidCollider args={[0.05, 2, 2]} position={[-1.05, 2, -2]} />
      </RigidBody>

      <RigidBody type="fixed" friction={0.5} restitution={0.5}>
        <CuboidCollider args={[0.05, 2, 2]} position={[1.05, 2, -2]} />
      </RigidBody>

      <RigidBody type="fixed" friction={0.5} restitution={0.5}>
        <CuboidCollider args={[1, 2, 0.05]} position={[0, 2, -4.05]} />
      </RigidBody>

      <RigidBody type="fixed" friction={0.3} restitution={0.3}>
        <CuboidCollider args={[1, 0.05, 2]} position={[0, 4.05, -2]} />
      </RigidBody>

      <RigidBody type="fixed" friction={0.5} restitution={0.55}>
        <CuboidCollider
          args={[(BACKBOARD.xMax - BACKBOARD.xMin) / 2, (BACKBOARD.yMax - BACKBOARD.yMin) / 2, 0.02]}
          position={[0, (BACKBOARD.yMin + BACKBOARD.yMax) / 2, BACKBOARD.z - 0.02]}
        />
      </RigidBody>

      <RigidBody type="fixed" friction={0.3} restitution={0.55}>
        {Array.from({ length: 16 }).map((_, i) => {
          const theta = (i / 16) * Math.PI * 2
          return (
            <BallCollider
              key={i}
              args={[RIM.tubeThickness]}
              position={[
                RIM.center.x + Math.cos(theta) * RIM.radius,
                RIM.center.y,
                RIM.center.z + Math.sin(theta) * RIM.radius,
              ]}
            />
          )
        })}
      </RigidBody>
    </>
  )
}

type BallState = 'READY' | 'SELECTED' | 'FLYING' | 'ROLLING'

// Height the selected ball floats above the ramp
const SELECTED_LIFT = 0.6

interface SwishImpact {
  count: number
  ballX: number       // ball X offset from rim center at entry
  ballZ: number       // ball Z offset from rim center at entry
  speed: number       // ball speed at entry
}

interface BallsProps {
  ballRefs: React.MutableRefObject<(RapierRigidBody | null)[]>
  ballStates: React.MutableRefObject<BallState[]>
  selectedBall: React.MutableRefObject<number>
  onBallClick: (index: number) => void
  onScore: (ballX: number, ballZ: number, speed: number) => void
}

function Balls({ ballRefs, ballStates, selectedBall, onBallClick, onScore }: BallsProps) {
  const prevY = useRef<number[]>(BALL.spawns.map((p) => p.y))
  const settleFrames = useRef<number[]>(BALL.spawns.map(() => 0))
  const hasKicked = useRef(false)
  const lastContactSound = useRef(0)

  const handleContactForce = useCallback((i: number, force: number) => {
    if (ballStates.current[i] === 'READY' || ballStates.current[i] === 'SELECTED') return
    const now = performance.now()
    if (now - lastContactSound.current < 60) return // debounce
    lastContactSound.current = now

    const body = ballRefs.current[i]
    if (!body) return
    const t = body.translation()
    // Near the rim/backboard area?
    const nearRim = Math.abs(t.y - RIM.center.y) < 0.4 && t.z < RIM.center.z + 0.3 && t.z > RIM.center.z - 0.5
    if (nearRim && force > 0.5) {
      playRimHit(force)
    } else if (force > 0.3) {
      playBounce(force)
    }
  }, [ballRefs, ballStates])

  useFrame(() => {
    // Give balls a small random kick on first frame so they jostle naturally
    if (!hasKicked.current) {
      hasKicked.current = true
      for (let i = 0; i < BALL.spawns.length; i++) {
        const body = ballRefs.current[i]
        if (!body) continue
        body.applyImpulse({
          x: (Math.random() - 0.5) * 0.3,
          y: 0,
          z: (Math.random() - 0.5) * 0.2,
        }, true)
      }
    }

    // Handle SELECTED ball — float it above the cluster
    const selIdx = selectedBall.current
    if (selIdx >= 0) {
      const body = ballRefs.current[selIdx]
      if (body && ballStates.current[selIdx] === 'SELECTED') {
        const t = body.translation()
        const targetY = rampSurfaceY(t.z) + BALL.radius + SELECTED_LIFT
        // Smoothly lerp upward, freeze horizontal
        const newY = t.y + (targetY - t.y) * 0.15
        body.setTranslation({ x: t.x, y: newY, z: t.z }, true)
        body.setLinvel({ x: 0, y: 0, z: 0 }, true)
        body.setAngvel({ x: 0, y: 0, z: 0 }, true)
      }
    }

    for (let i = 0; i < BALL.spawns.length; i++) {
      const body = ballRefs.current[i]
      if (!body) continue

      const t = body.translation()
      const vel = body.linvel()
      const speed = Math.hypot(vel.x, vel.y, vel.z)

      if (
        ballStates.current[i] === 'FLYING' &&
        prevY.current[i] > RIM.center.y &&
        t.y <= RIM.center.y
      ) {
        const dx = t.x - RIM.center.x
        const dz = t.z - RIM.center.z
        if (Math.hypot(dx, dz) < RIM.radius - 0.05) {
          onScore(dx, dz, speed)
        }
      }
      prevY.current[i] = t.y

      if (ballStates.current[i] === 'FLYING' && t.y < 0.8 && speed < 2.5) {
        ballStates.current[i] = 'ROLLING'
      }

      if (ballStates.current[i] === 'ROLLING') {
        if (speed < 0.3) {
          settleFrames.current[i]++
          if (settleFrames.current[i] > 15) {
            ballStates.current[i] = 'READY'
            settleFrames.current[i] = 0
          }
        } else {
          settleFrames.current[i] = 0
        }
      }

      if (t.z > 0.3 || t.y < -0.5) {
        // Respawn with slight randomness so balls don't stack in a grid
        const rx = (Math.random() - 0.5) * 0.5
        const rz = -1.0 + (Math.random() - 0.5) * 0.3
        const safeY = rampSurfaceY(rz) + BALL.radius + 0.2 + Math.random() * 0.3
        body.setTranslation({ x: rx, y: safeY, z: rz }, true)
        body.setLinvel({ x: (Math.random() - 0.5) * 0.5, y: 0, z: 0 }, true)
        body.setAngvel({ x: 0, y: 0, z: 0 }, true)
        ballStates.current[i] = 'ROLLING'
      }
    }
  })

  return (
    <>
      {BALL.spawns.map((pos, i) => (
        <RigidBody
          key={i}
          ref={(el: RapierRigidBody | null) => {
            ballRefs.current[i] = el
          }}
          colliders="ball"
          position={[pos.x, pos.y, pos.z]}
          restitution={0.65}
          friction={0.4}
          linearDamping={0.15}
          angularDamping={0.3}
          ccd
          onContactForce={(e: { totalForceMagnitude: number }) => handleContactForce(i, e.totalForceMagnitude)}
        >
          <mesh
            castShadow
            onClick={(e) => {
              e.stopPropagation()
              onBallClick(i)
            }}
            onPointerOver={() => { document.body.style.cursor = ballStates.current[i] === 'READY' ? 'pointer' : 'default' }}
            onPointerOut={() => { document.body.style.cursor = 'default' }}
          >
            <sphereGeometry args={[BALL.radius, 32, 32]} />
            <meshStandardMaterial
              map={getBasketballTexture()}
              roughness={0.82}
              metalness={0.02}
              bumpMap={getBasketballBump()}
              bumpScale={0.035}
              emissive={selectedBall.current === i && ballStates.current[i] === 'SELECTED' ? '#ff4400' : '#000000'}
              emissiveIntensity={selectedBall.current === i ? 0.25 : 0}
            />
          </mesh>
        </RigidBody>
      ))}
    </>
  )
}

// ═══════════════════════════════════════════════════════════════
// Procedural net with spring-based swish animation
// ═══════════════════════════════════════════════════════════════

const NET_RINGS = 8
const NET_SEGMENTS = 16
const NET_HEIGHT = 0.35
const NET_TOP_RADIUS = RIM.radius - 0.015
const NET_BOTTOM_RADIUS = RIM.radius * 0.45

// Distinct swish profiles — picked per shot for visible variety
const SWISH_PROFILES = [
  { name: 'CLEAN',   vertPush: 0.015, yPush: -0.008, swayMag: 0.008, twistMag: 0.015, stiffness: 150, damping: 8,   cascade: 0.018 },
  { name: 'HEAVY',   vertPush: 0.055, yPush: -0.04,  swayMag: 0.045, twistMag: 0.07,  stiffness: 50,  damping: 2,   cascade: 0.055 },
  { name: 'SOFT',    vertPush: 0.022, yPush: -0.018, swayMag: 0.025, twistMag: 0.01,  stiffness: 85,  damping: 4.5, cascade: 0.065 },
  { name: 'RATTLED', vertPush: 0.045, yPush: -0.03,  swayMag: 0.04,  twistMag: 0.1,   stiffness: 45,  damping: 1.8, cascade: 0.03  },
] as const

function pickSwishProfile(speed: number, offsetFromCenter: number) {
  // Weight selection by ball characteristics
  const weights = [1, 1, 1, 1]
  if (speed > 5) { weights[1] += 3 }           // fast → HEAVY
  if (speed < 3) { weights[2] += 3 }           // slow → SOFT
  if (offsetFromCenter < 0.05) { weights[0] += 3 } // dead center → CLEAN
  if (offsetFromCenter > 0.12) { weights[3] += 3 } // off-center → RATTLED
  const total = weights.reduce((a, b) => a + b)
  let r = Math.random() * total
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i]
    if (r <= 0) return SWISH_PROFILES[i]
  }
  return SWISH_PROFILES[0]
}

function Net({ swishImpact }: { swishImpact: SwishImpact }) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const originalPositions = useRef<Float32Array | null>(null)

  // Per-vertex springs
  const vertSprings = useRef<{
    dx: number; dy: number; dz: number
    vx: number; vy: number; vz: number
  }[] | null>(null)

  // Global sway (whole net swings laterally + twists)
  const sway = useRef({
    x: 0, z: 0, vx: 0, vz: 0,
    twist: 0, twistVel: 0,
  })

  const swishTime = useRef<number | null>(null)
  const lastSwishCount = useRef(0)

  // Per-shot resolved parameters
  const shotParams = useRef({
    profile: SWISH_PROFILES[0] as (typeof SWISH_PROFILES)[number],
    impactX: 0,
    impactZ: 0,
    intensity: 1,
    swayDirX: 0,
    swayDirZ: 1,
    twistDir: 1,
  })

  const geometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(
      NET_TOP_RADIUS, NET_BOTTOM_RADIUS, NET_HEIGHT,
      NET_SEGMENTS, NET_RINGS - 1, true,
    )
    const pos = geo.attributes.position.array as Float32Array
    const vertsPerRing = NET_SEGMENTS + 1
    for (let r = 0; r < NET_RINGS; r++) {
      if (r % 2 === 1) {
        const angle = Math.PI / NET_SEGMENTS
        const cosA = Math.cos(angle)
        const sinA = Math.sin(angle)
        for (let s = 0; s <= NET_SEGMENTS; s++) {
          const idx = (r * vertsPerRing + s) * 3
          const x = pos[idx]
          const z = pos[idx + 2]
          pos[idx] = x * cosA - z * sinA
          pos[idx + 2] = x * sinA + z * cosA
        }
      }
    }
    geo.attributes.position.needsUpdate = true
    return geo
  }, [])

  useEffect(() => {
    if (meshRef.current) {
      const posArr = meshRef.current.geometry.attributes.position.array
      originalPositions.current = new Float32Array(posArr)
      const vertCount = posArr.length / 3
      vertSprings.current = Array.from({ length: vertCount }, () => ({
        dx: 0, dy: 0, dz: 0, vx: 0, vy: 0, vz: 0,
      }))
    }
  }, [])

  // On score: pick a swish type, set sway direction, reset springs
  useEffect(() => {
    if (swishImpact.count > lastSwishCount.current) {
      lastSwishCount.current = swishImpact.count
      swishTime.current = performance.now()

      const offset = Math.sqrt(swishImpact.ballX ** 2 + swishImpact.ballZ ** 2)
      const profile = pickSwishProfile(swishImpact.speed, offset)
      const speedFactor = Math.min(swishImpact.speed / 6, 1.5)

      // Sway direction: ball's lateral offset + random perturbation
      const swayAngle = Math.atan2(swishImpact.ballZ, swishImpact.ballX || 0.001) +
        (Math.random() - 0.5) * 0.8
      const twistDir = Math.random() > 0.5 ? 1 : -1

      shotParams.current = {
        profile,
        impactX: swishImpact.ballX,
        impactZ: swishImpact.ballZ,
        intensity: (0.7 + Math.random() * 0.6) * (0.5 + speedFactor * 0.5),
        swayDirX: Math.cos(swayAngle),
        swayDirZ: Math.sin(swayAngle),
        twistDir,
      }

      // Kick the global sway
      const s = sway.current
      s.vx = shotParams.current.swayDirX * profile.swayMag * shotParams.current.intensity * 8
      s.vz = shotParams.current.swayDirZ * profile.swayMag * shotParams.current.intensity * 8
      s.twistVel = twistDir * profile.twistMag * shotParams.current.intensity * 6

      // Reset vertex springs
      vertSprings.current?.forEach((v) => {
        v.dx = 0; v.dy = 0; v.dz = 0
        v.vx = 0; v.vy = 0; v.vz = 0
      })
    }
  }, [swishImpact])

  useFrame((_, delta) => {
    if (!groupRef.current || !meshRef.current || !originalPositions.current || !vertSprings.current) return
    if (swishTime.current === null) return

    const dt = Math.min(delta, 0.033)
    const elapsed = (performance.now() - swishTime.current) / 1000

    // ── Global sway (applied to the group transform) ──
    const s = sway.current
    const swayStiffness = 35
    const swayDamping = 3
    s.vx += (-swayStiffness * s.x - swayDamping * s.vx) * dt
    s.vz += (-swayStiffness * s.z - swayDamping * s.vz) * dt
    s.x += s.vx * dt
    s.z += s.vz * dt
    s.twistVel += (-swayStiffness * s.twist - swayDamping * s.twistVel) * dt
    s.twist += s.twistVel * dt
    groupRef.current.position.x = RIM.center.x + s.x
    groupRef.current.position.z = RIM.center.z + s.z
    groupRef.current.rotation.y = s.twist

    // ── Per-vertex deformation ──
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array
    const orig = originalPositions.current
    const vs = vertSprings.current
    const vertsPerRing = NET_SEGMENTS + 1
    const { profile, impactX, impactZ, intensity } = shotParams.current

    const impactLen = Math.sqrt(impactX * impactX + impactZ * impactZ) || 0.001
    const dirX = impactX / impactLen
    const dirZ = impactZ / impactLen

    let allSettled = true
    const swaySettled = Math.abs(s.x) + Math.abs(s.z) + Math.abs(s.vx) + Math.abs(s.vz) +
      Math.abs(s.twist) + Math.abs(s.twistVel) < 0.001

    if (!swaySettled) allSettled = false

    for (let r = 0; r < NET_RINGS; r++) {
      const ringTime = elapsed - r * profile.cascade
      if (ringTime < 0) { allSettled = false; continue }

      const ringDepth = r / (NET_RINGS - 1)
      // Top ring (r=0) is anchored to the rim — barely moves
      const anchorFactor = r === 0 ? 0.1 : (0.3 + ringDepth * 0.7)
      const ringStiffness = profile.stiffness * (1.2 - ringDepth * 0.6)
      const ringDamping = profile.damping * (1 - ringDepth * 0.3)

      for (let seg = 0; seg <= NET_SEGMENTS; seg++) {
        const vi = r * vertsPerRing + seg
        const idx = vi * 3
        const ox = orig[idx]
        const oy = orig[idx + 1]
        const oz = orig[idx + 2]
        const spring = vs[vi]

        const vertLen = Math.sqrt(ox * ox + oz * oz)
        if (vertLen < 0.001) continue

        const nx = ox / vertLen
        const nz = oz / vertLen

        // Initial push on first frame for this ring
        if (ringTime < dt * 2 && spring.dx === 0 && spring.dy === 0 && spring.dz === 0) {
          const dotImpact = nx * dirX + nz * dirZ
          // Asymmetric: near-side gets 1.0, far-side gets 0.15
          const directional = 0.15 + 0.85 * Math.max(0, dotImpact)

          // Per-vertex jitter — wide range for visible variation
          const jitter = 0.4 + Math.random() * 1.2

          const pushMag = profile.vertPush * intensity * anchorFactor * directional * jitter
          const yMag = profile.yPush * intensity * anchorFactor * directional * jitter

          // Push biased toward impact direction (70%) + radially outward (30%)
          spring.dx = (nx * 0.3 + dirX * 0.7) * pushMag
          spring.dz = (nz * 0.3 + dirZ * 0.7) * pushMag
          spring.dy = yMag
        }

        const fx = -ringStiffness * spring.dx - ringDamping * spring.vx
        const fy = -ringStiffness * spring.dy - ringDamping * spring.vy
        const fz = -ringStiffness * spring.dz - ringDamping * spring.vz
        spring.vx += fx * dt; spring.dx += spring.vx * dt
        spring.vy += fy * dt; spring.dy += spring.vy * dt
        spring.vz += fz * dt; spring.dz += spring.vz * dt

        const energy = Math.abs(spring.dx) + Math.abs(spring.dy) + Math.abs(spring.dz) +
                       Math.abs(spring.vx) + Math.abs(spring.vy) + Math.abs(spring.vz)
        if (energy < 0.0002) {
          spring.dx = 0; spring.dy = 0; spring.dz = 0
          spring.vx = 0; spring.vy = 0; spring.vz = 0
        } else {
          allSettled = false
        }

        positions[idx] = ox + spring.dx
        positions[idx + 1] = oy + spring.dy
        positions[idx + 2] = oz + spring.dz
      }
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true

    if (allSettled && swaySettled && elapsed > NET_RINGS * profile.cascade + 2) {
      swishTime.current = null
      // Reset sway to rest
      s.x = 0; s.z = 0; s.vx = 0; s.vz = 0
      s.twist = 0; s.twistVel = 0
      groupRef.current.position.x = RIM.center.x
      groupRef.current.position.z = RIM.center.z
      groupRef.current.rotation.y = 0
    }
  })

  return (
    <group ref={groupRef} position={[RIM.center.x, RIM.center.y - NET_HEIGHT / 2 - 0.01, RIM.center.z]}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color="#f0f0f0"
          wireframe
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════
// Arcade environment: tiled brick walls + neon backboard frame
// ═══════════════════════════════════════════════════════════════

function createBrickTexture(): THREE.CanvasTexture {
  const s = 512
  const canvas = document.createElement('canvas')
  canvas.width = s; canvas.height = s
  const ctx = canvas.getContext('2d')!

  // Mortar base — varied tone
  const mortarBase = 48 + Math.random() * 12
  ctx.fillStyle = `rgb(${mortarBase},${mortarBase - 6},${mortarBase - 10})`
  ctx.fillRect(0, 0, s, s)

  // Mortar grit
  for (let i = 0; i < 3000; i++) {
    const v = Math.random() * 0.08
    ctx.fillStyle = `rgba(${Math.random() > 0.5 ? 255 : 0},${Math.random() > 0.5 ? 255 : 0},${Math.random() > 0.5 ? 255 : 0},${v})`
    ctx.fillRect(Math.random() * s, Math.random() * s, 1 + Math.random() * 2, 1 + Math.random() * 2)
  }

  // Brick rows with varied heights
  const nominalH = 32
  let y = 0
  let row = 0
  while (y < s + nominalH) {
    const rowH = nominalH + Math.floor((Math.random() - 0.5) * 12) // 26–38px
    const gap = 2 + Math.floor(Math.random() * 3) // 2–4px mortar
    const baseOff = (row % 2) * 32 + (Math.random() - 0.5) * 10 // staggered with more jitter

    // Build bricks with varied widths across this row
    let x = -80 + baseOff
    while (x < s + 80) {
      const bW = 48 + Math.floor(Math.random() * 40) // 48–88px wide — much more variation
      const bx = x + gap
      const by = y + gap
      const bw = bW - gap * 2
      const bh = rowH - gap * 2

      if (bw > 4 && bh > 4) {
        // Single red-brick family with natural tonal variation
        const base = 100 + Math.random() * 55
        const r = Math.min(255, base + 20 + Math.random() * 18)
        const g = Math.min(255, base * 0.38 + Math.random() * 12)
        const b = Math.min(255, base * 0.28 + Math.random() * 8)

        ctx.fillStyle = `rgb(${r},${g},${b})`
        ctx.fillRect(bx, by, bw, bh)

        // Subtle gradient — lighter top edge, darker bottom
        const grad = ctx.createLinearGradient(bx, by, bx, by + bh)
        grad.addColorStop(0, `rgba(255,255,255,${0.03 + Math.random() * 0.06})`)
        grad.addColorStop(0.5, 'rgba(0,0,0,0)')
        grad.addColorStop(1, `rgba(0,0,0,${0.05 + Math.random() * 0.08})`)
        ctx.fillStyle = grad
        ctx.fillRect(bx, by, bw, bh)

        // Weathering noise — specks
        const speckCount = 8 + Math.floor(Math.random() * 16)
        for (let n = 0; n < speckCount; n++) {
          const dark = Math.random() > 0.3
          ctx.fillStyle = dark
            ? `rgba(0,0,0,${0.04 + Math.random() * 0.12})`
            : `rgba(255,255,240,${0.03 + Math.random() * 0.06})`
          ctx.fillRect(
            bx + Math.random() * bw,
            by + Math.random() * bh,
            1 + Math.random() * 3, 1 + Math.random() * 2,
          )
        }

        // Occasional crack line (~10% of bricks)
        if (Math.random() < 0.1) {
          ctx.strokeStyle = `rgba(0,0,0,${0.15 + Math.random() * 0.15})`
          ctx.lineWidth = 0.5 + Math.random()
          ctx.beginPath()
          const cx = bx + bw * (0.2 + Math.random() * 0.6)
          const cy = by + bh * (0.2 + Math.random() * 0.6)
          ctx.moveTo(cx, cy)
          ctx.lineTo(cx + (Math.random() - 0.5) * bw * 0.6, cy + (Math.random() - 0.5) * bh * 0.8)
          ctx.stroke()
        }

        // Occasional stain/discoloration (~8% of bricks)
        if (Math.random() < 0.08) {
          ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '40,35,30' : '80,70,55'},${0.1 + Math.random() * 0.15})`
          const sx = bx + Math.random() * bw * 0.5
          const sy = by + Math.random() * bh * 0.3
          ctx.fillRect(sx, sy, bw * (0.3 + Math.random() * 0.5), bh * (0.3 + Math.random() * 0.5))
        }
      }

      x += bW
    }
    y += rowH
    row++
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  return tex
}

let _brickTex: THREE.CanvasTexture | null = null
function getBrickTexture() {
  if (!_brickTex) _brickTex = createBrickTexture()
  return _brickTex
}

function ArcadeWalls() {
  const baseTex = getBrickTexture()

  const walls = useMemo(() => {
    const defs: { pos: [number, number, number]; rot: [number, number, number]; w: number; h: number }[] = [
      { pos: [-0.95, 2, -2], rot: [0, Math.PI / 2, 0], w: 4.5, h: 4.5 },   // left
      { pos: [0.95, 2, -2], rot: [0, -Math.PI / 2, 0], w: 4.5, h: 4.5 },    // right
      { pos: [0, 2, -3.95], rot: [0, 0, 0], w: 2.5, h: 4.5 },               // back
      { pos: [0, 3.95, -2], rot: [Math.PI / 2, 0, 0], w: 2.5, h: 4.5 },     // ceiling
    ]
    return defs.map(({ pos, rot, w, h }) => {
      const t = baseTex.clone()
      t.wrapS = THREE.RepeatWrapping
      t.wrapT = THREE.RepeatWrapping
      t.repeat.set(w * 0.47, h * 0.47) // scaled up ~1.5x
      const mat = new THREE.MeshStandardMaterial({
        map: t, roughness: 0.92, bumpMap: t, bumpScale: 0.012,
      })
      return { pos, rot, w, h, mat }
    })
  }, [baseTex])

  return (
    <>
      {walls.map((wall, i) => (
        <mesh key={i} position={wall.pos} rotation={wall.rot} material={wall.mat}>
          <planeGeometry args={[wall.w, wall.h]} />
        </mesh>
      ))}
    </>
  )
}

function NeonBackboardFrame() {
  // Inset so the neon sits ON the backboard face
  const inset = 0.04
  const x0 = BACKBOARD.xMin + inset
  const x1 = BACKBOARD.xMax - inset
  const y0 = BACKBOARD.yMin - 0.14  // extend further below backboard edge
  const y1 = BACKBOARD.yMax - inset
  const z = BACKBOARD.z + 0.015 // flush against the board surface

  const w = x1 - x0
  const h = y1 - y0
  const t = 0.024 // tube thickness
  const d = 0.024 // tube depth
  const cx = (x0 + x1) / 2
  const cy = (y0 + y1) / 2

  return (
    <group>
      {/* 4 straight bars — sharp 90° rectangle */}
      {/* Bottom */}
      <mesh position={[cx, y0, z]}>
        <boxGeometry args={[w + t, t, d]} />
        <meshBasicMaterial color="#4499ff" toneMapped={false} />
      </mesh>
      {/* Top */}
      <mesh position={[cx, y1, z]}>
        <boxGeometry args={[w + t, t, d]} />
        <meshBasicMaterial color="#4499ff" toneMapped={false} />
      </mesh>
      {/* Left */}
      <mesh position={[x0, cy, z]}>
        <boxGeometry args={[t, h, d]} />
        <meshBasicMaterial color="#4499ff" toneMapped={false} />
      </mesh>
      {/* Right */}
      <mesh position={[x1, cy, z]}>
        <boxGeometry args={[t, h, d]} />
        <meshBasicMaterial color="#4499ff" toneMapped={false} />
      </mesh>

      {/* Neon light emission — multiple point lights along the frame for realistic spread */}
      {/* Center fill */}
      <pointLight position={[cx, cy, z + 0.2]} color="#3388ff" intensity={3} distance={3} decay={2} />
      {/* Top edge */}
      <pointLight position={[cx, y1, z + 0.12]} color="#4499ff" intensity={1.5} distance={1.8} decay={2} />
      {/* Bottom edge — spills down toward the hoop */}
      <pointLight position={[cx, y0, z + 0.15]} color="#4499ff" intensity={2} distance={2} decay={2} />
      {/* Left corner */}
      <pointLight position={[x0, cy, z + 0.12]} color="#4499ff" intensity={1.2} distance={1.5} decay={2} />
      {/* Right corner */}
      <pointLight position={[x1, cy, z + 0.12]} color="#4499ff" intensity={1.2} distance={1.5} decay={2} />
    </group>
  )
}

// String lights along the floor edges — small glowing bulbs on a wire
function NeonFloorStrips() {
  const bulbColor = '#ff4400'
  const wireColor = '#331100'
  const xLeft = -0.85
  const xRight = 0.85
  const zFront = -0.2
  const zBack = -1.9
  const bulbCount = 14
  const bulbRadius = 0.018
  const wireThickness = 0.005

  // Build bulb positions along the ramp on each side
  const bulbs = useMemo(() => {
    const positions: [number, number, number][] = []
    for (let i = 0; i < bulbCount; i++) {
      const t = i / (bulbCount - 1)
      const z = zFront + t * (zBack - zFront)
      const y = rampSurfaceY(z) + bulbRadius + 0.005
      positions.push([0, y, z])
    }
    return positions
  }, [])

  // Wire: a thin box connecting front to back along the ramp
  const stripLen = Math.abs(zBack - zFront)
  const zMid = (zFront + zBack) / 2
  const yFront = rampSurfaceY(zFront) + 0.008
  const yBack = rampSurfaceY(zBack) + 0.008
  const yMid = (yFront + yBack) / 2
  const angle = Math.atan2(yBack - yFront, stripLen)

  const side = (xPos: number) => (
    <group>
      {/* Wire */}
      <mesh position={[xPos, yMid, zMid]} rotation={[-angle, 0, 0]}>
        <boxGeometry args={[wireThickness, wireThickness, stripLen]} />
        <meshBasicMaterial color={wireColor} />
      </mesh>
      {/* Bulbs */}
      {bulbs.map(([, y, z], i) => (
        <mesh key={i} position={[xPos, y, z]}>
          <sphereGeometry args={[bulbRadius, 8, 8]} />
          <meshBasicMaterial color={bulbColor} toneMapped={false} />
        </mesh>
      ))}
      {/* Lights — every 4th bulb emits a point light to keep perf reasonable */}
      {bulbs.filter((_, i) => i % 4 === 0).map(([, y, z], i) => (
        <pointLight key={i} position={[xPos, y + 0.05, z]} color="#ff3300" intensity={0.6} distance={1} decay={2} />
      ))}
    </group>
  )

  return (
    <group>
      {side(xLeft)}
      {side(xRight)}
    </group>
  )
}

function Court() {
  const { scene } = useGLTF('/models/basketball.glb')
  // Hide the built-in scoreboard from the GLB — we use our own HUD
  const scoreboard = scene.getObjectByName('Scoreboard')
  if (scoreboard) scoreboard.visible = false
  const gameTitle = scene.getObjectByName('GameTitle')
  if (gameTitle) gameTitle.visible = false
  return <primitive object={scene} />
}

function Scene({
  ballRefs,
  ballStates,
  selectedBall,
  onBallClick,
  onScore,
  swishImpact,
}: {
  ballRefs: React.MutableRefObject<(RapierRigidBody | null)[]>
  ballStates: React.MutableRefObject<BallState[]>
  selectedBall: React.MutableRefObject<number>
  onBallClick: (index: number) => void
  onScore: (ballX: number, ballZ: number, speed: number) => void
  swishImpact: SwishImpact
}) {
  return (
    <>
      {/* Fog — pulls in tighter for darker atmosphere */}
      <fog attach="fog" args={['#050508', 1.8, 4.5]} />

      {/* Dark arcade lighting — neons do the heavy lifting */}
      <ambientLight intensity={0.1} color="#667788" />
      <pointLight position={[0, 3.5, -2.3]} intensity={1.5} color="#ffeedd" distance={4} decay={2} />
      <pointLight position={[0, 1.5, -0.5]} intensity={0.4} color="#ffddaa" distance={3} decay={2} />
      <directionalLight position={[1, 4, 1]} intensity={0.1} />

      <Court />
      <ArcadeWalls />
      <NeonBackboardFrame />
      <NeonFloorStrips />
      <Net swishImpact={swishImpact} />

      <Physics gravity={[0, -GRAVITY, 0]}>
        <Environment />
        <Balls
          ballRefs={ballRefs}
          ballStates={ballStates}
          selectedBall={selectedBall}
          onBallClick={onBallClick}
          onScore={onScore}
        />
      </Physics>
    </>
  )
}

export default function Basketball3DGame({ onClose }: { onClose?: () => void }) {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isPlaying, setIsPlaying] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [showInstructions, setShowInstructions] = useState(false)

  const ballRefs = useRef<(RapierRigidBody | null)[]>([])
  const ballStates = useRef<BallState[]>(BALL.spawns.map(() => 'READY' as BallState))
  const selectedBall = useRef<number>(-1)
  const holdStart = useRef<number | null>(null)

  const [_holdDuration, setHoldDuration] = useState(0)
  const [chargePower, setChargePower] = useState(0)
  const [lastShot, setLastShot] = useState<'PERFECT' | 'MADE' | 'MISS' | null>(null)
  const [hasBallSelected, setHasBallSelected] = useState(false)
  const [swishImpact, setSwishImpact] = useState<SwishImpact>({ count: 0, ballX: 0, ballZ: 0, speed: 0 })

  // Streak tracking
  const [streak, setStreak] = useState(0)
  const streakRef = useRef(0)
  const shotFired = useRef(false)
  const wasPerfectRelease = useRef(false)
  const [lastPoints, setLastPoints] = useState(0)

  // Aim oscillator
  const aimRef = useRef(0)
  const [_aimDisplay, setAimDisplay] = useState(0)
  const timeLeftRef = useRef(30)

  // High scores
  const [highScores, setHighScores] = useState<HighScoreEntry[]>(getCachedScores())

  // Fetch global leaderboard on mount
  useEffect(() => {
    fetchHighScores().then(setHighScores)
  }, [])
  const [showInitialsEntry, setShowInitialsEntry] = useState(false)
  const [initials, setInitials] = useState('')
  const topScore = highScores.length > 0 ? highScores[0].score : 0

  // Reset all balls to spawn positions
  const resetBalls = useCallback(() => {
    for (let i = 0; i < BALL.spawns.length; i++) {
      ballStates.current[i] = 'READY'
      const body = ballRefs.current[i]
      if (body) {
        const spawn = BALL.spawns[i]
        body.setTranslation({ x: spawn.x, y: spawn.y + 0.3, z: spawn.z }, true)
        body.setLinvel({ x: (Math.random() - 0.5) * 0.3, y: 0, z: 0 }, true)
        body.setAngvel({ x: 0, y: 0, z: 0 }, true)
      }
    }
    selectedBall.current = -1
    setHasBallSelected(false)
  }, [])

  // Countdown timer: 3 → 2 → 1 → GO → start game
  const [showGo, setShowGo] = useState(false)
  useEffect(() => {
    if (countdown === null) return
    if (countdown === 0) {
      playGoBeep()
      setShowGo(true)
      setTimeout(() => setShowGo(false), 600)
      setCountdown(null)
      setIsPlaying(true)
      return
    }
    playCountdownBeep()
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [isPlaying, timeLeft])

  // Sound effects for final countdown
  useEffect(() => {
    if (!isPlaying) return
    if (timeLeft === 0) {
      // Pac-Man death if score < 10, normal buzzer otherwise
      if (score < 10) {
        playPacManDeath()
      } else {
        playBuzzer()
      }
    } else if (timeLeft <= 5) {
      playUrgentTick()
    } else if (timeLeft <= 10) {
      playTickSound()
    }
  }, [timeLeft, isPlaying, score])

  // Confetti
  const [showConfetti, setShowConfetti] = useState(false)

  // Lock shooting when timer reaches 0
  useEffect(() => {
    if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false)
      holdStart.current = null
      setHoldDuration(0)
      setChargePower(0)
      selectedBall.current = -1
      setHasBallSelected(false)
      // Check for high score after a brief delay so final score renders
      setTimeout(() => {
        if (isNewHighScore(score)) {
          setShowInitialsEntry(true)
          setShowConfetti(true)
          playCrowdCheer()
        }
      }, 300)
    }
  }, [timeLeft, isPlaying, score])

  // Step 1: Click a ball to select it (handled via onBallClick from R3F mesh)
  function handleBallClick(index: number) {
    if (!isPlaying) return
    if (ballStates.current[index] !== 'READY') return

    // Deselect previous ball if any
    if (selectedBall.current >= 0 && selectedBall.current !== index) {
      ballStates.current[selectedBall.current] = 'READY'
    }

    // Select this ball — it will float up in useFrame
    selectedBall.current = index
    ballStates.current[index] = 'SELECTED'
    setHasBallSelected(true)
  }

  // Step 2: Charging is handled by the overlay div (see JSX below)
  // No window event listeners needed — the overlay captures mouse directly
  function startCharging() {
    if (!isPlaying || selectedBall.current < 0) return
    if (ballStates.current[selectedBall.current] !== 'SELECTED') return
    holdStart.current = performance.now()
  }

  function stopCharging() {
    if (holdStart.current === null) return
    const duration = (performance.now() - holdStart.current) / 1000
    holdStart.current = null
    // Scale by visual speed so power matches what the meter shows
    releaseShot(duration * SHOT_METER.VISUAL_SPEED)
  }

  useEffect(() => { timeLeftRef.current = timeLeft }, [timeLeft])

  useEffect(() => {
    let raf: number
    const tick = () => {
      // Aim disabled — power-only mechanic
      aimRef.current = 0

      if (holdStart.current !== null) {
        const duration = (performance.now() - holdStart.current) / 1000
        const visualDuration = duration * SHOT_METER.VISUAL_SPEED
        setHoldDuration(visualDuration)
        setChargePower(Math.min((visualDuration / SHOT_METER.MAX_HOLD) * 100, 100))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  function releaseShot(duration: number) {
    setHoldDuration(0)
    setChargePower(0)

    // If previous shot didn't score, reset streak
    if (shotFired.current) {
      streakRef.current = 0
      setStreak(0)
    }
    shotFired.current = true
    wasPerfectRelease.current = isPerfect(duration, timeLeft)

    const idx = selectedBall.current
    if (idx < 0 || ballStates.current[idx] !== 'SELECTED') return

    const body = ballRefs.current[idx]
    if (!body) return

    const t = body.translation()
    const fromPos = new THREE.Vector3(t.x, t.y, t.z)
    const aimOffset = aimRef.current
    const v = computeShotVelocity(fromPos, aimOffset, 0.6)
    const power = holdToPower(duration)

    body.setLinvel({ x: v.x * power, y: v.y * power, z: v.z * power }, true)
    ballStates.current[idx] = 'FLYING'
    selectedBall.current = -1
    setHasBallSelected(false)
    setAimDisplay(0)
  }

  const handleScore = (ballX: number, ballZ: number, speed: number) => {
    shotFired.current = false
    const perfect = wasPerfectRelease.current
    streakRef.current++
    setStreak(streakRef.current)
    // 2x multiplier kicks in at 3 consecutive makes, capped at 2x
    const multiplier = streakRef.current >= 3 ? 2 : 1
    const points = (perfect ? 3 : 2) * multiplier
    setScore((s) => s + points)
    setLastPoints(points)
    setSwishImpact((prev) => ({ count: prev.count + 1, ballX, ballZ, speed }))
    setLastShot(perfect ? 'PERFECT' : 'MADE')
    setTimeout(() => setLastShot(null), 1500)
    playSwish()
  }

  const meterFill = chargePower
  const difficulty = getDifficulty(timeLeft)
  const effectiveTolerance = SHOT_METER.TOLERANCE / difficulty
  const perfectZoneStart =
    ((SHOT_METER.PERFECT_HOLD - effectiveTolerance) / SHOT_METER.MAX_HOLD) * 100
  const perfectZoneEnd =
    ((SHOT_METER.PERFECT_HOLD + effectiveTolerance) / SHOT_METER.MAX_HOLD) * 100

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#2a2a2a',
      }}
    >
      <button
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '30px',
          cursor: 'pointer',
          zIndex: 10,
        }}
        onClick={() => {
          setIsPlaying(false)
          setCountdown(null)
          setScore(0)
          setTimeLeft(30)
          setStreak(0); streakRef.current = 0; shotFired.current = false
          setShowConfetti(false)
          setShowInitialsEntry(false)
          onClose?.()
        }}
      >
        ×
      </button>

      {/* Instructions button — top left */}
      <button
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(0,0,0,0.7)',
          border: '2px solid #4499ff',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '24px',
          cursor: 'pointer',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#4499ff',
        }}
        onClick={() => setShowInstructions(true)}
        title="How to play"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </button>

      {/* Instructions modal */}
      {showInstructions && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 25,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setShowInstructions(false)}
        >
          <div
            style={{
              background: 'rgba(10,10,20,0.95)',
              border: '2px solid #4499ff',
              borderRadius: '12px',
              padding: '36px 44px',
              maxWidth: '420px',
              fontFamily: 'monospace',
              boxShadow: '0 0 40px rgba(68,153,255,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ color: '#ff6600', fontSize: '22px', fontWeight: 'bold', marginBottom: '20px', letterSpacing: '2px', textAlign: 'center' }}>
              HOW TO PLAY
            </div>
            <div style={{ color: '#ccc', fontSize: '15px', lineHeight: '2', letterSpacing: '0.5px' }}>
              <div><span style={{ color: '#4499ff' }}>1.</span> Tap a ball to pick it up</div>
              <div><span style={{ color: '#4499ff' }}>2.</span> Press and hold to charge power</div>
              <div><span style={{ color: '#4499ff' }}>3.</span> Release in the <span style={{ color: '#2ecc71' }}>green zone</span> for a perfect shot</div>
              <div><span style={{ color: '#4499ff' }}>4.</span> Hit 3 in a row for <span style={{ color: '#f39c12' }}>2x points</span></div>
              <div style={{ marginTop: '12px', color: '#888', fontSize: '13px' }}>
                Score as many points as you can in 30 seconds!
              </div>
            </div>
            <button
              style={{
                display: 'block',
                margin: '24px auto 0',
                padding: '10px 32px',
                fontSize: '16px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                backgroundColor: '#4499ff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                letterSpacing: '2px',
              }}
              onClick={() => setShowInstructions(false)}
            >
              GOT IT
            </button>
          </div>
        </div>
      )}

      {/* ── Arcade Scoreboard HUD ── */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'stretch',
          background: 'rgba(0,0,0,0.75)',
          border: '3px solid #4499ff',
          borderRadius: '12px',
          boxShadow: '0 0 30px rgba(68,153,255,0.3), inset 0 0 20px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          fontFamily: 'monospace',
        }}>
          {/* High Score */}
          <div style={{
            padding: '14px 36px',
            textAlign: 'center',
            borderRight: '1px solid rgba(68,153,255,0.3)',
            minWidth: '200px',
          }}>
            <div style={{ color: '#4499ff', fontSize: '18px', letterSpacing: '3px', marginBottom: '4px' }}>
              HI-SCORE
            </div>
            <div style={{ color: '#ff6600', fontSize: '52px', fontWeight: 'bold', textShadow: '0 0 10px rgba(255,102,0,0.5)' }}>
              {highScores.length > 0 && (
                <span style={{ fontSize: '26px', color: '#f39c12', marginRight: '10px', letterSpacing: '3px' }}>
                  {highScores[0].initials}
                </span>
              )}
              {String(topScore).padStart(3, '0')}
            </div>
          </div>
          {/* Current Score */}
          <div style={{
            padding: '14px 40px',
            textAlign: 'center',
            borderRight: '1px solid rgba(68,153,255,0.3)',
            minWidth: '240px',
          }}>
            <div style={{ color: '#4499ff', fontSize: '18px', letterSpacing: '3px', marginBottom: '4px' }}>
              SCORE
            </div>
            <div style={{
              color: 'white',
              fontSize: '60px',
              fontWeight: 'bold',
              textShadow: '0 0 8px rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}>
              {String(score).padStart(3, '0')}
              {streak >= 3 && (
                <span style={{
                  color: '#f39c12',
                  fontSize: '32px',
                  textShadow: '0 0 8px rgba(243,156,18,0.5)',
                }}>
                  2x
                </span>
              )}
            </div>
          </div>
          {/* Timer */}
          <div style={{
            padding: '14px 36px',
            textAlign: 'center',
            minWidth: '180px',
          }}>
            <div style={{ color: '#4499ff', fontSize: '18px', letterSpacing: '3px', marginBottom: '4px' }}>
              TIME
            </div>
            <div style={{
              color: timeLeft <= 10 ? '#e74c3c' : timeLeft <= 30 ? '#f39c12' : 'white',
              fontSize: '60px',
              fontWeight: 'bold',
              textShadow: timeLeft <= 10
                ? '0 0 15px rgba(231,76,60,0.7)'
                : timeLeft <= 30
                  ? '0 0 10px rgba(243,156,18,0.5)'
                  : '0 0 8px rgba(255,255,255,0.3)',
            }}>
              {`${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`}
            </div>
          </div>
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 1.45, -0.15], fov: 106.26, near: 0.02, far: 50 }}
        shadows
        onCreated={({ camera }) => camera.lookAt(0, 1.5, -2.4)}
      >
        <color attach="background" args={['#050508']} />
        <Suspense fallback={null}>
          <Scene
            ballRefs={ballRefs}
            ballStates={ballStates}
            selectedBall={selectedBall}
            onBallClick={handleBallClick}
            onScore={handleScore}
            swishImpact={swishImpact}
          />
        </Suspense>
      </Canvas>

      {/* Charging overlay — appears when a ball is selected, captures hold-to-charge */}
      {hasBallSelected && isPlaying && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 8,
            cursor: 'crosshair',
            touchAction: 'none',
          }}
          onPointerDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
            ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
            startCharging()
          }}
          onPointerUp={(e) => {
            ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
            stopCharging()
          }}
          onPointerCancel={stopCharging}
        />
      )}

      {/* Shot meter — visible when a ball is selected */}
      {hasBallSelected && isPlaying && (
        <div
          style={{
            position: 'absolute',
            bottom: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '350px',
            pointerEvents: 'none',
            zIndex: 15,
          }}
        >
          {/* Power label */}
          <div style={{
            color: 'white',
            textAlign: 'center',
            fontSize: '14px',
            fontFamily: 'monospace',
            marginBottom: '8px',
            textShadow: '1px 1px 3px black',
          }}>
            {meterFill > 0 ? `POWER: ${Math.round(meterFill)}%` : 'HOLD TO CHARGE'}
          </div>
          {/* Bar track */}
          <div style={{
            width: '100%',
            height: '30px',
            backgroundColor: '#333',
            borderRadius: '15px',
            border: '3px solid white',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Fill bar */}
            <div style={{
              position: 'absolute',
              top: '0px',
              left: '0px',
              height: '100%',
              width: `${meterFill}%`,
              minWidth: meterFill > 0 ? '6px' : '0px',
              backgroundColor: meterFill > perfectZoneStart && meterFill < perfectZoneEnd
                ? '#2ecc71'
                : meterFill >= perfectZoneEnd
                  ? '#e74c3c'
                  : '#ff8c00',
              borderRadius: '12px',
              zIndex: 1,
            }} />
            {/* Perfect zone marker — sits on top of fill */}
            <div style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${perfectZoneStart}%`,
              width: `${perfectZoneEnd - perfectZoneStart}%`,
              backgroundColor: 'rgba(46,204,113,0.5)',
              borderLeft: '3px solid #2ecc71',
              borderRight: '3px solid #2ecc71',
              zIndex: 2,
            }} />
          </div>
        </div>
      )}

      {lastShot && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          <div style={{
            color: lastShot === 'PERFECT' ? '#2ecc71' : lastShot === 'MADE' ? '#3498db' : '#e74c3c',
            fontSize: '72px',
            fontWeight: 'bold',
            textShadow: '4px 4px 8px black',
          }}>
            {lastShot}!
          </div>
          {lastPoints > 0 && (
            <div style={{
              color: 'white',
              fontSize: '36px',
              fontWeight: 'bold',
              textShadow: '2px 2px 6px black',
              marginTop: '-4px',
            }}>
              +{lastPoints}
            </div>
          )}
        </div>
      )}

      {/* Countdown overlay */}
      {countdown !== null && countdown > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          <div style={{
            color: 'white',
            fontSize: '140px',
            fontWeight: 'bold',
            textShadow: '0 0 40px rgba(255,102,0,0.8), 4px 4px 12px black',
            fontFamily: 'monospace',
          }}>
            {countdown}
          </div>
          <div style={{
            color: '#aaa',
            fontSize: '20px',
            fontFamily: 'monospace',
            textShadow: '1px 1px 3px black',
            marginTop: '-10px',
          }}>
            GET READY
          </div>
        </div>
      )}

      {/* GO flash */}
      {showGo && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          <div style={{
            color: '#2ecc71',
            fontSize: '140px',
            fontWeight: 'bold',
            textShadow: '0 0 50px rgba(46,204,113,0.8), 4px 4px 12px black',
            fontFamily: 'monospace',
            letterSpacing: '8px',
          }}>
            GO!
          </div>
        </div>
      )}

      {/* Confetti on high score */}
      <Confetti active={showConfetti} />

      {!isPlaying && countdown === null && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          {timeLeft === 0 ? (
            <div style={{
              background: 'rgba(0,0,0,0.85)',
              border: '2px solid #4499ff',
              borderRadius: '12px',
              padding: '40px 50px',
              boxShadow: '0 0 40px rgba(68,153,255,0.3)',
              fontFamily: 'monospace',
              minWidth: '340px',
            }}>
              <div style={{
                color: '#4499ff',
                fontSize: '14px',
                letterSpacing: '4px',
                marginBottom: '8px',
              }}>
                GAME OVER
              </div>
              <div style={{
                color: 'white',
                fontSize: '56px',
                fontWeight: 'bold',
                textShadow: '0 0 15px rgba(255,255,255,0.3)',
                marginBottom: '4px',
              }}>
                {score}
              </div>
              <div style={{
                color: '#888',
                fontSize: '12px',
                letterSpacing: '2px',
                marginBottom: '24px',
              }}>
                FINAL SCORE
              </div>

              {/* Initials entry for high score */}
              {showInitialsEntry ? (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{
                    color: '#f39c12',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    textShadow: '0 0 10px rgba(243,156,18,0.5)',
                    letterSpacing: '2px',
                  }}>
                    NEW HIGH SCORE!
                  </div>
                  <div style={{ color: '#aaa', fontSize: '12px', marginBottom: '10px', letterSpacing: '1px' }}>
                    ENTER YOUR INITIALS
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <input
                      type="text"
                      maxLength={3}
                      value={initials}
                      onChange={(e) => setInitials(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                      autoFocus
                      style={{
                        width: '120px',
                        fontSize: '32px',
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        letterSpacing: '12px',
                        paddingLeft: '12px',
                        background: 'rgba(0,0,0,0.6)',
                        border: '2px solid #4499ff',
                        borderRadius: '6px',
                        color: '#ff6600',
                        outline: 'none',
                        caretColor: '#4499ff',
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && initials.length > 0) {
                          saveHighScoreGlobal({ initials, score }).then(setHighScores)
                          setShowInitialsEntry(false)
                        }
                      }}
                    />
                    <button
                      style={{
                        padding: '8px 20px',
                        fontSize: '16px',
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        backgroundColor: initials.length > 0 ? '#ff6600' : '#555',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: initials.length > 0 ? 'pointer' : 'default',
                        letterSpacing: '1px',
                      }}
                      disabled={initials.length === 0}
                      onClick={() => {
                        if (initials.length > 0) {
                          saveHighScoreGlobal({ initials, score }).then(setHighScores)
                          setShowInitialsEntry(false)
                        }
                      }}
                    >
                      OK
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Leaderboard */}
                  {highScores.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{
                        color: '#4499ff',
                        fontSize: '11px',
                        letterSpacing: '3px',
                        marginBottom: '10px',
                        borderBottom: '1px solid rgba(68,153,255,0.3)',
                        paddingBottom: '6px',
                      }}>
                        LEADERBOARD
                      </div>
                      {highScores.map((entry, i) => (
                        <div key={i} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '4px 0',
                          color: i === 0 ? '#f39c12' : '#ccc',
                          fontSize: '18px',
                          fontWeight: i === 0 ? 'bold' : 'normal',
                        }}>
                          <span style={{ width: '30px', textAlign: 'left', color: '#666' }}>{i + 1}.</span>
                          <span style={{ flex: 1, textAlign: 'left' }}>{entry.initials}</span>
                          <span>{String(entry.score).padStart(3, '0')}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              <button
                style={{
                  padding: '12px 36px',
                  fontSize: '18px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  backgroundColor: '#ff6600',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  letterSpacing: '2px',
                  boxShadow: '0 0 15px rgba(255,102,0,0.4)',
                }}
                onClick={() => {
                  setScore(0)
                  setTimeLeft(30)
                  setCountdown(3)
                  setStreak(0); streakRef.current = 0; shotFired.current = false
                  setShowInitialsEntry(false)
                  setShowConfetti(false)
                  setInitials('')
                  resetBalls()
                }}
              >
                PLAY AGAIN
              </button>
            </div>
          ) : (
            <div style={{
              background: 'rgba(0,0,0,0.85)',
              border: '2px solid #4499ff',
              borderRadius: '12px',
              padding: '40px 50px',
              boxShadow: '0 0 40px rgba(68,153,255,0.3)',
              fontFamily: 'monospace',
              minWidth: '340px',
            }}>
              <div style={{
                color: '#ff6600',
                fontSize: '28px',
                fontWeight: 'bold',
                marginBottom: '8px',
                textShadow: '0 0 15px rgba(255,102,0,0.5)',
                letterSpacing: '2px',
              }}>
                HOOP DREAMS
              </div>

              {/* Leaderboard on start screen */}
              {highScores.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{
                    color: '#4499ff',
                    fontSize: '11px',
                    letterSpacing: '3px',
                    marginBottom: '10px',
                    borderBottom: '1px solid rgba(68,153,255,0.3)',
                    paddingBottom: '6px',
                  }}>
                    LEADERBOARD
                  </div>
                  {highScores.map((entry, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '4px 0',
                      color: i === 0 ? '#f39c12' : '#ccc',
                      fontSize: '18px',
                      fontWeight: i === 0 ? 'bold' : 'normal',
                    }}>
                      <span style={{ width: '30px', textAlign: 'left', color: '#666' }}>{i + 1}.</span>
                      <span style={{ flex: 1, textAlign: 'left' }}>{entry.initials}</span>
                      <span>{String(entry.score).padStart(3, '0')}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                style={{
                  padding: '14px 44px',
                  fontSize: '20px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  backgroundColor: '#ff6600',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  letterSpacing: '3px',
                  boxShadow: '0 0 15px rgba(255,102,0,0.4)',
                }}
                onClick={() => setCountdown(3)}
              >
                START GAME
              </button>
            </div>
          )}
        </div>
      )}

      {isPlaying && !hasBallSelected && (
        <div
          style={{
            position: 'absolute',
            bottom: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '16px',
            fontFamily: 'monospace',
            textShadow: '1px 1px 3px black',
            zIndex: 10,
          }}
        >
          TAP A BALL TO SELECT IT
        </div>
      )}
    </div>
  )
}

useGLTF.preload('/models/basketball.glb')
