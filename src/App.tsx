import Scene from './components/Scene'
import PhotoGallery from './components/PhotoGallery'
import Basketball3DGameRapier from './components/Basketball3DGameRapier'
import LiquidGlassNav from './components/LiquidGlassNav'
import { Suspense, Component, type ReactNode } from 'react'
import './index.css'

class ErrorBoundary extends Component<
  { children: ReactNode; label: string },
  { error: Error | null }
> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[${this.props.label}]`, error, info)
  }
  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: 20,
            color: 'white',
            background: '#8b0000',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
          }}
        >
          <h2>{this.props.label} crashed:</h2>
          <div>{this.state.error.message}</div>
          <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
            {this.state.error.stack}
          </div>
          <button
            onClick={() => this.setState({ error: null })}
            style={{ marginTop: 12, padding: '6px 12px' }}
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function App() {
  return (
    <>
      {/* Main 3D scene */}
      <Scene />

      {/* Modal overlays */}
      <PhotoGallery />
      <ErrorBoundary label="Hoop Dreams">
        <Suspense fallback={<div style={{ color: 'white', padding: 20 }}>Loading...</div>}>
          <Basketball3DGameRapier />
        </Suspense>
      </ErrorBoundary>

      {/* Navigation */}
      <LiquidGlassNav />
    </>
  )
}

export default App
