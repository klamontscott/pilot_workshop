import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const springConfig = {
  type: 'spring' as const,
  stiffness: 250,
  damping: 28,
  mass: 2.5,
}

const collapseSpringConfig = {
  type: 'spring' as const,
  stiffness: 250,
  damping: 35,
  mass: 2.5,
}

const cascadeSpringConfig = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 30,
  mass: 2,
}

const PILLS = [
  {
    id: 'pill-1',
    label: 'Classroom Schedule',
    expandedTitle: 'Classroom Schedule (Before):',
    defaultWidth: 204,
    expandedHeight: 124,
    expandedContent: 'Supervisors spent full days walking new hires through setup, unable to leave even when most were ready.',
    image: '/accordion/classroom-schedule.png',
    imageWidth: 750,
    imageLeft: '27.5%',
    imageBottom: -100,
  },
  {
    id: 'pill-2',
    label: 'Self-Setup',
    expandedTitle: 'Self-Setup (After):',
    defaultWidth: 140,
    expandedHeight: 124,
    expandedContent: 'Redesigned the onboarding model around self-guided setup with targeted interventions where new hires needed them most.',
    expandedContentHighlight: 'Support down 72%.',
    image: '/accordion/self-setup.png',
    imageWidth: 750,
    imageLeft: '27.5%',
    imageBottom: -100,
  },
  {
    id: 'pill-3',
    label: 'Ticket Overload',
    expandedTitle: 'Ticket Overload (Before):',
    defaultWidth: 172,
    expandedHeight: 148,
    expandedContent: 'IT fielded an unpredictable flood of tickets from new hires and supervisors with no way to forecast volume. Phone calls turned into hour-long walkthroughs.',
    image: '/accordion/ticket-overload.png',
    imageWidth: 210,
    imageLeft: '57.5%',
    imageBottom: -40,
  },
  {
    id: 'pill-4',
    label: 'Office Hours',
    expandedTitle: 'Office Hours (After):',
    defaultWidth: 152,
    expandedHeight: 152,
    expandedContent: 'Structured IT sessions paired with the interactive guide. New hires arrived with specific sections to work through and were routed to breakout rooms by topic. Predictable volume, focused help.',
    image: '/accordion/office-hours.png',
    imageWidth: 210,
    imageLeft: '57.5%',
    imageBottom: -40,
  },
  {
    id: 'pill-5',
    label: 'PDF Binder',
    expandedTitle: 'PDF Binder (Before):',
    defaultWidth: 140,
    expandedHeight: 152,
    expandedContent: '35+ pages printed per new hire with an 8-week lead time. Multiple editors making untracked changes. Not accessible, not on brand, outdated by the time it shipped.',
    image: '/accordion/pdf-binder.png',
    imageWidth: 750,
    imageLeft: '25%',
    imageBottom: -20,
  },
  {
    id: 'pill-6',
    label: 'Interactive Guide',
    expandedTitle: 'Interactive Guide (After):',
    defaultWidth: 188,
    expandedHeight: 124,
    expandedContent: 'Replaced print with a sectioned, accessible digital guide. Built a maintenance plan for tracked edits and long-term ownership.',
    image: '/accordion/guide-1.png',
    imageSequence: [
      '/accordion/guide-1.png',
      '/accordion/guide-2.png',
      '/accordion/guide-3.png',
      '/accordion/guide-4.png',
      '/accordion/guide-5.png',
    ],
    imageWidth: 750,
    imageLeft: '28.5%',
    imageBottom: -100,
  },
]

export default function AccordionModule() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const baseScale = isFullscreen ? 1.0 : 0.65
  const scale = baseScale
  const DEFAULT_HEIGHT = 48 * scale
  const DEFAULT_BORDER_RADIUS = 24 * scale
  const PILL_GAP = 12 * scale
  const EXPANDED_WIDTH = 320 * scale
  const MODULE_WIDTH = isFullscreen ? 1000 : 650
  const MODULE_HEIGHT = isFullscreen ? 520 : 370

  const [showChevrons, setShowChevrons] = useState(false)
  const [selectedPillId, setSelectedPillId] = useState<string | null>(null)
  const [previousIndex, setPreviousIndex] = useState<number | null>(null)
  const [expandDirection, setExpandDirection] = useState<'down' | 'up'>('down')
  const [pillAnimationComplete, setPillAnimationComplete] = useState<Record<string, boolean>>({})
  const [showTextForPill, setShowTextForPill] = useState<string | null>(null)
  const [peeledOffCount, setPeeledOffCount] = useState(0)
  const textTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const peelTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false)
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") handleNavigate('up')
      if (e.key === "ArrowDown" || e.key === "ArrowRight") handleNavigate('down')
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  })

  // Peel-off sequence for pill-6
  useEffect(() => {
    peelTimersRef.current.forEach(t => clearTimeout(t))
    peelTimersRef.current = []

    if (selectedPillId === 'pill-6') {
      const pill = PILLS.find(p => p.id === 'pill-6')
      if (pill?.imageSequence && pill.imageSequence.length > 1) {
        setPeeledOffCount(0)
        const entranceDelay = 600
        const delayBefore = 300
        const peelDuration = 1700
        const delayBetween = 600

        for (let i = 0; i < pill.imageSequence.length - 1; i++) {
          const timer = setTimeout(() => {
            setPeeledOffCount(i + 1)
          }, entranceDelay + delayBefore + i * (peelDuration + delayBetween))
          peelTimersRef.current.push(timer)
        }
      }
    } else {
      setPeeledOffCount(0)
    }

    return () => {
      peelTimersRef.current.forEach(t => clearTimeout(t))
    }
  }, [selectedPillId])

  const handlePillClick = (pillId: string) => {
    if (!showChevrons) setShowChevrons(true)
    if (selectedPillId === pillId) return

    const newIndex = PILLS.findIndex(p => p.id === pillId)
    if (previousIndex !== null) {
      setExpandDirection(newIndex > previousIndex ? 'down' : 'up')
    } else {
      setExpandDirection('down')
    }

    const currentIndex = selectedPillId ? PILLS.findIndex(p => p.id === selectedPillId) : null
    if (currentIndex !== null) setPreviousIndex(currentIndex)

    setShowTextForPill(null)
    if (textTimerRef.current) clearTimeout(textTimerRef.current)

    setSelectedPillId(pillId)
    textTimerRef.current = setTimeout(() => {
      setShowTextForPill(pillId)
      textTimerRef.current = null
    }, 550)
  }

  const handleClose = () => {
    if (selectedPillId) {
      setShowTextForPill(null)
      setSelectedPillId(null)
    }
  }

  const handleNavigate = (direction: 'up' | 'down') => {
    setExpandDirection(direction)
    if (textTimerRef.current) clearTimeout(textTimerRef.current)
    setShowTextForPill(null)

    if (!selectedPillId) {
      const firstPillId = PILLS[0].id
      setSelectedPillId(firstPillId)
      setPreviousIndex(null)
      textTimerRef.current = setTimeout(() => {
        setShowTextForPill(firstPillId)
        textTimerRef.current = null
      }, 550)
      return
    }

    const currentIndex = PILLS.findIndex(p => p.id === selectedPillId)
    setPreviousIndex(currentIndex)

    const nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (nextIndex >= 0 && nextIndex < PILLS.length) {
      const newPillId = PILLS[nextIndex].id
      setSelectedPillId(newPillId)
      textTimerRef.current = setTimeout(() => {
        setShowTextForPill(newPillId)
        textTimerRef.current = null
      }, 550)
    }
  }

  const getCurrentIndex = () => {
    if (!selectedPillId) return -1
    return PILLS.findIndex(p => p.id === selectedPillId)
  }

  const isAtTop = getCurrentIndex() === 0
  const isAtBottom = getCurrentIndex() === PILLS.length - 1

  const getPillDelay = (index: number) => {
    const distance = Math.abs(index - 2)
    return distance * 0.04 + Math.random() * 0.01
  }

  const selectedPill = selectedPillId ? PILLS.find(p => p.id === selectedPillId) : null

  const accordionContent = (
      <motion.div
        style={{
          width: MODULE_WIDTH,
          height: MODULE_HEIGHT,
          backgroundColor: '#F5F5F7',
          borderRadius: 20 * scale,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Image area — right side */}
        <AnimatePresence>
          {selectedPill?.image && showTextForPill === selectedPill.id && (
            <motion.div
              key={`img-${selectedPill.id}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                position: 'absolute',
                left: selectedPill.imageLeft,
                bottom: selectedPill.imageBottom * scale,
                width: selectedPill.imageWidth * scale,
                zIndex: 5,
                pointerEvents: 'none',
              }}
            >
              {selectedPill.imageSequence ? (
                // Peel-off stack for pill-6
                <div style={{ position: 'relative' }}>
                  {selectedPill.imageSequence.map((src, i) => {
                    const isPeeled = i < peeledOffCount
                    const isTop = i === selectedPill.imageSequence!.length - 1
                    return (
                      <motion.img
                        key={src}
                        src={src}
                        animate={{
                          x: isPeeled ? 800 * scale : 0,
                          opacity: 1,
                        }}
                        transition={{
                          x: isPeeled
                            ? { duration: 1.7, ease: [0.65, 0, 0.35, 1] }
                            : { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
                        }}
                        style={{
                          width: '100%',
                          display: 'block',
                          position: isTop ? 'relative' : 'absolute',
                          top: 0,
                          left: 0,
                          zIndex: selectedPill.imageSequence!.length - i,
                        }}
                      />
                    )
                  })}
                </div>
              ) : (
                <img
                  src={selectedPill.image}
                  style={{ width: '100%', display: 'block' }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Chevrons */}
        <AnimatePresence>
          {showChevrons && (
            <motion.div
              initial={{ opacity: 0, y: 40 * scale }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                position: 'absolute',
                left: 24 * scale,
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12 * scale,
                zIndex: 20,
              }}
            >
              <motion.button
                initial={{ opacity: 0, y: 40 * scale }}
                animate={{ opacity: isAtTop ? 0.5 : 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22, mass: 1.5 }}
                onClick={() => !isAtTop && handleNavigate('up')}
                disabled={isAtTop}
                style={{
                  width: 32 * scale, height: 32 * scale, borderRadius: '50%',
                  backgroundColor: isAtTop ? '#E5E5E7' : '#ECECF0',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <svg width={16 * scale} height={16 * scale} viewBox="0 0 16 16" fill="none">
                  <path d="M4 10L8 6L12 10" stroke={isAtTop ? "#999" : "#000"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
              <motion.button
                initial={{ opacity: 0, y: 40 * scale }}
                animate={{ opacity: isAtBottom ? 0.5 : 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22, mass: 1.5, delay: 0.05 }}
                onClick={() => !isAtBottom && handleNavigate('down')}
                disabled={isAtBottom}
                style={{
                  width: 32 * scale, height: 32 * scale, borderRadius: '50%',
                  backgroundColor: isAtBottom ? '#E5E5E7' : '#ECECF0',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <svg width={16 * scale} height={16 * scale} viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 10L12 6" stroke={isAtBottom ? "#999" : "#000"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Close Button */}
        <AnimatePresence>
          {selectedPillId && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={springConfig}
              onClick={handleClose}
              style={{
                position: 'absolute', top: 24 * scale, right: 24 * scale,
                width: 32 * scale, height: 32 * scale, borderRadius: '50%',
                backgroundColor: '#ECECF0', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 30,
              }}
            >
              <svg width={16 * scale} height={16 * scale} viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4L12 12" stroke="#000" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Pills Container */}
        <motion.div
          style={{
            position: 'absolute',
            left: 76 * scale,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: PILL_GAP,
            alignItems: 'flex-start',
            zIndex: 10,
          }}
        >
          {PILLS.map((pill, index) => {
            const isExpanded = selectedPillId === pill.id
            const transformOrigin = isExpanded
              ? (expandDirection === 'down' ? 'top left' : 'bottom left')
              : 'top left'

            return (
              <motion.div
                key={pill.id}
                initial={{ opacity: 0, scale: 0.6, y: 20 * scale }}
                animate={{
                  width: isExpanded ? EXPANDED_WIDTH : pill.defaultWidth * scale,
                  height: isExpanded ? pill.expandedHeight * scale : DEFAULT_HEIGHT,
                  opacity: 1, scale: 1, y: 0,
                }}
                transition={{
                  opacity: { duration: 0.05, delay: getPillDelay(index) },
                  scale: { ...cascadeSpringConfig, delay: getPillDelay(index) + 0.05 },
                  y: { ...cascadeSpringConfig, delay: getPillDelay(index) + 0.05 },
                  width: isExpanded ? springConfig : collapseSpringConfig,
                  height: isExpanded ? springConfig : collapseSpringConfig,
                }}
                onAnimationComplete={() => {
                  if (!isExpanded) {
                    setPillAnimationComplete(prev => ({ ...prev, [pill.id]: true }))
                  }
                }}
                onClick={() => handlePillClick(pill.id)}
                style={{
                  position: 'relative',
                  borderRadius: DEFAULT_BORDER_RADIUS,
                  backgroundColor: isExpanded ? 'rgba(236,236,240,0.8)' : '#ECECF0',
                  display: 'flex', alignItems: 'center',
                  padding: isExpanded ? `${18 * scale}px ${18 * scale}px` : `0 ${16 * scale}px`,
                  cursor: 'pointer', overflow: 'hidden', transformOrigin,
                }}
              >
                {/* Icon and Title */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isExpanded ? 0 : (pillAnimationComplete[pill.id] ? 1 : 0) }}
                  transition={isExpanded ? springConfig : { duration: pillAnimationComplete[pill.id] ? 0.4 : 0 }}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <div style={{ width: 24 * scale, height: 24 * scale, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width={24 * scale} height={24 * scale} viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="11" stroke="#000" strokeWidth="1.5" fill="none" />
                      <path d="M12 7V17M7 12H17" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div style={{ marginLeft: 12 * scale, fontSize: 14 * scale, fontWeight: 500, color: '#000', whiteSpace: 'nowrap' }}>
                    {pill.label}
                  </div>
                </motion.div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {showTextForPill === pill.id && pill.expandedContent && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: 0.4 } }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                      style={{
                        position: 'absolute', left: 18 * scale, top: 0, bottom: 0,
                        width: 284 * scale, fontSize: 14 * scale, lineHeight: '1.5', color: '#000',
                        display: 'flex', alignItems: 'center',
                      }}
                    >
                      <div style={{ margin: 0 }}>
                        <span style={{ fontWeight: 600 }}>{pill.expandedTitle}</span> {pill.expandedContent}
                        {pill.expandedContentHighlight && (
                          <span style={{ fontWeight: 600, color: '#248A3D' }}> {pill.expandedContentHighlight}</span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Fullscreen button */}
        {!isFullscreen && (
          <button
            onClick={() => setIsFullscreen(true)}
            style={{
              position: 'absolute',
              right: 12,
              bottom: 12,
              width: 28,
              height: 28,
              border: '1px solid rgba(0,0,0,0.15)',
              borderRadius: 4,
              background: 'rgba(255,255,255,0.8)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 30,
            }}
            title="View fullscreen"
          >
            <svg width={14} height={14} viewBox="0 0 16 16" fill="none">
              <path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </motion.div>
  )

  if (isFullscreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        onClick={() => setIsFullscreen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setIsFullscreen(false)}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            fontSize: 18,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          &#10005;
        </button>
        <div onClick={(e) => e.stopPropagation()}>
          {accordionContent}
        </div>
      </motion.div>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      {accordionContent}
    </div>
  )
}
