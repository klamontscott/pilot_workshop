import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { books, getCoverUrl, type Book } from '../lib/bookData'

// ── Dimensions ─────────────────────────────────────────────────
// Book lying flat. Viewed from slightly above and to the right.
//   W = spine length (left-to-right)
//   D = cover depth (front-to-back)
//   H = thickness (vertical)
//
// CSS 3D cuboid face positions (container W×H, depth D):
//   Front  (W×H): translateZ(D/2)
//   Back   (W×H): rotateY(180deg) translateZ(D/2)
//   Top    (W×D): translateY((H-D)/2) rotateX(90deg) translateZ(H/2)
//   Bottom (W×D): translateY((H-D)/2) rotateX(-90deg) translateZ(H/2)
//   Right  (D×H): translateX((W-D)/2) rotateY(90deg) translateZ(W/2)
//   Left   (D×H): translateX((W-D)/2) rotateY(-90deg) translateZ(W/2)

const W = 520
const D = 160
const BASE_H = 56

/** Darken a hex color by a factor (0 = black, 1 = unchanged) */
function darken(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const dr = Math.round(r * factor)
  const dg = Math.round(g * factor)
  const db = Math.round(b * factor)
  return `rgb(${dr},${dg},${db})`
}

// ── Shelf Book (lying flat) ───────────────────────────────────

function Book3D({ book }: { book: Book }) {
  const [coverLoaded, setCoverLoaded] = useState(false)
  const [coverError, setCoverError] = useState(false)
  const H = Math.round(BASE_H * (book.thickness ?? 1))

  return (
    <div
      style={{
        width: W + 100,
        height: H + D + 60,
        perspective: 1600,
        perspectiveOrigin: '50% 40%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Shadow (separate from 3D container to avoid flattening) */}
      <div
        style={{
          position: 'absolute',
          width: W * 0.75,
          height: D * 0.4,
          bottom: '12%',
          left: '52%',
          transform: 'translateX(-50%) skewX(5deg)',
          background: 'radial-gradient(ellipse at 55% 50%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          width: W,
          height: H,
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: 'rotateX(-18deg) rotateY(-15deg)',
        }}
      >
        {/* FRONT — spine (extended 1px top/bottom to close sub-pixel gaps) */}
        <div
          style={{
            position: 'absolute',
            width: W,
            height: H + 2,
            top: -1,
            backgroundColor: book.spineColor,
            transform: `translateZ(${D / 2}px)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            backfaceVisibility: 'hidden',
          }}
        >
          <span style={spineAuthorStyle}>{book.author}</span>
          <span style={spineTitleStyle}>{book.title}</span>
          <div style={{ width: 20 }} />
        </div>

        {/* BACK */}
        <div
          style={{
            position: 'absolute',
            width: W,
            height: H,
            backgroundColor: darken(book.spineColor, 0.6),
            transform: `rotateY(180deg) translateZ(${D / 2}px)`,
            backfaceVisibility: 'hidden',
          }}
        />

        {/* TOP — cover */}
        <div
          style={{
            position: 'absolute',
            width: W,
            height: D,
            backgroundColor: book.spineColor,
            transform: `translateY(${(H - D) / 2}px) rotateX(90deg) translateZ(${H / 2}px)`,
            overflow: 'hidden',
            backfaceVisibility: 'hidden',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)',
          }}
        >
          {!coverError && (
            <img
              src={getCoverUrl(book.isbn, 'M')}
              alt=""
              onLoad={() => setCoverLoaded(true)}
              onError={() => setCoverError(true)}
              style={{
                width: '102%',
                height: '102%',
                marginLeft: '-1%',
                marginTop: '-1%',
                objectFit: 'cover',
                opacity: coverLoaded ? 1 : 0,
                transition: 'opacity 0.4s ease',
              }}
            />
          )}
          {(coverError || !coverLoaded) && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(135deg, ${book.spineColor}, ${book.accentColor})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18, fontWeight: 600, textAlign: 'center' }}>
                {book.title}
              </span>
            </div>
          )}
        </div>

        {/* BOTTOM */}
        <div
          style={{
            position: 'absolute',
            width: W,
            height: D,
            backgroundColor: darken(book.spineColor, 0.5),
            transform: `translateY(${(H - D) / 2}px) rotateX(-90deg) translateZ(${H / 2}px)`,
            backfaceVisibility: 'hidden',
          }}
        />

        {/* RIGHT — page edges (extended 1px to close gaps) */}
        <div
          style={{
            position: 'absolute',
            width: D,
            height: H + 2,
            top: -1,
            transform: `translateX(${(W - D) / 2}px) rotateY(90deg) translateZ(${W / 2}px)`,
            background: 'repeating-linear-gradient(to right, #F5F0E8 0px, #F5F0E8 2px, #EBE4D6 2px, #EBE4D6 4px)',
            backfaceVisibility: 'hidden',
          }}
        />

        {/* LEFT — spine edge */}
        <div
          style={{
            position: 'absolute',
            width: D,
            height: H,
            backgroundColor: darken(book.spineColor, 0.7),
            transform: `translateX(${(W - D) / 2}px) rotateY(-90deg) translateZ(${W / 2}px)`,
            backfaceVisibility: 'hidden',
          }}
        />
      </div>
    </div>
  )
}

// ── Spine text styles ─────────────────────────────────────────

const spineAuthorStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.65)',
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '35%',
}

const spineTitleStyle: React.CSSProperties = {
  color: '#fff',
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: '0.02em',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '45%',
  textAlign: 'center',
}

// ── Main Bookshelf (single book for iteration) ───────────────

export default function Bookshelf({ onClose }: { onClose?: () => void }) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const reducedMotion = useReducedMotion() ?? false

  const handleClose = useCallback(() => {
    if (selectedBook) {
      setSelectedBook(null)
    } else {
      onClose?.()
    }
  }, [selectedBook, onClose])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleClose])

  const book = books[0]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: selectedBook ? selectedBook.accentColor : '#141414',
        transition: 'background-color 0.5s ease',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 32px',
          zIndex: 1,
        }}
      >
        <button
          onClick={handleClose}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: '#fff',
            width: 40,
            height: 40,
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
          }}
          aria-label={selectedBook ? 'Back to shelf' : 'Close bookshelf'}
        >
          {selectedBook ? '\u2190' : '\u2715'}
        </button>
        <h1
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Bookshelf
        </h1>
        <div style={{ width: 40 }} />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {!selectedBook && (
          <motion.div
            key="shelf"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setSelectedBook(book)}
            style={{ cursor: 'pointer' }}
          >
            <Book3D book={book} />
          </motion.div>
        )}
        {selectedBook && (
          <motion.div
            key="detail"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              display: 'flex',
              gap: 48,
              alignItems: 'center',
              padding: '0 32px',
              maxWidth: 900,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <DetailBook3D book={selectedBook} />
            <DetailText book={selectedBook} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Detail Book (upright, showing cover) ──────────────────────

function DetailBook3D({ book }: { book: Book }) {
  const [coverLoaded, setCoverLoaded] = useState(false)
  const [coverError, setCoverError] = useState(false)
  const thickness = Math.round(BASE_H * (book.thickness ?? 1))
  const coverW = 260
  const coverH = 380

  return (
    <div
      style={{
        perspective: 1400,
        perspectiveOrigin: '50% 50%',
        width: coverW + thickness + 40,
        height: coverH + 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: coverW,
          height: coverH,
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: 'rotateY(-30deg) rotateX(3deg)',
        }}
      >
        {/* Cover (front) */}
        <div
          style={{
            position: 'absolute',
            width: coverW,
            height: coverH,
            backgroundColor: book.spineColor,
            transform: `translateZ(${thickness / 2}px)`,
            overflow: 'hidden',
            borderRadius: '0 3px 3px 0',
            backfaceVisibility: 'hidden',
          }}
        >
          {!coverError && (
            <img
              src={getCoverUrl(book.isbn, 'L')}
              alt={`${book.title} cover`}
              onLoad={() => setCoverLoaded(true)}
              onError={() => setCoverError(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: coverLoaded ? 1 : 0,
                transition: 'opacity 0.4s ease',
              }}
            />
          )}
          {(coverError || !coverLoaded) && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(160deg, ${book.spineColor}, ${book.accentColor})`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 28,
                gap: 10,
              }}
            >
              <span style={{ color: '#fff', fontSize: 22, fontWeight: 700, textAlign: 'center' }}>
                {book.title}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{book.author}</span>
            </div>
          )}
        </div>

        {/* Back cover */}
        <div
          style={{
            position: 'absolute',
            width: coverW,
            height: coverH,
            backgroundColor: darken(book.spineColor, 0.6),
            transform: `rotateY(180deg) translateZ(${thickness / 2}px)`,
            backfaceVisibility: 'hidden',
          }}
        />

        {/* Spine (left edge) */}
        <div
          style={{
            position: 'absolute',
            width: thickness,
            height: coverH,
            backgroundColor: darken(book.spineColor, 0.8),
            transform: `translateX(${(coverW - thickness) / 2}px) rotateY(-90deg) translateZ(${coverW / 2}px)`,
            backfaceVisibility: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: 10,
              fontWeight: 600,
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {book.title}
          </span>
        </div>

        {/* Page edges (right) */}
        <div
          style={{
            position: 'absolute',
            width: thickness,
            height: coverH,
            transform: `translateX(${(coverW - thickness) / 2}px) rotateY(90deg) translateZ(${coverW / 2}px)`,
            background: 'repeating-linear-gradient(to right, #F5F0E8 0px, #F5F0E8 2px, #EBE4D6 2px, #EBE4D6 4px)',
            backfaceVisibility: 'hidden',
          }}
        />

        {/* Top edge */}
        <div
          style={{
            position: 'absolute',
            width: coverW,
            height: thickness,
            transform: `translateY(${(coverH - thickness) / 2}px) rotateX(90deg) translateZ(${coverH / 2}px)`,
            background: 'repeating-linear-gradient(to bottom, #F5F0E8 0px, #F5F0E8 2px, #EBE4D6 2px, #EBE4D6 4px)',
            backfaceVisibility: 'hidden',
          }}
        />

        {/* Bottom edge */}
        <div
          style={{
            position: 'absolute',
            width: coverW,
            height: thickness,
            background: '#E8E0D0',
            transform: `translateY(${(coverH - thickness) / 2}px) rotateX(-90deg) translateZ(${coverH / 2}px)`,
            backfaceVisibility: 'hidden',
          }}
        />
      </div>
    </div>
  )
}

// ── Detail Text ───────────────────────────────────────────────

function DetailText({ book }: { book: Book }) {
  return (
    <div style={{ flex: 1, minWidth: 260, maxWidth: 400, color: '#fff' }}>
      <h2
        style={{
          fontSize: 32,
          fontWeight: 700,
          lineHeight: 1.15,
          marginBottom: 8,
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        {book.title}
      </h2>
      <p style={{ fontSize: 15, fontStyle: 'italic', opacity: 0.7, marginBottom: 24 }}>
        {book.author}
      </p>
      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.2)', marginBottom: 24 }} />
      <p style={{ fontSize: 15, lineHeight: 1.7, opacity: 0.9, marginBottom: 28 }}>
        {book.description}
      </p>
      {book.personalNote && (
        <div style={{ borderLeft: '3px solid rgba(255,255,255,0.3)', paddingLeft: 20, marginBottom: 28 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              opacity: 0.5,
              marginBottom: 8,
            }}
          >
            Keith's Take
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.65, opacity: 0.85, fontStyle: 'italic' }}>
            {book.personalNote}
          </p>
        </div>
      )}
      <a
        href={`https://www.goodreads.com/search?q=${encodeURIComponent(book.title + ' ' + book.author)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 20px',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 6,
          color: '#fff',
          textDecoration: 'none',
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        View on Goodreads
        <span style={{ fontSize: 11 }}>{'\u2197'}</span>
      </a>
    </div>
  )
}
