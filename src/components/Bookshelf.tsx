import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { books, getCoverUrl, type Book } from '../lib/bookData'

// ── Dimensions ─────────────────────────────────────────────────
// Book lying flat (horizontal). We're looking at it from slightly above.
//   W = left-to-right (the long axis of the spine)
//   D = front-to-back (the cover depth / how far the book extends away)
//   H = thickness (spine height — the short vertical axis when lying flat)

const W = 520 // spine length
const D = 180 // cover depth
const BASE_H = 50 // base thickness, scaled by book.thickness

// ── Single 3D Book (shelf view) ───────────────────────────────

function Book3D({ book }: { book: Book }) {
  const [coverLoaded, setCoverLoaded] = useState(false)
  const [coverError, setCoverError] = useState(false)
  const H = BASE_H * (book.thickness ?? 1)

  // Half-dimensions for centering transforms
  const halfH = H / 2

  return (
    <div
      style={{
        // The perspective container — needs enough room for the 3D object + perspective
        width: W + D,
        height: H + D,
        perspective: 1200,
        perspectiveOrigin: '50% 30%',
      }}
    >
      {/* 3D object — all faces positioned relative to this container's center */}
      <div
        style={{
          width: W,
          height: H,
          position: 'relative',
          transformStyle: 'preserve-3d',
          // Slight rotation so we see the top face and right edge
          transform: `
            translateX(${D * 0.15}px)
            translateY(${D * 0.35}px)
            rotateX(-25deg)
            rotateY(20deg)
          `,
        }}
      >
        {/* FRONT face — the spine (faces the viewer) */}
        <div
          style={{
            position: 'absolute',
            width: W,
            height: H,
            backgroundColor: book.spineColor,
            transform: `translateZ(${halfH}px)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            backfaceVisibility: 'hidden',
          }}
        >
          <span
            style={{
              color: 'rgba(255,255,255,0.65)',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '35%',
            }}
          >
            {book.author}
          </span>
          <span
            style={{
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '45%',
              textAlign: 'center',
            }}
          >
            {book.title}
          </span>
          <div style={{ width: 20 }} />
        </div>

        {/* BACK face — hidden from this angle but completes the box */}
        <div
          style={{
            position: 'absolute',
            width: W,
            height: H,
            backgroundColor: book.spineColor,
            transform: `translateZ(-${halfH}px) rotateY(180deg)`,
            filter: 'brightness(0.7)',
            backfaceVisibility: 'hidden',
          }}
        />

        {/* TOP face — the book cover (visible because we're looking down) */}
        <div
          style={{
            position: 'absolute',
            width: W,
            height: D,
            backgroundColor: book.spineColor,
            transform: `
              rotateX(90deg)
              translateZ(0px)
              translateY(-${D / 2}px)
            `,
            overflow: 'hidden',
            backfaceVisibility: 'hidden',
          }}
        >
          {!coverError && (
            <img
              src={getCoverUrl(book.isbn, 'M')}
              alt=""
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
                background: `linear-gradient(135deg, ${book.spineColor}, ${book.accentColor})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
              }}
            >
              <span
                style={{
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: 18,
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                {book.title}
              </span>
            </div>
          )}
        </div>

        {/* BOTTOM face */}
        <div
          style={{
            position: 'absolute',
            width: W,
            height: D,
            backgroundColor: book.spineColor,
            transform: `
              rotateX(-90deg)
              translateZ(${H}px)
              translateY(-${D / 2}px)
            `,
            filter: 'brightness(0.6)',
            backfaceVisibility: 'hidden',
          }}
        />

        {/* RIGHT face — page edges */}
        <div
          style={{
            position: 'absolute',
            width: D,
            height: H,
            transform: `
              rotateY(90deg)
              translateZ(${W - D / 2}px)
              translateX(${D / 2}px)
            `,
            background:
              'repeating-linear-gradient(to right, #F5F0E8 0px, #F5F0E8 2px, #EBE4D6 2px, #EBE4D6 4px)',
            backfaceVisibility: 'hidden',
          }}
        />

        {/* LEFT face — spine edge (dark) */}
        <div
          style={{
            position: 'absolute',
            width: D,
            height: H,
            backgroundColor: book.spineColor,
            transform: `
              rotateY(-90deg)
              translateZ(${D / 2}px)
              translateX(-${D / 2}px)
            `,
            filter: 'brightness(0.75)',
            backfaceVisibility: 'hidden',
          }}
        />
      </div>
    </div>
  )
}

// ── Main Bookshelf Component (single book for now) ────────────

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

  // Just the first book for now while we nail the 3D
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
          aria-label="Close bookshelf"
        >
          {'\u2715'}
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

      {/* Single book — centered */}
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
  const thickness = BASE_H * (book.thickness ?? 1)
  const coverW = 260
  const coverH = 380
  const halfT = thickness / 2

  return (
    <div
      style={{
        perspective: 1200,
        perspectiveOrigin: '50% 50%',
        width: coverW + thickness,
        height: coverH + thickness,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: coverW,
          height: coverH,
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `
            translateX(${thickness * 0.6}px)
            rotateY(-30deg)
            rotateX(3deg)
          `,
        }}
      >
        {/* Cover (front) */}
        <div
          style={{
            position: 'absolute',
            width: coverW,
            height: coverH,
            backgroundColor: book.spineColor,
            transform: `translateZ(${halfT}px)`,
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
            backgroundColor: book.spineColor,
            transform: `translateZ(-${halfT}px) rotateY(180deg)`,
            filter: 'brightness(0.7)',
            backfaceVisibility: 'hidden',
          }}
        />

        {/* Spine (left edge) */}
        <div
          style={{
            position: 'absolute',
            width: thickness,
            height: coverH,
            backgroundColor: book.spineColor,
            transform: `rotateY(-90deg) translateZ(${thickness / 2}px) translateX(-${thickness / 2}px)`,
            filter: 'brightness(0.85)',
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
            transform: `rotateY(90deg) translateZ(${coverW - thickness / 2}px) translateX(${thickness / 2}px)`,
            background:
              'repeating-linear-gradient(to right, #F5F0E8 0px, #F5F0E8 2px, #EBE4D6 2px, #EBE4D6 4px)',
            backfaceVisibility: 'hidden',
          }}
        />

        {/* Top edge */}
        <div
          style={{
            position: 'absolute',
            width: coverW,
            height: thickness,
            transform: `rotateX(90deg) translateZ(${thickness / 2}px) translateY(-${thickness / 2}px)`,
            background:
              'repeating-linear-gradient(to bottom, #F5F0E8 0px, #F5F0E8 2px, #EBE4D6 2px, #EBE4D6 4px)',
            backfaceVisibility: 'hidden',
          }}
        />

        {/* Bottom edge */}
        <div
          style={{
            position: 'absolute',
            width: coverW,
            height: thickness,
            transform: `rotateX(-90deg) translateZ(${coverH - thickness / 2}px) translateY(${thickness / 2}px)`,
            background:
              'repeating-linear-gradient(to bottom, #F5F0E8 0px, #F5F0E8 2px, #EBE4D6 2px, #EBE4D6 4px)',
            filter: 'brightness(0.85)',
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
