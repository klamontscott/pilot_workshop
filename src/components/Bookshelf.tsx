import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { books, getCoverUrl, type Book } from '../lib/bookData'

// ── Book3D (shelf view — horizontal/flat book) ─────────────────

const BOOK_WIDTH = 600
const BOOK_DEPTH = 160
const BASE_SPINE_HEIGHT = 64

function Book3D({
  book,
  onClick,
  index,
  reducedMotion,
}: {
  book: Book
  onClick: () => void
  index: number
  reducedMotion: boolean
}) {
  const [coverLoaded, setCoverLoaded] = useState(false)
  const [coverError, setCoverError] = useState(false)
  const spineHeight = BASE_SPINE_HEIGHT * (book.thickness ?? 1)

  return (
    <motion.div
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reducedMotion
          ? { duration: 0.3 }
          : { duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }
      }
      whileHover={reducedMotion ? {} : { y: -4 }}
      onClick={onClick}
      style={{
        perspective: 800,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {/* 3D book container — rotated to show from above-left */}
      <div
        style={{
          width: BOOK_WIDTH,
          height: spineHeight,
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: 'rotateX(15deg) rotateY(-5deg)',
          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))',
          transition: 'filter 0.3s ease',
        }}
      >
        {/* Front face — spine */}
        <div
          style={{
            position: 'absolute',
            width: BOOK_WIDTH,
            height: spineHeight,
            backgroundColor: book.spineColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            borderRadius: '2px 2px 0 0',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
          }}
        >
          <span
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '30%',
            }}
          >
            {book.author}
          </span>
          <span
            style={{
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '40%',
              textAlign: 'center',
            }}
          >
            {book.title}
          </span>
          <div style={{ width: '12%' }} />
        </div>

        {/* Top face — cover art */}
        <div
          style={{
            position: 'absolute',
            width: BOOK_WIDTH,
            height: BOOK_DEPTH,
            backgroundColor: book.spineColor,
            transform: `rotateX(-90deg) translateZ(0px) translateY(-${BOOK_DEPTH}px)`,
            transformOrigin: 'top',
            overflow: 'hidden',
            borderRadius: '2px 2px 0 0',
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
          {/* Fallback gradient with title */}
          {(coverError || !coverLoaded) && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(135deg, ${book.spineColor}, ${book.accentColor})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
              }}
            >
              <span
                style={{
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: 16,
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                {book.title}
              </span>
            </div>
          )}
        </div>

        {/* Right face — page edges */}
        <div
          style={{
            position: 'absolute',
            width: BOOK_DEPTH,
            height: spineHeight,
            right: 0,
            transform: `rotateY(90deg) translateZ(0px)`,
            transformOrigin: 'right',
            background:
              'repeating-linear-gradient(to right, #F5F0E8 0px, #F5F0E8 1px, #EDE7DB 1px, #EDE7DB 3px)',
            borderRadius: '0 2px 2px 0',
            backfaceVisibility: 'hidden',
          }}
        />
      </div>
    </motion.div>
  )
}

// ── DetailBook3D (detail view — upright book showing cover) ────

function DetailBook3D({ book }: { book: Book }) {
  const [coverLoaded, setCoverLoaded] = useState(false)
  const [coverError, setCoverError] = useState(false)
  const spineHeight = BASE_SPINE_HEIGHT * (book.thickness ?? 1)
  const coverWidth = 280
  const coverHeight = 420

  return (
    <div
      style={{
        perspective: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 460,
      }}
    >
      <div
        style={{
          width: coverWidth,
          height: coverHeight,
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: 'rotateY(-25deg) rotateX(2deg)',
          filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.5))',
        }}
      >
        {/* Cover face (front) */}
        <div
          style={{
            position: 'absolute',
            width: coverWidth,
            height: coverHeight,
            backgroundColor: book.spineColor,
            borderRadius: '0 4px 4px 0',
            overflow: 'hidden',
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
                padding: 32,
                gap: 12,
              }}
            >
              <span style={{ color: '#fff', fontSize: 24, fontWeight: 700, textAlign: 'center' }}>
                {book.title}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{book.author}</span>
            </div>
          )}
        </div>

        {/* Spine (left side) */}
        <div
          style={{
            position: 'absolute',
            width: spineHeight,
            height: coverHeight,
            left: 0,
            backgroundColor: book.spineColor,
            transform: `rotateY(-90deg) translateZ(0px)`,
            transformOrigin: 'left',
            borderRadius: '4px 0 0 4px',
            filter: 'brightness(0.85)',
            backfaceVisibility: 'hidden',
          }}
        />

        {/* Page edges (right side) */}
        <div
          style={{
            position: 'absolute',
            width: spineHeight,
            height: coverHeight,
            right: 0,
            transform: `rotateY(90deg)`,
            transformOrigin: 'right',
            background:
              'repeating-linear-gradient(to right, #F5F0E8 0px, #F5F0E8 1px, #EDE7DB 1px, #EDE7DB 3px)',
            borderRadius: '0 2px 2px 0',
            backfaceVisibility: 'hidden',
          }}
        />

        {/* Top edge */}
        <div
          style={{
            position: 'absolute',
            width: coverWidth,
            height: spineHeight,
            top: 0,
            transform: `rotateX(90deg)`,
            transformOrigin: 'top',
            background:
              'repeating-linear-gradient(to bottom, #F5F0E8 0px, #F5F0E8 1px, #EDE7DB 1px, #EDE7DB 3px)',
            backfaceVisibility: 'hidden',
          }}
        />
      </div>
    </div>
  )
}

// ── Main Bookshelf Component ──────────────────────────────────

export default function Bookshelf({ onClose }: { onClose?: () => void }) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const reducedMotion = useReducedMotion() ?? false
  const scrollRef = useRef<HTMLDivElement>(null)

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
        overflow: 'hidden',
        backgroundColor: selectedBook ? selectedBook.accentColor : '#141414',
        transition: 'background-color 0.5s ease',
      }}
    >

      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 32px',
          flexShrink: 0,
        }}
      >
        {/* Back / close button */}
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
            backdropFilter: 'saturate(1.2)',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          aria-label={selectedBook ? 'Back to shelf' : 'Close bookshelf'}
        >
          {selectedBook ? '\u2190' : '\u2715'}
        </button>

        {!selectedBook && (
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
        )}

        <div style={{ width: 40 }} />
      </div>

      {/* Content area */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <AnimatePresence mode="wait">
          {selectedBook ? (
            <motion.div
              key={`detail-${selectedBook.isbn}`}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                height: '100%',
                overflow: 'auto',
                display: 'flex',
                justifyContent: 'center',
                padding: '0 32px 60px',
              }}
            >
              <DetailView book={selectedBook} />
            </motion.div>
          ) : (
            <motion.div
              key="shelf"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              ref={scrollRef}
              style={{
                height: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: '20px 32px 80px',
              }}
            >
              <div
                style={{
                  maxWidth: 800,
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 80,
                }}
              >
                {books.map((book, i) => (
                  <Book3D
                    key={book.isbn}
                    book={book}
                    index={i}
                    onClick={() => setSelectedBook(book)}
                    reducedMotion={reducedMotion}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ── Detail View ────────────────────────────────────────────────

function DetailView({ book }: { book: Book }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 64,
        alignItems: 'flex-start',
        maxWidth: 960,
        width: '100%',
        paddingTop: 20,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      {/* Left — upright 3D book */}
      <div style={{ flexShrink: 0 }}>
        <DetailBook3D book={book} />
      </div>

      {/* Right — text details */}
      <div
        style={{
          flex: 1,
          minWidth: 280,
          maxWidth: 440,
          color: '#fff',
        }}
      >
        <h2
          style={{
            fontSize: 36,
            fontWeight: 700,
            lineHeight: 1.15,
            marginBottom: 8,
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          {book.title}
        </h2>
        <p
          style={{
            fontSize: 16,
            fontStyle: 'italic',
            opacity: 0.7,
            marginBottom: 24,
          }}
        >
          {book.author}
        </p>

        <hr
          style={{
            border: 'none',
            borderTop: '1px solid rgba(255,255,255,0.2)',
            marginBottom: 24,
          }}
        />

        <p
          style={{
            fontSize: 16,
            lineHeight: 1.7,
            opacity: 0.9,
            marginBottom: 32,
          }}
        >
          {book.description}
        </p>

        {book.personalNote && (
          <div
            style={{
              borderLeft: '3px solid rgba(255,255,255,0.3)',
              paddingLeft: 20,
              marginBottom: 32,
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                opacity: 0.5,
                marginBottom: 8,
              }}
            >
              Keith's Take
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.65, opacity: 0.85, fontStyle: 'italic' }}>
              {book.personalNote}
            </p>
          </div>
        )}

        {/* Goodreads link */}
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
            fontSize: 14,
            fontWeight: 500,
            transition: 'background 0.2s, border-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
          }}
        >
          View on Goodreads
          <span style={{ fontSize: 12 }}>{'\u2197'}</span>
        </a>
      </div>
    </div>
  )
}
