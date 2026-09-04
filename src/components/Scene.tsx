import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { PerformanceMonitor, ContactShadows } from '@react-three/drei'
import { useStore } from '../lib/store'
import Room from './Room'
import SoftSceneEffects from './SoftSceneEffects'
import * as THREE from 'three'

// ── Color palettes ──────────────────────────────────────────────
// Warm state: neutral warm ("warm white LED"), not orange
const WARM_SKY = new THREE.Color('#f0e0d0')
const WARM_GROUND = new THREE.Color('#a08060')
// Cool state: blue-cast night feel
const COOL_SKY = new THREE.Color('#7090b8')
const COOL_GROUND = new THREE.Color('#2a3040')

// ── Pendant light intensities (candela, physically-based) ───────
const BOTTOM_INTENSITY = 950 // floor pool, shadow caster
const PAPER_INTENSITY = 350 // through-paper room fill
const TOP_INTENSITY = 350 // soft glow on ceiling above fixture

// Ambient intensities by lamp state
const HEMI_ON = 0.5
const HEMI_OFF = 0.3
const AMBIENT_ON = 1.35
const AMBIENT_OFF = 0.4
const LERP_ALPHA = 0.22 // ~0.2s to 95% at 60fps

// ── Utility components ──────────────────────────────────────────

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial color="#ddd" />
    </mesh>
  )
}

function CameraSetup() {
  const { camera } = useThree()
  useEffect(() => {
    camera.lookAt(new THREE.Vector3(215, 37, -125))
  }, [camera])
  return null
}

function RendererSetup() {
  const { gl } = useThree()
  const renderStyle = useStore((state) => state.renderStyle)

  useEffect(() => {
    gl.shadowMap.type = THREE.PCFSoftShadowMap
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 2.0
  }, [gl])

  // Disable shadow maps in cartoon mode for flatter lighting
  useEffect(() => {
    gl.shadowMap.enabled = renderStyle !== 'cartoon'
    gl.shadowMap.needsUpdate = true
  }, [gl, renderStyle])

  return null
}

// ── Layer 1: Ambient fill (always on, crossfades warm/cool) ─────

function AmbientFill() {
  const hemiRef = useRef<THREE.HemisphereLight>(null)
  const ambientRef = useRef<THREE.AmbientLight>(null)
  const lightOn = useStore((state) => state.lightOn)
  const renderStyle = useStore((state) => state.renderStyle)
  const isCartoon = renderStyle === 'cartoon'

  // Initialize to correct color state on mount (no flash)
  const initSky = lightOn ? WARM_SKY : COOL_SKY
  const initGround = lightOn ? WARM_GROUND : COOL_GROUND

  // Cartoon mode: boost ambient for flatter, more uniform lighting
  const cartoonBoost = isCartoon ? 1.6 : 1.0

  useFrame(() => {
    const sky = lightOn ? WARM_SKY : COOL_SKY
    const ground = lightOn ? WARM_GROUND : COOL_GROUND

    if (hemiRef.current) {
      hemiRef.current.color.lerp(sky, LERP_ALPHA)
      hemiRef.current.groundColor.lerp(ground, LERP_ALPHA)
      hemiRef.current.intensity = THREE.MathUtils.lerp(
        hemiRef.current.intensity, (lightOn ? HEMI_ON : HEMI_OFF) * cartoonBoost, LERP_ALPHA,
      )
    }
    if (ambientRef.current) {
      ambientRef.current.color.lerp(sky, LERP_ALPHA)
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity, (lightOn ? AMBIENT_ON : AMBIENT_OFF) * cartoonBoost, LERP_ALPHA,
      )
    }
  })

  return (
    <>
      <hemisphereLight ref={hemiRef} args={[initSky, initGround, lightOn ? HEMI_ON : HEMI_OFF]} />
      <ambientLight ref={ambientRef} intensity={lightOn ? AMBIENT_ON : AMBIENT_OFF} color={initSky} />
    </>
  )
}

// ── Layer 2: Pendant lantern (3 PointLights as one unified source) ─

function PendantLantern() {
  const bottomRef = useRef<THREE.SpotLight>(null)
  const paperRef = useRef<THREE.PointLight>(null)
  const topRef = useRef<THREE.PointLight>(null)
  const lightOn = useStore((state) => state.lightOn)
  const hoveredObject = useStore((state) => state.hoveredObject)
  const hoverBoost = hoveredObject === 'pendant' && lightOn ? 0.9 : 1.0

  const bottomTarget = (lightOn ? BOTTOM_INTENSITY : 0) * hoverBoost
  const paperTarget = (lightOn ? PAPER_INTENSITY : 0) * hoverBoost
  const topTarget = (lightOn ? TOP_INTENSITY : 0) * hoverBoost

  // Set initial intensities — match saved lamp state, no fade-in on mount
  useEffect(() => {
    if (bottomRef.current) bottomRef.current.intensity = lightOn ? BOTTOM_INTENSITY : 0
    if (paperRef.current) paperRef.current.intensity = lightOn ? PAPER_INTENSITY : 0
    if (topRef.current) topRef.current.intensity = lightOn ? TOP_INTENSITY : 0
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame(() => {
    if (bottomRef.current) {
      bottomRef.current.intensity = THREE.MathUtils.lerp(
        bottomRef.current.intensity, bottomTarget, LERP_ALPHA,
      )
    }
    if (paperRef.current) {
      paperRef.current.intensity = THREE.MathUtils.lerp(
        paperRef.current.intensity, paperTarget, LERP_ALPHA,
      )
    }
    if (topRef.current) {
      topRef.current.intensity = THREE.MathUtils.lerp(
        topRef.current.intensity, topTarget, LERP_ALPHA,
      )
    }
  })

  return (
    <>
      {/* Bottom opening — SpotLight aimed straight down, no upward bleed */}
      <spotLight
        ref={bottomRef}
        position={[218, 62, -28]}
        color="#ffe8d0"
        angle={Math.PI / 2.5}
        penumbra={0.8}
        distance={300}
        decay={2}
        target-position={[218, 0, -28]}
      />
      {/* Through-paper — light passing through shade, fills room */}
      <pointLight
        ref={paperRef}
        position={[218, 69, -28]}
        color="#ffe8d0"
        distance={300}
        decay={2}
      />
      {/* Top opening — soft diffuse ceiling glow, no shadows */}
      <pointLight
        ref={topRef}
        position={[218, 77, -28]}
        color="#ffe8d0"
        distance={300}
        decay={2}
      />
    </>
  )
}

// ── Layer 3: Monitor emission (always on, no shadows) ───────────

function MonitorLights() {
  return (
    <>
      {/* Desktop monitor — positioned at screen face, facing toward viewer */}
      <rectAreaLight
        position={[218, 39, -110]}
        width={30}
        height={12}
        color="#d0d8e8"
        intensity={10}
        rotation={[0, Math.PI / 2, 0]}
      />
      {/* Laptop — smaller screen, lower intensity */}
      <rectAreaLight
        position={[208, 38, -84]}
        width={14}
        height={8}
        color="#d0d8e8"
        intensity={6}
        rotation={[0, Math.PI / 2, 0]}
      />
    </>
  )
}

// ── Bookshelf accent lights (always on, per-shelf corner pairs) ───

const SHELF_INTENSITY = 160

// Blender coords → Three.js Y-up: x→x, y→-z, z→y
// Slightly inward (~2 units) and below (~1.5 units) each corner
// [position, target] — lights angle inward toward shelf center and outward toward front edge
const SHELF_LIGHTS: { pos: [number, number, number]; side: 'right' | 'left' }[] = [
  // Bottom shelf
  { pos: [230.789, 24.5, -162.1], side: 'right' },
  { pos: [230.789, 24.5, -190.1], side: 'left' },
  // Shelf 2
  { pos: [230.789, 44.8, -162.1], side: 'right' },
  { pos: [230.789, 44.8, -190.1], side: 'left' },
  // Shelf 3
  { pos: [230.789, 67.1, -162.1], side: 'right' },
  { pos: [230.789, 67.1, -190.1], side: 'left' },
  // Shelf 4 (top)
  { pos: [230.789, 88.2, -162.1], side: 'right' },
  { pos: [230.789, 88.2, -190.1], side: 'left' },
]

function ShelfSpot({ position, side }: { position: [number, number, number]; side: 'right' | 'left' }) {
  const light = useRef<THREE.SpotLight>(null)
  const target = useRef<THREE.Object3D>(null)

  // Inward toward center Z, outward toward front of bookcase (-X)
  const inwardZ = side === 'right' ? -8 : 8
  const targetPos: [number, number, number] = [
    position[0] - 8,          // outward toward front edge
    position[1] - 20,         // down
    position[2] + inwardZ,    // inward toward each other
  ]

  useEffect(() => {
    if (light.current && target.current) {
      light.current.target = target.current
    }
  }, [])

  return (
    <>
      <spotLight
        ref={light}
        position={position}
        color="#ffeedd"
        intensity={SHELF_INTENSITY}
        distance={30}
        decay={1}
        angle={Math.PI / 4}
        penumbra={0.8}
      />
      <object3D ref={target} position={targetPos} />
    </>
  )
}

function ShelfLights() {
  return (
    <>
      {SHELF_LIGHTS.map((l, i) => (
        <ShelfSpot key={i} position={l.pos} side={l.side} />
      ))}
    </>
  )
}

// ── Left wall fill (toggleable with pendant, hidden off-camera) ──

const FILL_INTENSITY = 230 // bumped 15% to compensate for removed shelf lights

function LeftWallFill() {
  const fillRef = useRef<THREE.SpotLight>(null)
  const lightOn = useStore((state) => state.lightOn)
  const target = lightOn ? FILL_INTENSITY : 0

  useEffect(() => {
    if (fillRef.current) fillRef.current.intensity = lightOn ? FILL_INTENSITY : 0
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame(() => {
    if (fillRef.current) {
      fillRef.current.intensity = THREE.MathUtils.lerp(
        fillRef.current.intensity, target, LERP_ALPHA,
      )
    }
  })

  return (
    <spotLight
      ref={fillRef}
      position={[60, 80, -220]}
      color="#f0e0d0"
      angle={Math.PI / 3}
      penumbra={1}
      distance={250}
      decay={2}
      target-position={[200, 20, -180]}
    />
  )
}

// ── Wall sconce light (toggleable with pendant) ─────────────────

const SCONCE_INTENSITY = 600
const SCONCE_GLOW = 25

function WallSconceLight() {
  const sconceRef = useRef<THREE.SpotLight>(null)
  const glowRef = useRef<THREE.PointLight>(null)
  const lightOn = useStore((state) => state.lightOn)
  const spotTarget = lightOn ? SCONCE_INTENSITY : 0
  const glowTarget = lightOn ? SCONCE_GLOW : 0

  useEffect(() => {
    if (sconceRef.current) sconceRef.current.intensity = lightOn ? SCONCE_INTENSITY : 0
    if (glowRef.current) glowRef.current.intensity = lightOn ? SCONCE_GLOW : 0
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame(() => {
    if (sconceRef.current) {
      sconceRef.current.intensity = THREE.MathUtils.lerp(
        sconceRef.current.intensity, spotTarget, LERP_ALPHA,
      )
    }
    if (glowRef.current) {
      glowRef.current.intensity = THREE.MathUtils.lerp(
        glowRef.current.intensity, glowTarget, LERP_ALPHA,
      )
    }
  })

  return (
    <>
      {/* Downward wash from fixture onto wall and bike area */}
      <spotLight
        ref={sconceRef}
        position={[203, 75, -212]}
        color="#ffe8d0"
        angle={Math.PI / 3}
        penumbra={0.8}
        distance={120}
        decay={2}
        target-position={[185, 0, -220]}
      />
      {/* Small glow at fixture so it looks lit */}
      <pointLight
        ref={glowRef}
        position={[203, 78, -212]}
        color="#ffe8d0"
        distance={12}
        decay={2}
      />
    </>
  )
}

// ── Main Scene ──────────────────────────────────────────────────

export default function Scene() {
  const showBasketballGame = useStore((state) => state.showBasketballGame)
  const showPhotoGallery = useStore((state) => state.showPhotoGallery)
  const showBookshelf = useStore((state) => state.showBookshelf)
  // const toggleRenderStyle = useStore((state) => state.toggleRenderStyle)
  const paused = showBasketballGame || showPhotoGallery || showBookshelf

  // Toon mode disabled for production — uncomment to re-enable
  // useEffect(() => {
  //   const handler = (e: KeyboardEvent) => {
  //     if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
  //     if (e.key === 't' || e.key === 'T') toggleRenderStyle()
  //   }
  //   window.addEventListener('keydown', handler)
  //   return () => window.removeEventListener('keydown', handler)
  // }, [toggleRenderStyle])

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Canvas
        frameloop={paused ? 'never' : 'always'}
        camera={{
          position: [90, 44, -125],
          fov: 58,
          near: 1,
          far: 500,
        }}
        shadows="soft"
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          logarithmicDepthBuffer: true,
        }}
        performance={{ min: 0.5 }}
      >
        <RendererSetup />
        <AmbientFill />
        <PendantLantern />
        <MonitorLights />
        <ShelfLights />
        <LeftWallFill />
        <WallSconceLight />
        <CameraSetup />

        <PerformanceMonitor />

        <Suspense fallback={<LoadingFallback />}>
          <Room />
        </Suspense>

        <ContactShadows
          position={[200, 0, -100]}
          opacity={0.5}
          scale={500}
          blur={2.5}
          far={200}
          resolution={1024}
          color="#1a0f0a"
          frames={1}
        />

        <SoftSceneEffects />
      </Canvas>
    </div>
  )
}
