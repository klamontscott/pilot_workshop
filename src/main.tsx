import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const isBookshelfRoute = window.location.pathname === '/bookshelf'

const Bookshelf = lazy(() => import('./components/Bookshelf'))
const ExperimentsDesktop = lazy(() => import('./components/experiments/ExperimentsDesktop'))
const PhotoGallery = lazy(() => import('./components/PhotoGallery'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      {isBookshelfRoute ? (
        <Bookshelf />
      ) : (
        <>
          <div style={{ height: '100vh', display: 'flex' }}>
            <ExperimentsDesktop />
          </div>
          <PhotoGallery />
        </>
      )}
    </Suspense>
  </StrictMode>,
)
