import { EffectComposer, Bloom, Vignette, N8AO, BrightnessContrast, HueSaturation } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

interface SoftSceneEffectsProps {
  intensity?: number
  ao?: boolean
  bloom?: boolean
  vignette?: boolean
  colorGrade?: boolean
}

export default function SoftSceneEffects({
  intensity = 1,
  ao = true,
  bloom = true,
  vignette = true,
  colorGrade = true,
}: SoftSceneEffectsProps) {
  return (
    <EffectComposer multisampling={4}>
      {ao && (
        <N8AO
          aoRadius={1.2}
          intensity={2.5 * intensity}
          distanceFalloff={0.8}
          color="#1a0f0a"
          screenSpaceRadius={false}
          halfRes={false}
        />
      )}

      {bloom && (
        <Bloom
          luminanceThreshold={1.2}
          luminanceSmoothing={0.9}
          intensity={0.15 * intensity}
          radius={0.6}
          mipmapBlur
        />
      )}

      {colorGrade && (
        <>
          <BrightnessContrast
            brightness={0.03 * intensity}
            contrast={-0.08 * intensity}
          />
          <HueSaturation
            hue={0.04 * intensity}
            saturation={-0.1 * intensity}
          />
        </>
      )}

      {vignette && (
        <Vignette
          darkness={0.75 * intensity}
          offset={0.15}
          blendFunction={BlendFunction.NORMAL}
        />
      )}

    </EffectComposer>
  )
}
