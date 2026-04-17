import { ReactNode, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { useStore } from '../lib/store'

interface InteractiveObjectProps {
  children: ReactNode
  position: [number, number, number]
  name: string
  onClick: () => void
}

export default function InteractiveObject({
  children,
  position,
  name,
  onClick,
}: InteractiveObjectProps) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const setHoveredObject = useStore((state) => state.setHoveredObject)

  // Gentle hover animation
  useFrame((state) => {
    if (groupRef.current && hovered) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.02
    } else if (groupRef.current) {
      groupRef.current.position.y = position[1]
    }
  })

  const handlePointerOver = () => {
    setHovered(true)
    setHoveredObject(name)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setHovered(false)
    setHoveredObject(null)
    document.body.style.cursor = 'auto'
  }

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      {children}
      
      {/* Hover glow effect */}
      {hovered && (
        <pointLight
          intensity={0.5}
          distance={2}
          color="#ffffff"
        />
      )}
    </group>
  )
}
