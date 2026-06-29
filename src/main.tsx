import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TranslatorHero from './components/experiments/TranslatorHero'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ height: '100vh', display: 'flex' }}>
      <TranslatorHero style={{ flex: 1 }} />
    </div>
  </StrictMode>,
)
