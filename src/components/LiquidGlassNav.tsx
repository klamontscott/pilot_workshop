import { useState, useRef, useEffect, type JSX } from 'react'

const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    url: 'https://github.com/keith-scottii',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/keith-scottii',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'X',
    url: 'https://x.com/keithscottii',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/keithscottii',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
]

const NAV_ITEMS = ['Home', 'Work']

export default function LiquidGlassNav() {
  const [activeNav, setActiveNav] = useState('Home')
  const [profileOpen, setProfileOpen] = useState(false)
  const [showWorkPrompt, setShowWorkPrompt] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
        setShowWorkPrompt(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Info Panel popover */}
      {profileOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 12px)',
            left: 0,
            right: 0,
            background: 'rgba(40, 38, 36, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 16,
            padding: 20,
            color: '#e0ddd8',
            animation: 'slideUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          }}
        >
          {/* Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <img
              src="/photos/profile.jpg"
              alt="Keith Scott"
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                objectFit: 'cover',
                objectPosition: '68% 25%',
              }}
            />
            <div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: '#f0eeea' }}>
                Keith Scott
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#999' }}>
                Senior Product Designer
              </p>
            </div>
          </div>

          {/* Bio */}
          <p style={{ margin: '0 0 12px', fontSize: 12, color: '#aaa', lineHeight: 1.5 }}>
            I'm a Product Designer based in the Bay Area and I design products, 3D worlds, the occasional video game, and probably out with my camera or on my bike.
          </p>

          {/* Location */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 16,
              paddingLeft: 2,
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#888"
              strokeWidth="2"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <span style={{ fontSize: 12, color: '#888' }}>SF Bay Area</span>
          </div>

          {/* Divider */}
          <div
            style={{
              height: 0.5,
              background: 'rgba(255, 255, 255, 0.1)',
              marginBottom: 14,
            }}
          />

          {/* Social grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
            }}
          >
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 12px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: 10,
                  textDecoration: 'none',
                  color: '#ccc',
                  fontSize: 13,
                  transition: 'background 0.15s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
              >
                {link.icon}
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Work prompt */}
      {showWorkPrompt && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 12px)',
            left: 0,
            right: 0,
            background: 'rgba(40, 38, 36, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 16,
            padding: 20,
            color: '#e0ddd8',
            textAlign: 'center',
            animation: 'slideUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          }}
        >
          <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 500, color: '#f0eeea' }}>
            Do you want to see my case studies?
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => {
                setShowWorkPrompt(false)
                setActiveNav('Home')
              }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 10,
                border: 'none',
                background: 'rgba(255, 255, 255, 0.06)',
                color: '#ccc',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
            >
              No
            </button>
            <button
              onClick={() => {
                window.open('https://work.keithscottii.com', '_blank')
                setShowWorkPrompt(false)
                setActiveNav('Home')
              }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 10,
                border: 'none',
                background: 'rgba(255, 255, 255, 0.18)',
                color: '#f0eeea',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)')}
            >
              Yes
            </button>
          </div>
        </div>
      )}

      {/* Nav bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(40px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
          borderRadius: 28,
          padding: '6px 8px',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow:
            '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.05)',
          position: 'relative',
        }}
      >
        {/* Profile Picture */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setProfileOpen(!profileOpen); setShowWorkPrompt(false) }}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: profileOpen
                ? '2px solid rgba(255, 187, 122, 0.8)'
                : '2px solid rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              overflow: 'hidden',
              padding: 0,
              background: 'rgba(255,255,255,0.15)',
              transition:
                'border-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
              transform: profileOpen ? 'scale(1.05)' : 'scale(1)',
              boxShadow: profileOpen
                ? '0 0 16px rgba(255, 187, 122, 0.3)'
                : '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            aria-label="Contact links"
          >
            <img
              src="/photos/profile.jpg"
              alt="Keith Scott"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: '68% 25%',
              }}
            />
          </button>
        </div>

        {/* Vertical Divider */}
        <div
          style={{
            width: 1,
            height: 28,
            background:
              'linear-gradient(to bottom, transparent, rgba(255,255,255,0.25), transparent)',
            margin: '0 10px',
            flexShrink: 0,
          }}
        />

        {/* Nav Items */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px',
            borderRadius: 22,
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item
            return (
              <button
                key={item}
                onClick={() => {
                  if (item === 'Work') {
                    setShowWorkPrompt(true)
                  } else {
                    setActiveNav(item)
                    setShowWorkPrompt(false)
                  }
                }}
                style={{
                  padding: '10px 24px',
                  borderRadius: 20,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: '-0.01em',
                  transition:
                    'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  background: isActive
                    ? 'rgba(255, 255, 255, 0.18)'
                    : 'transparent',
                  color: isActive
                    ? 'rgba(255, 255, 255, 0.95)'
                    : 'rgba(255, 255, 255, 0.55)',
                  boxShadow: isActive
                    ? 'inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.08)'
                    : 'none',
                  transform: isActive ? 'scale(1)' : 'scale(0.98)',
                }}
              >
                {item}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
