import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addPropertyControls, ControlType } from "framer";
import * as THREE from "three";

// ── Types ──────────────────────────────────────────────────

type Breakpoint = "desktop" | "tablet" | "mobile";
type Direction = "en-es" | "es-en";

interface WordEntry {
  key: string;
  en: string;
  es: string;
}

interface TranslatorHeroProps {
  sphereColor1?: string;
  sphereColor2?: string;
  particleCount?: number;
  audioBaseUrl?: string;
  cursorInfluence?: number;
  audioReactivity?: number;
  idleRotationSpeed?: number;
}

// ── Word List ──────────────────────────────────────────────

const WORDS: WordEntry[] = [
  { key: "coverage", en: "Coverage", es: "Cobertura" },
  { key: "policy", en: "Policy", es: "P\u00f3liza" },
  { key: "insurance-premium", en: "Insurance Premium", es: "Prima de Seguro" },
  { key: "deductible", en: "Deductible", es: "Deducible" },
  { key: "claim", en: "Claim", es: "Reclamaci\u00f3n" },
  { key: "beneficiary", en: "Beneficiary", es: "Beneficiario" },
  { key: "policyholder", en: "Policyholder", es: "Asegurada" },
  { key: "liability", en: "Liability", es: "Responsabilidad" },
  { key: "underwriting", en: "Underwriting", es: "Suscripci\u00f3n" },
];

// ── Helpers ────────────────────────────────────────────────

function fibonacciSphere(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    positions[i * 3] = Math.cos(theta) * r * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return positions;
}

function generateColors(
  count: number,
  hex1: string,
  hex2: string,
  radius: number,
  positions: Float32Array,
): Float32Array {
  const colors = new Float32Array(count * 3);
  const c1 = new THREE.Color(hex1);
  const c2 = new THREE.Color(hex2);
  const tmp = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const t = (positions[i * 3 + 1] / radius + 1) / 2;
    tmp.copy(c2).lerp(c1, t);
    colors[i * 3] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;
  }
  return colors;
}

// ── Shaders ────────────────────────────────────────────────

const VERT = `
  attribute float aSize;
  varying vec3 vColor;
  void main() {
    vColor = color;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (25.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = `
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    gl_FragColor = vec4(vColor, 1.0);
  }
`;

// ── Component ──────────────────────────────────────────────

export default function TranslatorHero({
  sphereColor1 = "#bd5931",
  sphereColor2 = "#e8a87c",
  particleCount = 10000,
  audioBaseUrl = "",
  cursorInfluence = 1,
  audioReactivity = 1.5,
  idleRotationSpeed = 0,
}: TranslatorHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");
  const [selectedWord, setSelectedWord] = useState<WordEntry>(WORDS[0]);
  const [direction, setDirection] = useState<Direction>("en-es");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [ready, setReady] = useState(false);

  const propsRef = useRef({ cursorInfluence, audioReactivity, idleRotationSpeed });
  propsRef.current = { cursorInfluence, audioReactivity, idleRotationSpeed };

  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const breakpointRef = useRef(breakpoint);
  breakpointRef.current = breakpoint;
  const directionRef = useRef(direction);
  directionRef.current = direction;

  const resultRef = useRef<HTMLDivElement>(null);
  const resultWrapRef = useRef<HTMLDivElement>(null);
  const [resultScale, setResultScale] = useState(1);

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const occluderMatRef = useRef<THREE.MeshBasicMaterial | null>(null);

  const BG_EN = "#000000";
  const BG_ES = "#f0f0f0";

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioCacheRef = useRef(new Map<string, AudioBuffer>());
  const syntheticPulseRef = useRef(0);
  const playIdRef = useRef(0);

  // ── Breakpoint observer ────────────────────────────────

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setBreakpoint(w >= 1200 ? "desktop" : w >= 810 ? "tablet" : "mobile");
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const text = resultRef.current;
    const wrap = resultWrapRef.current;
    if (!text || !wrap) { setResultScale(1); return; }
    setResultScale(1);
    requestAnimationFrame(() => {
      const available = wrap.clientWidth;
      const natural = text.scrollWidth;
      if (natural > available && available > 0) {
        setResultScale(Math.max(0.5, available / natural));
      } else {
        setResultScale(1);
      }
    });
  }, [selectedWord, direction, showTranslation, breakpoint]);

  // ── Three.js ───────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, -1.4, 6);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    });
    renderer.setClearColor(new THREE.Color(directionRef.current === "en-es" ? BG_EN : BG_ES));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    const radius = 2.0;
    const count = particleCount;
    const basePos = fibonacciSphere(count, radius);
    const curPos = new Float32Array(basePos);
    const vel = new Float32Array(count * 3);
    const colors = generateColors(count, sphereColor1, sphereColor2, radius, basePos);
    const sizes = new Float32Array(count).fill(1.0);
    const BASE_SIZE = 1.0;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(curPos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.NormalBlending,
    });

    const occluderGeo = new THREE.SphereGeometry(radius * 0.85, 64, 64);
    const occluderMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(directionRef.current === "en-es" ? BG_EN : BG_ES),
      depthWrite: true,
    });
    occluderMatRef.current = occluderMat;
    const occluder = new THREE.Mesh(occluderGeo, occluderMat);

    const group = new THREE.Group();
    group.add(occluder);
    group.add(new THREE.Points(geo, mat));
    scene.add(group);

    const _cursorWorld = new THREE.Vector3();
    const _cursorLocal = new THREE.Vector3();
    const _dir = new THREE.Vector3();
    const _targetScale = new THREE.Vector3(1, 1, 1);
    let targetCameraY = 0;
    let freqData: Uint8Array | null = null;

    const _bgEN = new THREE.Color(BG_EN);
    const _bgES = new THREE.Color(BG_ES);
    const _currentBg = new THREE.Color(directionRef.current === "en-es" ? BG_EN : BG_ES);

    const SPRING_K = 0.04;
    const DAMPING = 0.88;

    const RIPPLE_LEN = 48;
    const rippleHistory = new Float32Array(RIPPLE_LEN);
    let rippleHead = 0;

    const particleAngles = new Float32Array(count);
    const tangents = new Float32Array(count * 3);
    const phaseOffsets = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const nx = basePos[i3] / radius;
      const ny = basePos[i3 + 1] / radius;
      const nz = basePos[i3 + 2] / radius;

      particleAngles[i] = Math.acos(Math.min(1, Math.max(-1, nz))) / Math.PI;

      let ax = 0, ay = 1, az = 0;
      if (Math.abs(ny) > 0.9) { ax = 1; ay = 0; }
      const tx = ny * az - nz * ay;
      const ty = nz * ax - nx * az;
      const tz = nx * ay - ny * ax;
      const tlen = Math.sqrt(tx * tx + ty * ty + tz * tz) || 1;
      tangents[i3] = tx / tlen;
      tangents[i3 + 1] = ty / tlen;
      tangents[i3 + 2] = tz / tlen;

      phaseOffsets[i] = (i * 2.399) % (Math.PI * 2);
    }

    function resize() {
      const { clientWidth: w, clientHeight: h } = container!;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    let frameId: number;
    let time = 0;
    let firstFrame = true;

    function animate() {
      frameId = requestAnimationFrame(animate);
      time += 0.016;

      if (firstFrame) {
        firstFrame = false;
        setReady(true);
      }

      const { cursorInfluence: ci, audioReactivity: ar, idleRotationSpeed: rs } =
        propsRef.current;
      const bp = breakpointRef.current;

      const scale = bp === "desktop" ? 1 : bp === "tablet" ? 0.9 : 0.75;
      _targetScale.setScalar(scale);
      group.scale.lerp(_targetScale, 0.05);

      targetCameraY = bp === "desktop" ? 0 : bp === "tablet" ? 0.2 : 0.4;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;

      const effectiveCount =
        bp === "desktop"
          ? count
          : bp === "tablet"
            ? Math.round(count * 0.8)
            : Math.round(count * 0.6);
      geo.setDrawRange(0, effectiveCount);

      const _targetBgColor = directionRef.current === "en-es" ? _bgEN : _bgES;
      _currentBg.lerp(_targetBgColor, 0.06);
      renderer.setClearColor(_currentBg);
      occluderMat.color.copy(_currentBg);

      group.rotation.y += rs;

      let amplitude = 0;
      const analyser = analyserRef.current;
      if (analyser) {
        if (!freqData || freqData.length !== analyser.frequencyBinCount) {
          freqData = new Uint8Array(analyser.frequencyBinCount);
        }
        analyser.getByteFrequencyData(freqData);
        let sum = 0;
        for (let i = 0; i < freqData.length; i++) sum += freqData[i];
        amplitude = sum / freqData.length / 255;
      }

      if (syntheticPulseRef.current > 0) {
        amplitude = Math.max(amplitude, syntheticPulseRef.current);
        syntheticPulseRef.current *= 0.96;
        if (syntheticPulseRef.current < 0.01) syntheticPulseRef.current = 0;
      }

      rippleHistory[rippleHead % RIPPLE_LEN] = amplitude;
      rippleHead++;

      const breathFactor = Math.sin(time * 0.5) * 0.02;

      const mouse = mouseRef.current;
      let hasCursor = mouse.active;
      if (hasCursor) {
        _cursorWorld.set(mouse.x * 2 - 1, -(mouse.y * 2 - 1), 0.5);
        _cursorWorld.unproject(camera);
        _dir.copy(_cursorWorld).sub(camera.position).normalize();

        const sr = radius * group.scale.x;
        const ox = camera.position.x,
          oy = camera.position.y,
          oz = camera.position.z;
        const b = 2 * (ox * _dir.x + oy * _dir.y + oz * _dir.z);
        const c = ox * ox + oy * oy + oz * oz - sr * sr;
        const disc = b * b - 4 * c;

        if (disc >= 0) {
          const tHit = (-b - Math.sqrt(disc)) / 2;
          _cursorWorld.set(
            ox + _dir.x * tHit,
            oy + _dir.y * tHit,
            oz + _dir.z * tHit,
          );
        } else {
          const tNearest = -(ox * _dir.x + oy * _dir.y + oz * _dir.z);
          _cursorWorld.set(
            ox + _dir.x * tNearest,
            oy + _dir.y * tNearest,
            oz + _dir.z * tNearest,
          );
          const len = _cursorWorld.length() || 1;
          _cursorWorld.multiplyScalar(sr / len);
        }

        _cursorLocal.copy(_cursorWorld);
        group.worldToLocal(_cursorLocal);
      }

      for (let i = 0; i < effectiveCount; i++) {
        const i3 = i * 3;
        const bx = basePos[i3],
          by = basePos[i3 + 1],
          bz = basePos[i3 + 2];

        const angle = particleAngles[i];
        const delay = Math.floor(angle * RIPPLE_LEN * 0.7);
        const sampleIdx =
          ((rippleHead - 1 - delay) % RIPPLE_LEN + RIPPLE_LEN) % RIPPLE_LEN;
        const particleAmp = rippleHistory[sampleIdx];

        const audioDisp = particleAmp * ar * 0.45;

        const jitter = particleAmp * ar * 0.12 *
          Math.sin(time * 14 + phaseOffsets[i]);

        let cursorIndent = 0;
        if (hasCursor) {
          const nx = bx / radius, ny = by / radius, nz = bz / radius;
          const cLen = Math.sqrt(
            _cursorLocal.x * _cursorLocal.x +
            _cursorLocal.y * _cursorLocal.y +
            _cursorLocal.z * _cursorLocal.z,
          ) || 1;
          const cnx = _cursorLocal.x / cLen;
          const cny = _cursorLocal.y / cLen;
          const cnz = _cursorLocal.z / cLen;

          const cosAng = nx * cnx + ny * cny + nz * cnz;
          const ang = Math.acos(Math.min(1, Math.max(-1, cosAng)));

          const indentRadius = 0.7;
          if (ang < indentRadius) {
            const t = ang / indentRadius;
            cursorIndent = -(1 - t * t) * 0.06 * ci;
          } else if (ang < indentRadius + 0.5) {
            const rt = (ang - indentRadius) / 0.5;
            cursorIndent = Math.sin(rt * Math.PI) * 0.01 * ci;
          }
        }

        const s = 1 + breathFactor + audioDisp + cursorIndent;
        const tx = bx * s + tangents[i3] * jitter,
          ty = by * s + tangents[i3 + 1] * jitter,
          tz = bz * s + tangents[i3 + 2] * jitter;

        vel[i3] += (tx - curPos[i3]) * SPRING_K;
        vel[i3 + 1] += (ty - curPos[i3 + 1]) * SPRING_K;
        vel[i3 + 2] += (tz - curPos[i3 + 2]) * SPRING_K;

        vel[i3] *= DAMPING;
        vel[i3 + 1] *= DAMPING;
        vel[i3 + 2] *= DAMPING;
        curPos[i3] += vel[i3];
        curPos[i3 + 1] += vel[i3 + 1];
        curPos[i3 + 2] += vel[i3 + 2];

        sizes[i] = BASE_SIZE + particleAmp * ar * 0.15;
      }

      geo.attributes.position.needsUpdate = true;
      (geo.attributes.aSize as THREE.BufferAttribute).needsUpdate = true;

      renderer.render(scene, camera);
    }

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      geo.dispose();
      mat.dispose();
      occluderGeo.dispose();
      occluderMat.dispose();
      renderer.dispose();
    };
  }, [particleCount, sphereColor1, sphereColor2]);

  // ── Mouse / Touch ──────────────────────────────────────

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function update(cx: number, cy: number) {
      const r = el!.getBoundingClientRect();
      mouseRef.current = {
        x: (cx - r.left) / r.width,
        y: (cy - r.top) / r.height,
        active: true,
      };
    }
    const onMM = (e: MouseEvent) => update(e.clientX, e.clientY);
    const onTM = (e: TouchEvent) => {
      if (e.touches[0]) update(e.touches[0].clientX, e.touches[0].clientY);
    };
    const off = () => {
      mouseRef.current.active = false;
    };

    el.addEventListener("mousemove", onMM);
    el.addEventListener("touchmove", onTM, { passive: true });
    el.addEventListener("mouseleave", off);
    el.addEventListener("touchend", off);
    return () => {
      el.removeEventListener("mousemove", onMM);
      el.removeEventListener("touchmove", onTM);
      el.removeEventListener("mouseleave", off);
      el.removeEventListener("touchend", off);
    };
  }, []);

  // ── Audio cleanup on unmount ───────────────────────────

  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        try {
          sourceRef.current.stop();
        } catch {
          /* already stopped */
        }
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // ── Audio playback ─────────────────────────────────────

  const playAudio = useCallback(async () => {
    const myId = ++playIdRef.current;

    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
      } catch {
        /* already stopped */
      }
      sourceRef.current = null;
    }

    setShowTranslation(true);
    setIsPlaying(true);

    const lang = direction === "en-es" ? "es" : "en";
    const urlBase = audioBaseUrl || "";
    const url = `${urlBase}/audio/translator/${selectedWord.key}_${lang}.mp3`;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") await ctx.resume();

    if (!analyserRef.current) {
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyser.connect(ctx.destination);
      analyserRef.current = analyser;
    }

    let buffer = audioCacheRef.current.get(url);
    if (!buffer) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${res.status}`);
        const raw = await res.arrayBuffer();
        buffer = await ctx.decodeAudioData(raw);
        audioCacheRef.current.set(url, buffer);
      } catch {
        syntheticPulseRef.current = 1;
        setTimeout(() => {
          if (playIdRef.current === myId) setIsPlaying(false);
        }, 1500);
        return;
      }
    }

    if (playIdRef.current !== myId) return;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(analyserRef.current!);
    source.onended = () => {
      if (playIdRef.current === myId) {
        setIsPlaying(false);
        sourceRef.current = null;
      }
    };
    sourceRef.current = source;
    source.start();
  }, [selectedWord, direction, audioBaseUrl]);

  // ── Derived ────────────────────────────────────────────

  const isSpanish = direction === "es-en";
  const sourceWord = isSpanish ? selectedWord.es : selectedWord.en;
  const targetWord = isSpanish ? selectedWord.en : selectedWord.es;
  const activeBg = isSpanish ? "#f0f0f0" : "#000000";
  const textColor = isSpanish ? "#111111" : "#ffffff";
  const textMuted = isSpanish ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.5)";

  // ── Responsive panel style ─────────────────────────────

  const isMobile = breakpoint === "mobile";
  const isTablet = breakpoint === "tablet";

  const panelPos: React.CSSProperties = isMobile
    ? { left: 16, right: 16, bottom: 24 }
    : {
        left: "50%",
        transform: "translateX(-50%)",
        bottom: isTablet ? 40 : 48,
        width: "100%",
        maxWidth: isTablet ? 500 : 600,
      };

  const panelPad = isMobile ? 16 : isTablet ? 20 : 24;
  const panelRadius = isMobile ? 16 : 20;
  const isLongWord = sourceWord.length + targetWord.length > 20;
  const resultSize = isMobile ? 32 : isTablet ? (isLongWord ? 36 : 40) : (isLongWord ? 42 : 48);
  const pillMinH = isMobile ? 44 : 36;

  // ── Render ─────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 500,
        background: activeBg,
        overflow: "hidden",
        transition: "background 0.4s ease",
      }}
    >
      <style>{`
        .th-pills::-webkit-scrollbar{display:none}
        .th-pills{scrollbar-width:none;-ms-overflow-style:none}
      `}</style>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          opacity: ready ? 1 : 0,
          transition: "opacity 0.6s ease-out",
        }}
      />

      {/* Bottom gradient */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: `linear-gradient(to top, ${activeBg}, transparent)`,
          transition: "background 0.4s ease",
          pointerEvents: "none",
        }}
      />

      {/* Toggle — top center */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? 24 : 40,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          opacity: ready ? 1 : 0,
          transition: "opacity 0.5s ease-out 0.2s",
        }}
      >
        <span style={{
          fontSize: 13,
          fontWeight: 500,
          fontStyle: "italic",
          color: textColor,
          transition: "color 0.4s ease",
        }}>
          {isSpanish ? "Espa\u00f1ol" : "English"}
        </span>
        <button
          onClick={() => {
            setDirection((d) => (d === "en-es" ? "es-en" : "en-es"));
            setShowTranslation(false);
          }}
          style={{
            position: "relative",
            width: 52,
            height: 28,
            borderRadius: 14,
            border: "none",
            background: isSpanish ? "#c4c4c4" : "#fff",
            cursor: "pointer",
            outline: "none",
            transition: "background 0.3s ease",
          }}
        >
          <motion.div
            animate={{ x: isSpanish ? 26 : 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            style={{
              position: "absolute",
              top: 2,
              left: 0,
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: isSpanish ? "#fff" : "#000",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          />
        </button>
      </div>

      {/* Translation result — top right */}
      <div
        ref={resultWrapRef}
        style={{
          position: "absolute",
          top: isMobile ? 24 : 40,
          left: "55%",
          right: isMobile ? 24 : 48,
          zIndex: 10,
          opacity: ready ? 1 : 0,
          transition: "opacity 0.5s ease-out 0.2s",
          display: "flex",
          justifyContent: "flex-end",
          overflow: "hidden",
        }}
      >
        <AnimatePresence mode="wait">
          {showTranslation && (
            <motion.div
              key={`${selectedWord.key}-${direction}`}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              ref={resultRef}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: isMobile ? 8 : 14,
                whiteSpace: "nowrap",
                transformOrigin: "right center",
                transform: `scale(${resultScale})`,
              }}
            >
              <span
                style={{
                  fontSize: resultSize,
                  fontWeight: 600,
                  color: textColor,
                  transition: "color 0.4s ease",
                }}
              >
                {sourceWord}
              </span>
              <span
                style={{
                  fontSize: resultSize * 0.5,
                  color: textMuted,
                }}
              >
                {"\u2192"}
              </span>
              <span
                style={{
                  fontSize: resultSize,
                  fontWeight: 600,
                  color: sphereColor1,
                }}
              >
                {targetWord}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom panel — pills + play */}
      <div
        style={{
          position: "absolute",
          ...panelPos,
          padding: panelPad,
          borderRadius: panelRadius,
          background: isSpanish ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: isSpanish ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.1)",
          zIndex: 10,
          opacity: ready ? 1 : 0,
          transform: `${panelPos.transform || ""} translateY(${ready ? 0 : 12}px)`.trim(),
          transition: "opacity 0.5s ease-out 0.2s, transform 0.5s ease-out 0.2s, background 0.4s ease, border-color 0.4s ease",
        }}
      >
        {/* Pills */}
        <div
          className="th-pills"
          style={{
            display: "flex",
            gap: 8,
            overflowX: isMobile || isTablet ? "auto" : "hidden",
            overflowY: "hidden",
            flexWrap: !isMobile && !isTablet ? "wrap" : "nowrap",
            paddingBottom: 12,
            marginBottom: 16,
          }}
        >
          {WORDS.map((w) => {
            const active = w.key === selectedWord.key;
            return (
              <button
                key={w.key}
                onClick={() => {
                  setSelectedWord(w);
                  setShowTranslation(false);
                }}
                onDoubleClick={() => {
                  setSelectedWord(w);
                  playAudio();
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: 9999,
                  border: `1px solid ${active ? sphereColor1 : isSpanish ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.15)"}`,
                  background: active ? sphereColor1 : "transparent",
                  color: active ? "#fff" : textMuted,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                  minHeight: pillMinH,
                  fontFamily: "inherit",
                  outline: "none",
                  flexShrink: 0,
                }}
              >
                {w.en}
              </button>
            );
          })}
        </div>

        <span style={{
          display: "block",
          fontSize: 12,
          fontStyle: "italic",
          color: textMuted,
          transition: "color 0.4s ease",
          textAlign: "center",
        }}>
          Double-click a word to hear its translation
        </span>
      </div>
    </div>
  );
}

// ── Framer Property Controls ─────────────────────────────

addPropertyControls(TranslatorHero, {
  sphereColor1: {
    type: ControlType.Color,
    title: "Sphere Color 1",
    defaultValue: "#bd5931",
  },
  sphereColor2: {
    type: ControlType.Color,
    title: "Sphere Color 2",
    defaultValue: "#e8a87c",
  },
  particleCount: {
    type: ControlType.Number,
    title: "Particles",
    min: 1000,
    max: 15000,
    step: 500,
    defaultValue: 10000,
  },
  audioBaseUrl: {
    type: ControlType.String,
    title: "Audio Base URL",
    defaultValue: "",
    description: "Your Vercel deployment URL (e.g. https://your-site.vercel.app)",
  },
  cursorInfluence: {
    type: ControlType.Number,
    title: "Cursor Influence",
    min: 0,
    max: 2,
    step: 0.1,
    defaultValue: 1,
  },
  audioReactivity: {
    type: ControlType.Number,
    title: "Audio Reactivity",
    min: 0,
    max: 3,
    step: 0.1,
    defaultValue: 1.5,
  },
  idleRotationSpeed: {
    type: ControlType.Number,
    title: "Rotation Speed",
    min: 0,
    max: 0.01,
    step: 0.001,
    defaultValue: 0,
  },
});
