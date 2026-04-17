# Keith Scott - Interactive 3D Portfolio

A high-craft 3D portfolio experience built with React Three Fiber, showcasing design work through an interactive workspace environment.

## Tech Stack

- **Vite** - Fast build tool and dev server
- **React** + **TypeScript** - UI framework
- **React Three Fiber** + **Drei** - 3D rendering
- **Three.js** - WebGL engine
- **Zustand** - State management
- **Tailwind CSS** - Styling

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
portfolio/
├── public/
│   └── models/          # 3D models (.glb files)
├── src/
│   ├── components/
│   │   ├── Scene.tsx           # Main 3D canvas
│   │   ├── Room.tsx             # GLTF model loader
│   │   ├── InteractiveObject.tsx  # Reusable interactive component
│   │   ├── PhotoGallery.tsx     # Photo gallery modal
│   │   └── BasketballGame.tsx   # Arcade game
│   ├── lib/
│   │   ├── store.ts             # Zustand state
│   │   └── analytics.ts         # Event tracking
│   ├── App.tsx
│   └── index.css
└── vite.config.ts
```

## Features

### Interactive Objects

- **Computer/Monitor** - Opens case studies in new tab
- **Bookshelf** - Links to Goodreads profile
- **Camera** - Opens photo gallery
- **Basketball Hoop** - Launches arcade game
- **Pendant Light** - Toggles day/night lighting

### User Experience

- Hover effects on interactive objects
- Smooth camera orbit controls
- Intuitive exploration without tutorials
- Analytics tracking for all interactions

## Adding Your Blender Model

1. Export your Blender scene as `.glb` format
2. Place it in `public/models/workspace.glb`
3. See `BLENDER-EXPORT-GUIDE.md` for detailed instructions

The code will automatically load and render your model.

## Customization

### Update Case Study Link

In `src/components/Room.tsx`, update the computer click handler:

```typescript
window.open('https://your-framer-url.com', '_blank')
```

### Update Goodreads Link

In `src/components/Room.tsx`, update the bookshelf click handler:

```typescript
window.open('https://goodreads.com/your-profile', '_blank')
```

### Add Your Photos

Replace placeholder photos in `src/components/PhotoGallery.tsx`:

```typescript
const PHOTOS = [
  { id: 1, url: '/photos/photo1.jpg', title: 'My Photo 1' },
  // ... more photos
]
```

## Performance

Target metrics:
- Load time: <3 seconds
- Frame rate: 60fps
- File size: <10MB

Tips:
- Use Draco compression for large models
- Optimize textures (2K max)
- Use instancing for repeated objects (books)

## Analytics

Events tracked:
- `computer_click` - Case study link clicked
- `bookshelf_click` - Goodreads visited
- `camera_click` - Photo gallery opened
- `basketball_click` - Game started
- `light_toggle` - Light switched

View analytics in browser console or integrate with Vercel Analytics.

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Manual Build

```bash
npm run build
# Upload `dist/` folder to your hosting provider
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Requires WebGL support.

## Development Notes

- Placeholder geometry will be replaced when you add your Blender model
- All interactive features are working with placeholders
- Focus on craft - small details matter
- Iterate on lighting and materials after model import

## License

Private portfolio project - All rights reserved

---

Built with craft. Quality > Quantity.
