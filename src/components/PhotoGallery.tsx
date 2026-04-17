import { useStore } from '../lib/store'
import { useState, useCallback, useEffect, useRef } from 'react'

type Category = 'all' | 'sports' | 'street' | 'product' | 'events'

interface Photo {
  id: number
  file: string
  title: string
  category: Exclude<Category, 'all'>
}

const PHOTOS: Photo[] = [
  // ── Sports (24) ──
  { id: 1, file: 'Ohlone_Home_Sac_City-27.jpg', title: 'Ohlone vs Sac City', category: 'sports' },
  { id: 2, file: 'Ohlone_Home_Sac_City-47.jpg', title: 'Ohlone vs Sac City', category: 'sports' },
  { id: 3, file: 'Ohlone_Home_Sac_City-51.jpg', title: 'Ohlone vs Sac City', category: 'sports' },
  { id: 4, file: 'Ohlone_Home_Sac_City-114.jpg', title: 'Ohlone vs Sac City', category: 'sports' },
  { id: 5, file: 'Ohlone_Home_Sac_City-115.jpg', title: 'Ohlone vs Sac City', category: 'sports' },
  { id: 6, file: 'Ohlone_Home_Sac_City-116.jpg', title: 'Ohlone vs Sac City', category: 'sports' },
  { id: 7, file: 'Ohlone_Home_Sac_City-117.jpg', title: 'Ohlone vs Sac City', category: 'sports' },
  { id: 8, file: 'Ohlone_Home_Sac_City-128.jpg', title: 'Ohlone vs Sac City', category: 'sports' },
  { id: 9, file: 'Ohlone_Homecoming2023-31.jpg', title: 'Ohlone Homecoming', category: 'sports' },
  { id: 10, file: 'Ohlone_Homecoming2023-141.jpg', title: 'Ohlone Homecoming', category: 'sports' },
  { id: 11, file: 'Ohlone_Homecoming2023-155.jpg', title: 'Ohlone Homecoming', category: 'sports' },
  { id: 12, file: 'Ohlone_Homecoming2023-159.jpg', title: 'Ohlone Homecoming', category: 'sports' },
  { id: 13, file: 'Ohlone_Homecoming2023-194.jpg', title: 'Ohlone Homecoming', category: 'sports' },
  { id: 14, file: 'Ohlone_Homecoming2023-200.jpg', title: 'Ohlone Homecoming', category: 'sports' },
  { id: 15, file: 'Ohlone_Homecoming2023-205.jpg', title: 'Ohlone Homecoming', category: 'sports' },
  { id: 16, file: 'Ohlone_Homecoming2023-214.jpg', title: 'Ohlone Homecoming', category: 'sports' },
  { id: 17, file: 'Ohlone_Homecoming2023-219.jpg', title: 'Ohlone Homecoming', category: 'sports' },
  { id: 18, file: 'Ohlone_Homecoming2023-220.jpg', title: 'Ohlone Homecoming', category: 'sports' },
  { id: 19, file: 'Ohlone_v_Alameda-90.jpg', title: 'Ohlone vs Alameda', category: 'sports' },
  { id: 20, file: 'Ohlone_v_Alameda-97.jpg', title: 'Ohlone vs Alameda', category: 'sports' },
  { id: 21, file: 'Ohlone_v_Alameda-107.jpg', title: 'Ohlone vs Alameda', category: 'sports' },
  { id: 22, file: 'Ohlone_v_Napa-48.jpg', title: 'Ohlone vs Napa', category: 'sports' },
  { id: 23, file: 'Ohlone_v_Napa-50.jpg', title: 'Ohlone vs Napa', category: 'sports' },
  { id: 24, file: 'SPSV_Final-03.jpg', title: 'Jalen Scott — SPSV Bruins', category: 'sports' },

  // ── Street Photography (21) ──
  { id: 25, file: 'bathtime-1.jpg', title: 'Bath Time', category: 'street' },
  { id: 26, file: 'bathtime-2.jpg', title: 'Bath Time II', category: 'street' },
  { id: 27, file: 'Bird_simple-1.jpg', title: 'Pelican Over the Bay', category: 'street' },
  { id: 28, file: 'bros-1.jpg', title: 'Bros', category: 'street' },
  { id: 29, file: 'ferrybuilding-1.jpg', title: 'Ferry Building', category: 'street' },
  { id: 30, file: 'ggsil-1.jpg', title: 'Golden Gate', category: 'street' },
  { id: 31, file: 'goodside-1.jpg', title: 'Good Side', category: 'street' },
  { id: 32, file: 'hey_-1.jpg', title: 'Hey!', category: 'street' },
  { id: 33, file: 'mine-1.jpg', title: 'Mine', category: 'street' },
  { id: 34, file: 'Musicman-1.jpg', title: 'Music Man', category: 'street' },
  { id: 35, file: 'pepchill-1.jpg', title: 'Pep Chill', category: 'street' },
  { id: 36, file: 'PepTounge-1.jpg', title: 'Pep Tongue', category: 'street' },
  { id: 37, file: 'rock-1.jpg', title: 'Through the Rocks', category: 'street' },
  { id: 38, file: 'shoeline-1.jpg', title: 'Shoe Line', category: 'street' },
  { id: 39, file: 'Slow-1.jpg', title: 'Slow', category: 'street' },
  { id: 40, file: 'Sq-1.jpg', title: 'Squirrel', category: 'street' },
  { id: 41, file: 'sunset-1.jpg', title: 'Sunset', category: 'street' },
  { id: 42, file: 'sunset-2.jpg', title: 'Sunset Silhouette', category: 'street' },
  { id: 43, file: 'train-1.jpg', title: 'Tracks', category: 'street' },
  { id: 44, file: 'train-2.jpg', title: 'Freight', category: 'street' },
  { id: 81, file: 'jeremy-1.jpg', title: 'Jeremy', category: 'street' },

  // ── Product (6) ──
  { id: 45, file: 'Tide_HoldingBottle_Banner-1.jpg', title: 'Tide — Bottle', category: 'product' },
  { id: 46, file: 'Tide_Thumbnail-1.jpg', title: 'Tide — Thumbnail', category: 'product' },
  { id: 48, file: 'TidePods_Thumbnail-1.jpg', title: 'Tide Pods', category: 'product' },
  { id: 49, file: 'Strawberries_Thumbnail-1.jpg', title: 'Strawberries', category: 'product' },
  { id: 50, file: 'Drink_Pairing.JPG', title: 'Drink Pairing', category: 'product' },

  // ── Events (30) ──
  { id: 51, file: 'Sam+Kim_25Anniversary-22.jpg', title: '25th Anniversary', category: 'events' },
  { id: 52, file: 'Sam+Kim_25Anniversary-34.jpg', title: '25th Anniversary', category: 'events' },
  { id: 53, file: 'Sam+Kim_25Anniversary-35.jpg', title: '25th Anniversary', category: 'events' },
  { id: 54, file: 'Sam+Kim_25Anniversary-42.jpg', title: '25th Anniversary', category: 'events' },
  { id: 55, file: 'Sam+Kim_25Anniversary-43.jpg', title: '25th Anniversary', category: 'events' },
  { id: 56, file: 'Sam+Kim_25Anniversary-152.jpg', title: '25th Anniversary', category: 'events' },
  { id: 57, file: 'Sam+Kim_25Anniversary-155.jpg', title: '25th Anniversary', category: 'events' },
  { id: 58, file: 'Sam+Kim_25Anniversary-156.jpg', title: '25th Anniversary', category: 'events' },
  { id: 59, file: 'Sam+Kim_25Anniversary-164.jpg', title: '25th Anniversary', category: 'events' },
  { id: 60, file: 'Sam+Kim_25Anniversary-195.jpg', title: '25th Anniversary', category: 'events' },
  { id: 61, file: 'Sam+Kim_25Anniversary-216.jpg', title: '25th Anniversary', category: 'events' },
  { id: 62, file: 'Sam+Kim_25Anniversary-221.jpg', title: '25th Anniversary', category: 'events' },
  { id: 63, file: 'Sam+Kim_25Anniversary-255.jpg', title: '25th Anniversary', category: 'events' },
  { id: 64, file: 'Sam+Kim_25Anniversary-256.jpg', title: '25th Anniversary', category: 'events' },
  { id: 65, file: 'Sam+Kim_25Anniversary-273.jpg', title: '25th Anniversary', category: 'events' },
  { id: 66, file: 'Sam+Kim_25Anniversary-300__1.jpg', title: '25th Anniversary', category: 'events' },
  { id: 67, file: 'Sam+Kim_25Anniversary-306.jpg', title: '25th Anniversary', category: 'events' },
  { id: 68, file: 'Sam+Kim_25Anniversary-319.jpg', title: '25th Anniversary', category: 'events' },
  { id: 69, file: 'Sam+Kim_25Anniversary-322.jpg', title: '25th Anniversary', category: 'events' },
  { id: 70, file: 'Sam+Kim_25Anniversary-332.jpg', title: '25th Anniversary', category: 'events' },
  { id: 71, file: 'Sam+Kim_25Anniversary-343.jpg', title: '25th Anniversary', category: 'events' },
  { id: 72, file: 'Sam+Kim_25Anniversary-344.jpg', title: '25th Anniversary', category: 'events' },
  { id: 73, file: 'Sam+Kim_25Anniversary-345.jpg', title: '25th Anniversary', category: 'events' },
  { id: 74, file: 'Sam+Kim_25Anniversary-363.jpg', title: '25th Anniversary', category: 'events' },
  { id: 75, file: 'Sam+Kim_25Anniversary-411.jpg', title: '25th Anniversary', category: 'events' },
  { id: 76, file: 'Sam_Bday-113.jpg', title: 'Birthday', category: 'events' },
  { id: 77, file: 'Sam_Bday-114.jpg', title: 'Birthday', category: 'events' },
  { id: 78, file: 'Sam_Bday-115.jpg', title: 'Birthday', category: 'events' },
  { id: 79, file: 'Sam_Bday-128.jpg', title: 'Birthday', category: 'events' },
  { id: 80, file: 'HanselandGretel-213__1.jpg', title: 'Hansel & Gretel', category: 'events' },
]

const FILTERS: { label: string; value: Category }[] = [
  { label: 'All', value: 'all' },
  { label: 'Sports', value: 'sports' },
  { label: 'Street', value: 'street' },
  { label: 'Product', value: 'product' },
  { label: 'Events', value: 'events' },
]

// ── Global likes (jsonblob.com) ──
const LIKES_BLOB_ID = '019d78a9-33f3-7c42-a47e-82b2581e69e1'
const LIKES_URL = `https://jsonblob.com/api/jsonBlob/${LIKES_BLOB_ID}`
const LIKES_CACHE_KEY = 'photo-likes-cache'
const MY_LIKES_KEY = 'photo-likes-mine'

type LikesMap = Record<string, number>

function getCachedLikes(): LikesMap {
  try {
    return JSON.parse(localStorage.getItem(LIKES_CACHE_KEY) || '{}')
  } catch {
    return {}
  }
}

function getMyLikes(): Set<number> {
  try {
    return new Set(JSON.parse(localStorage.getItem(MY_LIKES_KEY) || '[]'))
  } catch {
    return new Set()
  }
}

function saveMyLikes(set: Set<number>) {
  localStorage.setItem(MY_LIKES_KEY, JSON.stringify([...set]))
}

async function fetchLikes(): Promise<LikesMap> {
  try {
    const res = await fetch(LIKES_URL, {
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) return getCachedLikes()
    const data = await res.json()
    localStorage.setItem(LIKES_CACHE_KEY, JSON.stringify(data))
    return data
  } catch {
    return getCachedLikes()
  }
}

async function sendLike(photoId: number): Promise<LikesMap> {
  try {
    const current = await fetchLikes()
    const key = String(photoId)
    current[key] = (current[key] || 0) + 1
    await fetch(LIKES_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(current),
    })
    localStorage.setItem(LIKES_CACHE_KEY, JSON.stringify(current))
    return current
  } catch {
    return getCachedLikes()
  }
}

// ── Heart button component ──
function HeartButton({
  photoId,
  likes,
  myLikes,
  onLike,
  size = 'small',
}: {
  photoId: number
  likes: LikesMap
  myLikes: Set<number>
  onLike: (id: number) => void
  size?: 'small' | 'large'
}) {
  const count = likes[String(photoId)] || 0
  const liked = myLikes.has(photoId)
  const isSmall = size === 'small'

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onLike(photoId)
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: isSmall ? '4px' : '8px',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)',
        border: 'none',
        borderRadius: '100px',
        padding: isSmall ? '5px 10px' : '8px 14px',
        cursor: 'pointer',
        color: 'white',
        fontSize: isSmall ? '12px' : '15px',
        fontWeight: 500,
        transition: 'transform 0.15s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <svg
        width={isSmall ? 14 : 20}
        height={isSmall ? 14 : 20}
        viewBox="0 0 24 24"
        fill={liked ? '#ff4d6a' : 'none'}
        stroke={liked ? '#ff4d6a' : 'rgba(255,255,255,0.8)'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {count > 0 && <span>{count}</span>}
    </button>
  )
}

export default function PhotoGallery() {
  const { showPhotoGallery, setShowPhotoGallery } = useStore()
  const [activeFilter, setActiveFilter] = useState<Category>('all')
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null)
  const [lightboxIdx, setLightboxIdx] = useState(-1)
  const [likes, setLikes] = useState<LikesMap>(getCachedLikes)
  const [myLikes, setMyLikes] = useState<Set<number>>(getMyLikes)
  const likePending = useRef(false)

  // Fetch global likes on open
  useEffect(() => {
    if (!showPhotoGallery) return
    fetchLikes().then(setLikes)
  }, [showPhotoGallery])

  const handleLike = useCallback(
    async (photoId: number) => {
      if (myLikes.has(photoId) || likePending.current) return
      likePending.current = true

      // Optimistic update
      const key = String(photoId)
      setLikes((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }))
      const next = new Set(myLikes)
      next.add(photoId)
      setMyLikes(next)
      saveMyLikes(next)

      // Persist to server
      const updated = await sendLike(photoId)
      setLikes(updated)
      likePending.current = false
    },
    [myLikes],
  )

  const filtered =
    activeFilter === 'all' ? PHOTOS : PHOTOS.filter((p) => p.category === activeFilter)

  const openLightbox = useCallback((photo: Photo, idx: number) => {
    setLightboxPhoto(photo)
    setLightboxIdx(idx)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxPhoto(null)
    setLightboxIdx(-1)
  }, [])

  const navigateLightbox = useCallback(
    (dir: 1 | -1) => {
      const next = lightboxIdx + dir
      if (next >= 0 && next < filtered.length) {
        setLightboxPhoto(filtered[next])
        setLightboxIdx(next)
      }
    },
    [lightboxIdx, filtered],
  )

  // Keyboard nav for lightbox
  useEffect(() => {
    if (!lightboxPhoto) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') navigateLightbox(1)
      if (e.key === 'ArrowLeft') navigateLightbox(-1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxPhoto, closeLightbox, navigateLightbox])

  if (!showPhotoGallery) return null

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(8, 8, 12, 0.96)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            flexShrink: 0,
            padding: '28px 40px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {/* Close */}
          <button
            style={{
              position: 'absolute',
              top: '20px',
              right: '24px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '20px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            onClick={() => setShowPhotoGallery(false)}
          >
            &#x2715;
          </button>

          {/* Title */}
          <h2
            style={{
              color: 'white',
              fontSize: '28px',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            Photography
          </h2>

          {/* Filter pills + contact */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {FILTERS.map((f) => {
              const isActive = activeFilter === f.value
              const count =
                f.value === 'all'
                  ? PHOTOS.length
                  : PHOTOS.filter((p) => p.category === f.value).length
              return (
                <button
                  key={f.value}
                  onClick={() => setActiveFilter(f.value)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '100px',
                    border: isActive
                      ? '1px solid rgba(255,255,255,0.5)'
                      : '1px solid rgba(255,255,255,0.12)',
                    background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                    color: isActive ? 'white' : 'rgba(255,255,255,0.55)',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
                  }}
                >
                  {f.label}
                  <span style={{ fontSize: '12px', opacity: 0.5 }}>{count}</span>
                </button>
              )
            })}

            {/* Divider */}
            <div
              style={{
                width: '1px',
                height: '20px',
                background: 'rgba(255,255,255,0.15)',
              }}
            />

            {/* Contact CTA */}
            <a
              href="mailto:klamontscott@gmail.com?subject=Photography%20Inquiry"
              style={{
                padding: '8px 20px',
                borderRadius: '100px',
                border: '1px solid #ff6b35',
                background: '#ff6b35',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e85a28'
                e.currentTarget.style.borderColor = '#e85a28'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ff6b35'
                e.currentTarget.style.borderColor = '#ff6b35'
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Book a Shoot
            </a>
          </div>
        </div>

        {/* Grid */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '24px 40px 40px',
          }}
        >
          <div
            className="photo-grid"
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              columnCount: 3,
              columnGap: '12px',
            }}
          >
            {filtered.map((photo, idx) => (
              <div
                key={photo.id}
                className="photo-card"
                style={{
                  breakInside: 'avoid',
                  marginBottom: '12px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                onClick={() => openLightbox(photo, idx)}
              >
                <img
                  src={`/photos/${photo.file}`}
                  alt={photo.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    display: 'block',
                    transition: 'transform 0.3s ease, filter 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)'
                    e.currentTarget.style.filter = 'brightness(1.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.filter = 'brightness(1)'
                  }}
                />
                {/* Heart overlay on thumbnail */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                  }}
                  className="heart-overlay"
                >
                  <HeartButton
                    photoId={photo.id}
                    likes={likes}
                    myLikes={myLikes}
                    onLike={handleLike}
                    size="small"
                  />
                </div>
                {/* Always show if has likes */}
                {(likes[String(photo.id)] || 0) > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                    }}
                    className="heart-count"
                  >
                    <HeartButton
                      photoId={photo.id}
                      likes={likes}
                      myLikes={myLikes}
                      onLike={handleLike}
                      size="small"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxPhoto && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
          }}
          onClick={closeLightbox}
        >
          {/* Close lightbox */}
          <button
            style={{
              position: 'absolute',
              top: '20px',
              right: '24px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '20px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
            onClick={closeLightbox}
          >
            &#x2715;
          </button>

          {/* Prev */}
          {lightboxIdx > 0 && (
            <button
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                fontSize: '22px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
              onClick={(e) => {
                e.stopPropagation()
                navigateLightbox(-1)
              }}
            >
              &#8249;
            </button>
          )}

          {/* Next */}
          {lightboxIdx < filtered.length - 1 && (
            <button
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                fontSize: '22px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
              onClick={(e) => {
                e.stopPropagation()
                navigateLightbox(1)
              }}
            >
              &#8250;
            </button>
          )}

          {/* Image */}
          <img
            src={`/photos/${lightboxPhoto.file}`}
            alt={lightboxPhoto.title}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: '4px',
            }}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Bottom bar: caption + like */}
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '14px',
                fontWeight: 500,
                textAlign: 'center',
              }}
            >
              {lightboxPhoto.title}
              <span style={{ marginLeft: '12px', opacity: 0.4 }}>
                {lightboxIdx + 1} / {filtered.length}
              </span>
            </div>
            <HeartButton
              photoId={lightboxPhoto.id}
              likes={likes}
              myLikes={myLikes}
              onLike={handleLike}
              size="large"
            />
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .photo-grid { column-count: 2 !important; }
        }
        @media (max-width: 560px) {
          .photo-grid { column-count: 1 !important; }
        }
        .photo-card .heart-overlay { opacity: 0 !important; }
        .photo-card:hover .heart-overlay { opacity: 1 !important; }
        .photo-card .heart-count { opacity: 1; }
        .photo-card:hover .heart-count { opacity: 0; }
      `}</style>
    </>
  )
}
