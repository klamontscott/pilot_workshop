import { useEffect, useRef, useCallback } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useStore } from '../lib/store'
import * as THREE from 'three'

const LERP_ALPHA = 0.22
const HOVER_LERP = 0.45

type InteractiveId = 'pendant' | 'camera' | 'basketball' | 'laptop' | 'bookshelf'

// Shelf items use color tint (no bloom bleed). Laptop uses backlight (not in shelf).
const SHELF_ITEMS: Set<InteractiveId> = new Set(['basketball', 'camera', 'bookshelf'])
const HOVER_TINT = new THREE.Color('#FFBB7A')

// Laptop backlight config (only non-shelf item with backlight)
const LAPTOP_BACKLIGHT_INTENSITY = 1000
const LAPTOP_BACKLIGHT_POSITION: [number, number, number] = [213.9, 34.09, -82.259]
const LAPTOP_BACKLIGHT_DISTANCE = 90

// Hover color by lamp state (for laptop backlight)
const HOVER_COLOR_WARM = new THREE.Color('#FFBB7A')
const HOVER_COLOR_COOL = new THREE.Color('#4488ff')

// Mechanical light switch click (noise burst + low-pass filter)
function playClickSound() {
  const ctx = new (window.AudioContext || (window as /* eslint-disable-line */ any).webkitAudioContext)()
  const bufferSize = ctx.sampleRate * 0.03
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < bufferSize; i++) {
    const t = i / bufferSize
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 10)
  }

  const source = ctx.createBufferSource()
  source.buffer = buffer

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 2000

  const gain = ctx.createGain()
  gain.gain.value = 0.4

  source.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  source.start()
}

// Invisible hit volume material
const hitMat = new THREE.MeshBasicMaterial({
  transparent: true,
  opacity: 0,
  depthWrite: false,
  side: THREE.DoubleSide,
})

// Stored original color per material for shelf item hover tinting
type SavedColor = { mat: THREE.MeshStandardMaterial; original: THREE.Color }

export default function Room() {
  const toggleLight = useStore((state) => state.toggleLight)
  const lightOn = useStore((state) => state.lightOn)
  const setShowPhotoGallery = useStore((state) => state.setShowPhotoGallery)
  const setShowBasketballGame = useStore((state) => state.setShowBasketballGame)
  const setHoveredObject = useStore((state) => state.setHoveredObject)

  const { scene } = useGLTF('/models/workspace.glb')
  const { camera, gl } = useThree()
  const pendantMatRef = useRef<THREE.MeshStandardMaterial | null>(null)

  // Laptop backlight (only non-shelf backlight)
  const laptopLightRef = useRef<THREE.PointLight>(null)
  const laptopLightTarget = useRef(0)

  // Hit volume refs
  const basketballHitRef = useRef<THREE.Mesh>(null)
  const cameraHitRef = useRef<THREE.Mesh>(null)
  const pendantHitRef = useRef<THREE.Mesh>(null)
  const laptopHitRef = useRef<THREE.Mesh>(null)
  const bookshelfHitRef = useRef<THREE.Mesh>(null)

  // Shelf item materials for color tinting
  const shelfMaterials = useRef<Record<string, SavedColor[]>>({
    basketball: [],
    camera: [],
    bookshelf: [],
  })

  const currentHover = useRef<InteractiveId | null>(null)
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())

  // FPS counter
  const fpsFrames = useRef(0)
  const fpsTime = useRef(performance.now())
  const statsLogged = useRef(false)

  // Setup: shadows, emissives, position hit volumes, collect shelf materials
  useEffect(() => {
    const box = new THREE.Box3()
    const center = new THREE.Vector3()

    let basketballMesh: THREE.Object3D | null = null
    let cameraMesh: THREE.Object3D | null = null
    let pendantMesh: THREE.Object3D | null = null
    let laptopMesh: THREE.Object3D | null = null
    let meshCount = 0
    let lightCount = 0

    const basketballMats: SavedColor[] = []
    const cameraMats: SavedColor[] = []

    scene.traverse((child) => {
      if ((child as THREE.Light).isLight) lightCount++

      if ((child as THREE.Mesh).isMesh) {
        meshCount++
        ;(child as THREE.Mesh).receiveShadow = true
        const lname = child.name.toLowerCase()

        // Clamp emissive intensity to prevent bloom blowout
        const meshMat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
        if (meshMat?.emissiveIntensity > 1) {
          meshMat.emissiveIntensity = 0.5
        }

        // Fix speaker bottom — target Color_D03 material specifically
        if (lname.includes('ds_bo')) {
          const rawMats = Array.isArray((child as THREE.Mesh).material)
            ? (child as THREE.Mesh).material as THREE.MeshStandardMaterial[]
            : [(child as THREE.Mesh).material as THREE.MeshStandardMaterial]
          for (const m of rawMats) {
            if (m.name === 'Color_D03') {
              m.color.set('#1e1e1e')
              m.roughness = 0.85
              m.metalness = 0.0
              m.needsUpdate = true
            }
          }
        }

        if (lname.includes('noguchi')) {
          const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
          if (mat && mat.emissive) {
            mat.emissive.set('#fff0e0')
            mat.emissiveIntensity = lightOn ? 0.35 : 0
            pendantMatRef.current = mat
          }
          if (!pendantMesh) pendantMesh = child
        }

        const rawMat = (child as THREE.Mesh).material
        const mats = Array.isArray(rawMat) ? rawMat : [rawMat]
        for (const m of mats) {
          const stdMat = m as THREE.MeshStandardMaterial
          if (stdMat?.name === 'H03_Glacier_Glow' || stdMat?.name === 'A05_Cherry_Blaze') {
            if (stdMat.map) stdMat.emissiveMap = stdMat.map
            stdMat.emissive = new THREE.Color('#ffffff')
            stdMat.emissiveIntensity = 0.5
            stdMat.needsUpdate = true
          }
        }

        // Camera mesh — collect materials for tint hover
        if (lname.includes('canon_m50') && !cameraMesh) {
          cameraMesh = child
          const mesh = child as THREE.Mesh
          const origMat = mesh.material as THREE.MeshStandardMaterial
          if (origMat && !origMat.userData._brightened) {
            const mat = origMat.clone()
            mat.color.multiplyScalar(1.8)
            mat.userData._brightened = true
            mat.needsUpdate = true
            mesh.material = mat
            origMat.dispose()
            cameraMats.push({ mat, original: mat.color.clone() })
          } else if (origMat) {
            cameraMats.push({ mat: origMat, original: origMat.color.clone() })
          }
        }

        // Basketball mesh — collect materials for tint hover
        if ((lname.includes('bola_spalding') || lname.includes('nbaa')) && !basketballMesh) {
          basketballMesh = child
          const mesh = child as THREE.Mesh
          const origMat = mesh.material as THREE.MeshStandardMaterial
          if (origMat && !origMat.userData._brightened) {
            const mat = origMat.clone()
            mat.color.multiplyScalar(1.8)
            mat.userData._brightened = true
            mat.needsUpdate = true
            mesh.material = mat
            origMat.dispose()
            basketballMats.push({ mat, original: mat.color.clone() })
          } else if (origMat) {
            basketballMats.push({ mat: origMat, original: origMat.color.clone() })
          }
        }

        if (lname.includes('group1076') && lname.includes('group1091') && !laptopMesh) laptopMesh = child
      }
    })

    shelfMaterials.current.basketball = basketballMats
    shelfMaterials.current.camera = cameraMats

    // Collect bookshelf materials from Mesh1071
    const bookshelfMats: SavedColor[] = []
    const shelfRoot = scene.getObjectByName('Mesh1071')
    if (shelfRoot) {
      shelfRoot.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const rawMat = (child as THREE.Mesh).material
          const mats = Array.isArray(rawMat) ? rawMat : [rawMat]
          for (const m of mats) {
            const stdMat = m as THREE.MeshStandardMaterial
            if (stdMat?.color) {
              bookshelfMats.push({ mat: stdMat, original: stdMat.color.clone() })
            }
          }
        }
      })
    }
    shelfMaterials.current.bookshelf = bookshelfMats

    if (!statsLogged.current) {
      statsLogged.current = true
      console.log(`[SCENE] meshes: ${meshCount} | lights (in GLB): ${lightCount}`)
    }

    // Position hit volumes at object centers
    scene.updateMatrixWorld(true)

    const positionHitVolume = (mesh: THREE.Object3D | null, ref: React.RefObject<THREE.Mesh | null>) => {
      if (mesh && ref.current) {
        box.setFromObject(mesh)
        box.getCenter(center)
        ref.current.position.set(center.x, center.y, center.z)
      }
    }

    positionHitVolume(basketballMesh, basketballHitRef)
    positionHitVolume(cameraMesh, cameraHitRef)
    positionHitVolume(pendantMesh, pendantHitRef)
    positionHitVolume(laptopMesh, laptopHitRef)
  }, [scene, lightOn])

  // Opaque back panel behind bookshelf to block hover glow bleed
  useEffect(() => {
    const shelf = scene.getObjectByName('Mesh1071')
    if (!shelf) return

    const shelfBox = new THREE.Box3().setFromObject(shelf)
    const size = new THREE.Vector3()
    const shelfCenter = new THREE.Vector3()
    shelfBox.getSize(size)
    shelfBox.getCenter(shelfCenter)

    const geo = new THREE.PlaneGeometry(size.x + 2, size.y + 2)
    const mat = new THREE.MeshBasicMaterial({
      color: '#2a1a0f',
      side: THREE.DoubleSide,
    })
    const backPanel = new THREE.Mesh(geo, mat)
    backPanel.position.set(shelfCenter.x, shelfCenter.y, shelfBox.min.z - 1)
    scene.add(backPanel)

    return () => {
      scene.remove(backPanel)
      geo.dispose()
      mat.dispose()
    }
  }, [scene])

  // Apply / remove color tint for shelf items
  const tintShelfItem = useCallback((id: InteractiveId, on: boolean) => {
    const saved = shelfMaterials.current[id]
    if (!saved) return
    for (const { mat, original } of saved) {
      mat.color.copy(on ? HOVER_TINT : original)
      mat.needsUpdate = true
    }
  }, [])

  // Custom raycasting against ONLY the hit volumes
  const hitTest = useCallback((event: PointerEvent): InteractiveId | null => {
    const rect = gl.domElement.getBoundingClientRect()
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.current.setFromCamera(mouse.current, camera)

    const targets = [
      basketballHitRef.current,
      cameraHitRef.current,
      pendantHitRef.current,
      laptopHitRef.current,
      bookshelfHitRef.current,
    ].filter(Boolean) as THREE.Mesh[]

    const hits = raycaster.current.intersectObjects(targets, false)
    if (hits.length > 0) {
      return hits[0].object.userData.interactiveId as InteractiveId
    }
    return null
  }, [camera, gl])

  // Pointer event handlers on the canvas DOM element
  useEffect(() => {
    const canvas = gl.domElement

    const onMove = (e: PointerEvent) => {
      let id = hitTest(e)

      // Skip pendant hover when lamp is off
      if (id === 'pendant' && !useStore.getState().lightOn) id = null

      if (id && id !== currentHover.current) {
        // Turn off previous hover
        if (currentHover.current) {
          if (currentHover.current === 'pendant') {
            setHoveredObject(null)
          } else if (SHELF_ITEMS.has(currentHover.current)) {
            tintShelfItem(currentHover.current, false)
          } else {
            // Laptop backlight off
            laptopLightTarget.current = 0
            if (laptopLightRef.current) laptopLightRef.current.intensity = 0
          }
        }

        currentHover.current = id
        if (id === 'pendant') {
          setHoveredObject('pendant')
        } else if (SHELF_ITEMS.has(id)) {
          tintShelfItem(id, true)
        } else {
          // Laptop backlight on
          laptopLightTarget.current = LAPTOP_BACKLIGHT_INTENSITY
        }
        canvas.style.cursor = 'pointer'
      } else if (!id && currentHover.current) {
        // Turn off current hover
        if (currentHover.current === 'pendant') {
          setHoveredObject(null)
        } else if (SHELF_ITEMS.has(currentHover.current)) {
          tintShelfItem(currentHover.current, false)
        } else {
          laptopLightTarget.current = 0
          if (laptopLightRef.current) laptopLightRef.current.intensity = 0
        }
        currentHover.current = null
        canvas.style.cursor = 'default'
      }
    }

    const onClick = (e: MouseEvent) => {
      const id = hitTest(e as PointerEvent)
      if (!id) return
      if (id === 'pendant') {
        playClickSound()
        const wasOn = useStore.getState().lightOn
        toggleLight()
        if (wasOn) {
          setHoveredObject(null)
          currentHover.current = null
          canvas.style.cursor = 'default'
        }
      }
      else if (id === 'camera') setShowPhotoGallery(true)
      else if (id === 'basketball') setShowBasketballGame(true)
      else if (id === 'laptop') window.open('https://www.keithscottii.com', '_blank')
      else if (id === 'bookshelf') window.open('https://www.goodreads.com/review/list/71910989-keith-scott-ii?shelf=favorites', '_blank')
    }

    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('click', onClick)
    return () => {
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('click', onClick)
      canvas.style.cursor = 'default'
    }
  }, [gl, hitTest, toggleLight, setShowPhotoGallery, setShowBasketballGame, setHoveredObject, tintShelfItem])

  useFrame(() => {
    // FPS counter
    fpsFrames.current++
    const now = performance.now()
    if (now - fpsTime.current >= 1000) {
      console.log(`[FPS] ${fpsFrames.current}`)
      fpsFrames.current = 0
      fpsTime.current = now
    }

    // Pendant lamp on/off emissive
    if (pendantMatRef.current) {
      const base = lightOn ? 0.35 : 0
      pendantMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        pendantMatRef.current.emissiveIntensity, base, LERP_ALPHA,
      )
    }

    // Laptop backlight lerp
    if (laptopLightRef.current) {
      laptopLightRef.current.intensity = THREE.MathUtils.lerp(
        laptopLightRef.current.intensity, laptopLightTarget.current, HOVER_LERP,
      )
      const hoverColor = lightOn ? HOVER_COLOR_WARM : HOVER_COLOR_COOL
      laptopLightRef.current.color.lerp(hoverColor, HOVER_LERP)
    }
  })

  return (
    <group>
      <primitive object={scene} />

      {/* Invisible hit volumes for reliable raycasting */}
      <mesh ref={basketballHitRef} material={hitMat} userData={{ interactiveId: 'basketball' }}>
        <boxGeometry args={[10, 10, 10]} />
      </mesh>
      <mesh ref={cameraHitRef} material={hitMat} userData={{ interactiveId: 'camera' }}>
        <boxGeometry args={[10, 8, 8]} />
      </mesh>
      <mesh ref={pendantHitRef} material={hitMat} userData={{ interactiveId: 'pendant' }}>
        <sphereGeometry args={[18, 12, 12]} />
      </mesh>
      <mesh ref={laptopHitRef} material={hitMat} userData={{ interactiveId: 'laptop' }}>
        <boxGeometry args={[15, 10, 15]} />
      </mesh>
      <mesh ref={bookshelfHitRef} material={hitMat} userData={{ interactiveId: 'bookshelf' }} position={[217.99, 46.921, -165.96]}>
        <boxGeometry args={[12, 80, 25]} />
      </mesh>

      {/* Laptop hover backlight (only non-shelf item) */}
      <pointLight
        ref={laptopLightRef}
        position={LAPTOP_BACKLIGHT_POSITION}
        color="#FFBB7A"
        intensity={0}
        distance={LAPTOP_BACKLIGHT_DISTANCE}
        decay={2}
      />
    </group>
  )
}

useGLTF.preload('/models/workspace.glb')
