import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ExperimentsDesktop from './components/experiments/ExperimentsDesktop'
import PhotoGallery from './components/PhotoGallery'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ height: '100vh', display: 'flex' }}>
      <ExperimentsDesktop />
    </div>
    <PhotoGallery />
  </StrictMode>,
)
