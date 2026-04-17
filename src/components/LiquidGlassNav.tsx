import { useState, useRef, useEffect, type JSX } from 'react'

const LINKS = [
  { label: 'GitHub', url: 'https://github.com/klamontscott', icon: 'github' as const },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/keith-scottii/', icon: 'linkedin' as const },
  { label: 'X', url: 'https://x.com/lamont_scottII', icon: 'x' as const },
  { label: 'Instagram', url: 'https://www.instagram.com/lamont_scott2/', icon: 'instagram' as const },
]

const NAV_ITEMS = ['Home', 'Work']

function Icon({ type, size = 16 }: { type: string; size?: number }) {
  const s = { width: size, height: size, display: 'block' as const }
  const paths: Record<string, JSX.Element> = {
    github: (
      <svg style={s} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    linkedin: (
      <svg style={s} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    portfolio: (
      <svg style={s} viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 3h18a1 1 0 011 1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zm1 2v14h16V5H4zm2 2h4v4H6V7zm6 0h6v2h-6V7zm0 4h6v2h-6v-2zM6 13h4v2H6v-2z" />
      </svg>
    ),
    x: (
      <svg style={s} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    instagram: (
      <svg style={s} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  }
  return paths[type] || null
}

export default function LiquidGlassNav() {
  const [activeNav, setActiveNav] = useState('Home')
  const [profileOpen, setProfileOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<number | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
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
          "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Contact Panel — full width of nav bar */}
      {profileOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 12px)',
            left: 0,
            right: 0,
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(40px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
            borderRadius: 20,
            padding: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow:
              '0 12px 40px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.25)',
            animation:
              'slideUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          }}
        >
          {LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredLink(i)}
              onMouseLeave={() => setHoveredLink(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 12,
                textDecoration: 'none',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: '-0.01em',
                background:
                  hoveredLink === i
                    ? 'rgba(255, 255, 255, 0.12)'
                    : 'transparent',
                transition: 'background 0.2s ease',
                animation: `fadeIn 0.2s ease ${i * 0.04}s both`,
              }}
            >
              <span
                style={{
                  opacity: hoveredLink === i ? 1 : 0.7,
                  transition: 'opacity 0.2s ease',
                  display: 'flex',
                }}
              >
                <Icon type={link.icon} size={16} />
              </span>
              {link.label}
            </a>
          ))}

          {/* Caret */}
          <div
            style={{
              position: 'absolute',
              bottom: -6,
              left: 30,
              transform: 'rotate(45deg)',
              width: 12,
              height: 12,
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(40px)',
              borderRight: '1px solid rgba(255, 255, 255, 0.2)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          />
        </div>
      )}

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
            onClick={() => setProfileOpen(!profileOpen)}
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
                onClick={() => setActiveNav(item)}
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
