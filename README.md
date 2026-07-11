# Keith Scott — Interactive Portfolio

An interactive 3D portfolio built with React, TypeScript, and Three.js. Features an immersive workspace you can explore, a gallery of 10 interactive experiments, physics-based games, audio-reactive visuals, and polished micro-interactions.

## Features

### 3D Workspace

- Navigable Three.js room with interactive objects — monitor, bookshelf, camera, basketball hoop, lamp
- 7-layer lighting system with day/night toggle
- Custom Blender model loaded via GLTF
- Post-processing: bloom, ambient occlusion, tone mapping
- Hover glow and click interactions with event tracking

### Experiments Gallery

- Folder-based desktop UI with drag-and-drop
- 10 interactive experiments with info modals and live previews
- Responsive breakpoints for desktop, tablet, and mobile
- Animated ticker and route overlay

### Built-in Experiments

| # | Experiment | What it does |
|---|---|---|
| 001 | **3D Portfolio Room** | Immersive Three.js workspace with navigable space and interactive displays |
| 002 | **Photo Gallery** | Masonry layout with category filtering, lightbox, and cloud-powered likes |
| 003 | **Hoop Dreams** | 3D basketball arcade with Rapier physics, streak multipliers, and global leaderboard |
| 004 | **Space Runner** | Canvas-based 2D platformer with sprite animation and collision detection |
| 005 | **Bookcase** | Interactive 3D bookshelf with pull-out book details using CSS 3D transforms |
| 006 | **Hablamos** | Bilingual translation hero with audio-reactive particle sphere and GLSL shaders |
| 007 | **Animated Grid Banner** | Canvas-drawn tracers racing across rows with color-coded motion trails |
| 008 | **Typewriter** | Looping type/delete animation with realistic cadence and blinking cursor |
| 009 | **Dynamic Carousel** | Spring-animated before/after carousel for the Jump Start onboarding case study |
| 010 | **PGR Logo Animation** | Step-by-step After Effects tutorial with 7-slide video carousel |

## Tech Stack

| Layer | Tools |
|---|---|
| Framework | React 19, TypeScript, Vite |
| 3D | Three.js, React Three Fiber, Drei, Rapier Physics |
| Animation | Framer Motion, Spring Physics, CSS Transitions |
| Styling | Tailwind CSS, PostCSS |
| State | Zustand (persisted to localStorage) |
| Deployment | Vercel |

## Quick Start

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build
npm run preview   # preview production build
```

## Quick Tips

### Experiments Gallery

- Click any folder to open its info modal with description, tags, stack, and metadata
- Experiments with live previews render interactive components as hero sections
- GitHub links are included for code-based experiments
- Drag folders to rearrange on the desktop

### 3D Workspace

- Click the **monitor** to open case studies
- Click the **bookshelf** to browse the reading list
- Click the **camera** to open the photo gallery
- Click the **basketball hoop** to launch the arcade game
- Click the **pendant lamp** to toggle day/night lighting

### Hoop Dreams

- Hold and release to shoot — timing and power affect trajectory
- Chain consecutive baskets for streak multipliers
- Scores tracked on a global leaderboard

### Hablamos

- Hover the particle sphere to see it react to cursor movement
- Audio playback drives sphere distortion in real-time
- Supports English–Spanish word pairs with variable playback speed

### PGR Logo Carousel

- Click through 7 slides showing the Progressive logo animation build process
- Each slide includes a looping video and step-by-step explanation
- Slides transition with a masked slide animation

## Project Structure

```
src/
  components/
    Scene.tsx                    # 3D canvas + 7-layer lighting
    Room.tsx                     # GLTF model + interactive objects
    Basketball3DGameRapier.tsx   # 3D arcade game with physics
    PhotoGallery.tsx             # Masonry gallery modal
    LiquidGlassNav.tsx           # Frosted glass navigation
    SoftSceneEffects.tsx         # Post-processing pipeline
    experiments/
      ExperimentsDesktop.tsx     # Folder-based experiment gallery
      Typewriter.tsx             # Typewriter animation
      AccordionModule.tsx        # Spring-animated accordion
      MetricsGrid.tsx            # Canvas grid tracer animation
      PGRLogoCarousel.tsx        # Video carousel with slide transitions
      TranslatorHero.tsx         # Audio-reactive translation hero
  lib/
    store.ts                     # Zustand state management
    analytics.ts                 # Event tracking
    physics.ts                   # Physics utilities
public/
  models/                        # GLTF models and textures
  audio/translator/              # English-Spanish audio pairs
  photos/                        # Gallery photography
  pgr-logo/                     # Logo animation video exports
  games/                         # Canvas game assets
```

## Adding Experiments

Append to the `EXPERIMENTS` array in `ExperimentsDesktop.tsx`:

```typescript
{
  id: "my-experiment",
  label: "My Experiment",
  number: "011",
  contentType: "info",
  description: "What it does.",
  tags: ["Tag1", "Tag2"],
  category: "Category / Subcategory",
  stack: ["React", "TypeScript"],
  position: { x: 40, y: 50 },
  github: "https://github.com/...",       // optional
  url: "https://live-demo.com",           // optional
  previewComponent: "my-preview",         // optional — renders live in modal
}
```

## Deployment

Deployed on Vercel. Push to `main` to trigger a production build.

```bash
npm i -g vercel
vercel
```

## Author

**Keith Scott** — Senior Product Designer (Harvard GSD) specializing in enterprise systems design.

## License

All rights reserved.
