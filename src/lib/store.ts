import { create } from 'zustand'

const savedLamp = typeof window !== 'undefined' ? localStorage.getItem('lampState') : null
const initialLightOn = savedLamp !== 'off'

interface PortfolioState {
  lightOn: boolean
  toggleLight: () => void
  hoveredObject: string | null
  setHoveredObject: (name: string | null) => void
  showPhotoGallery: boolean
  setShowPhotoGallery: (show: boolean) => void
  showBasketballGame: boolean
  setShowBasketballGame: (show: boolean) => void
  showBookshelf: boolean
  setShowBookshelf: (show: boolean) => void
  renderStyle: 'realistic' | 'cartoon'
  toggleRenderStyle: () => void
}

export const useStore = create<PortfolioState>((set) => ({
  lightOn: initialLightOn,
  toggleLight: () =>
    set((state) => {
      const next = !state.lightOn
      localStorage.setItem('lampState', next ? 'on' : 'off')
      return { lightOn: next }
    }),
  hoveredObject: null,
  setHoveredObject: (name) => set({ hoveredObject: name }),
  showPhotoGallery: false,
  setShowPhotoGallery: (show) => set({ showPhotoGallery: show }),
  showBasketballGame: false,
  setShowBasketballGame: (show) => set({ showBasketballGame: show }),
  showBookshelf: false,
  setShowBookshelf: (show) => set({ showBookshelf: show }),
  renderStyle: 'realistic',
  toggleRenderStyle: () =>
    set((s) => ({
      renderStyle: s.renderStyle === 'realistic' ? 'cartoon' : 'realistic',
    })),
}))
