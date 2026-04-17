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
const AMBIENT_ON = 0.25
const AMBIENT_OFF = 0.15
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
  useEffect(() => {
    gl.shadowMap.enabled = true
    gl.shadowMap.type = THREE.PCFSoftShadowMap
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 1.0
  }, [gl])
  return null
}

// ── Layer 1: Ambient fill (always on, crossfades warm/cool) ─────

function AmbientFill() {
  const hemiRef = useRef<THREE.HemisphereLight>(null)
  const ambientRef = useRef<THREE.AmbientLight>(null)
  const lightOn = useStore((state) => state.lightOn)

  // Initialize to correct color state on mount (no flash)
  const initSky = lightOn ? WARM_SKY : COOL_SKY
  const initGround = lightOn ? WARM_GROUND : COOL_GROUND

  useFrame(() => {
    const sky = lightOn ? WARM_SKY : COOL_SKY
    const ground = lightOn ? WARM_GROUND : COOL_GROUND

    if (hemiRef.current) {
      hemiRef.current.color.lerp(sky, LERP_ALPHA)
      hemiRef.current.groundColor.lerp(ground, LERP_ALPHA)
      hemiRef.current.intensity = THREE.MathUtils.lerp(
        hemiRef.current.intensity, lightOn ? HEMI_ON : HEMI_OFF, LERP_ALPHA,
      )
    }
    if (ambientRef.current) {
      ambientRef.current.color.lerp(sky, LERP_ALPHA)
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity, lightOn ? AMBIENT_ON : AMBIENT_OFF, LERP_ALPHA,
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

// ── Layer 4: Shelf lights (always on, soft wash per compartment) ─

function ShelfLights() {
  // Single PointLight per compartment — top-center, pushed slightly forward
  // toward front lip. decay=1 for gentle, even spread across full shelf.
  const shelves: [number, number, number][] = [
    [220, 18, -176],  // Bottom compartment ceiling
    [220, 40, -176],  // Lower-middle compartment ceiling
    [220, 61, -176],  // Upper-middle compartment ceiling
    [220, 82, -176],  // Top compartment ceiling
  ]

  return (
    <>
      {shelves.map((pos, i) => (
        <pointLight
          key={i}
          position={pos}
          color="#f5e8d8"
          intensity={8}
          distance={35}
          decay={1}
        />
      ))}
    </>
  )
}

// ── Left wall fill (toggleable with pendant, hidden off-camera) ──

const FILL_INTENSITY = 200

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
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Canvas
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
