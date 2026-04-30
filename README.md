# Vignesh Sai — Portfolio

A cinematic, dark-themed portfolio built for showcasing Unreal Engine environments, game art, and 3D visualization work.

**Live:** [vigneshsai.vercel.app](https://vigneshsai.vercel.app)

## Tech Stack

- **React 19** + **Vite 8** — Fast development and optimized builds
- **Framer Motion** — Scroll-linked parallax zoom and page transitions
- **Vanilla CSS** — Custom design system with CSS variables
- **Git LFS** — Large video asset management

## Features

- **Scroll-Triggered Zoom Parallax** — Multi-layer image grid that zooms into a fullscreen cinematic video on scroll
- **3D Carousel Gallery** — Draggable/swipeable circular gallery with 9 video projects, auto-rotation, and momentum physics
- **Fullscreen Video Player** — Portal-based overlay with unmuted audio, volume toggle, and back navigation
- **Cinematic Preloader** — Animated loading screen with progress indicator
- **Grayscale-to-Color Hover** — All images and video thumbnails transition from grayscale to full color on interaction
- **Interactive Wave Divider** — SVG wave animation reacting to mouse proximity
- **Custom Cursor Effect** — Trailing tubes cursor (desktop only)
- **Smoke Particle Background** — GPU-accelerated canvas smoke simulation
- **Scroll Minimap** — Fixed dot navigation with section labels
- **Mobile Responsive** — Touch drag for gallery, adaptive layouts, reduced effects for performance

## Project Structure

```
src/
├── components/
│   ├── Hero.jsx              # Landing section with shutter text animation
│   ├── About.jsx             # Bio section with profile image
│   ├── Projects.jsx          # Works section orchestrator
│   ├── ZoomParallax.jsx      # Scroll-driven zoom + fullscreen video
│   ├── CircularGallery.jsx   # 3D carousel with video playback
│   ├── Contact.jsx           # Contact form with animated inputs
│   ├── Navbar.jsx            # Fixed nav with mobile hamburger
│   ├── Minimap.jsx           # Scroll position indicator
│   ├── SmokeBackground.jsx   # Canvas particle system
│   ├── TubesCursorEffect.jsx # Custom cursor (desktop)
│   ├── WaveDivider.jsx       # Interactive SVG divider
│   ├── Preloader.jsx         # Loading screen
│   └── Footer.jsx            # Site footer
├── hooks/
│   ├── useWorksScene.jsx     # Scroll threshold detection
│   └── useScrollReveal.jsx   # Intersection observer reveal
├── assets/                   # Images and thumbnails
└── index.css                 # Global design tokens
public/
├── gallery/                  # Video assets (Git LFS)
│   ├── reel-01.mp4 → reel-09.mp4
└── portfolio-showcase.mp4    # Main showcase video (Git LFS)
```

## Setup

```bash
# Clone (requires Git LFS)
git lfs install
git clone https://github.com/thanishq0110/vignesh-portfolio.git
cd vignesh-portfolio

# Install dependencies
npm install

# Start dev server
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deployment

Deployed on **Vercel** with Git LFS support. Pushes to `main` trigger automatic deployments.

## License

All rights reserved. This portfolio and its content are proprietary.
