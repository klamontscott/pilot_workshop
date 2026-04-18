import { useMemo } from 'react'
import { EffectComposer, Bloom, Vignette, N8AO, BrightnessContrast, HueSaturation } from '@react-three/postprocessing'
import { BlendFunction, Effect, EffectAttribute } from 'postprocessing'
import { useStore } from '../lib/store'

// ── Depth-based cel outline (Sobel edge detection on depth buffer) ──

const celOutlineShader = /* glsl */ `
  void mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor) {
    vec2 texel = 2.0 / resolution;

    // 3×3 depth samples
    float d0 = texture2D(depthBuffer, uv + vec2(-texel.x, -texel.y)).r;
    float d1 = texture2D(depthBuffer, uv + vec2(0.0, -texel.y)).r;
    float d2 = texture2D(depthBuffer, uv + vec2(texel.x, -texel.y)).r;
    float d3 = texture2D(depthBuffer, uv + vec2(-texel.x, 0.0)).r;
    float d5 = texture2D(depthBuffer, uv + vec2(texel.x, 0.0)).r;
    float d6 = texture2D(depthBuffer, uv + vec2(-texel.x, texel.y)).r;
    float d7 = texture2D(depthBuffer, uv + vec2(0.0, texel.y)).r;
    float d8 = texture2D(depthBuffer, uv + vec2(texel.x, texel.y)).r;

    // Sobel operator
    float sobelX = d0 + 2.0 * d3 + d6 - d2 - 2.0 * d5 - d8;
    float sobelY = d0 + 2.0 * d1 + d2 - d6 - 2.0 * d7 - d8;
    float edge = sqrt(sobelX * sobelX + sobelY * sobelY);

    float outline = smoothstep(0.0005, 0.003, edge);

    outputColor = vec4(mix(inputColor.rgb, vec3(0.05), outline), inputColor.a);
  }
`

class CelOutlineEffectImpl extends Effect {
  constructor() {
    super('CelOutlineEffect', celOutlineShader, {
      blendFunction: BlendFunction.NORMAL,
      attributes: EffectAttribute.DEPTH,
    })
  }
}

function CelOutline() {
  const effect = useMemo(() => new CelOutlineEffectImpl(), [])
  return <primitive object={effect} />
}

// ── Main effects component ──────────────────────────────────────

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
  const renderStyle = useStore((state) => state.renderStyle)
  const isCartoon = renderStyle === 'cartoon'

  const effects: React.ReactElement[] = []

  // AO — reduce in cartoon mode for flatter look
  if (ao && !isCartoon) {
    effects.push(
      <N8AO
        key="ao"
        aoRadius={1.2}
        intensity={2.5 * intensity}
        distanceFalloff={0.8}
        color="#1a0f0a"
        screenSpaceRadius={false}
        halfRes={false}
      />
    )
  }

  if (bloom) {
    effects.push(
      <Bloom
        key="bloom"
        luminanceThreshold={1.2}
        luminanceSmoothing={0.9}
        intensity={0.15 * intensity}
        radius={0.6}
        mipmapBlur
      />
    )
  }

  if (colorGrade) {
    effects.push(
      <BrightnessContrast
        key="brightness"
        brightness={isCartoon ? 0.05 * intensity : 0.03 * intensity}
        contrast={isCartoon ? 0.05 * intensity : -0.08 * intensity}
      />,
      <HueSaturation
        key="hue"
        hue={0.04 * intensity}
        saturation={isCartoon ? 0.15 * intensity : -0.1 * intensity}
      />
    )
  }

  if (vignette) {
    effects.push(
      <Vignette
        key="vignette"
        darkness={0.75 * intensity}
        offset={0.15}
        blendFunction={BlendFunction.NORMAL}
      />
    )
  }

  // Cel outline — only in cartoon mode
  if (isCartoon) {
    effects.push(<CelOutline key="celOutline" />)
  }

  return (
    <EffectComposer multisampling={4} depthBuffer>
      {effects}
    </EffectComposer>
  )
}
