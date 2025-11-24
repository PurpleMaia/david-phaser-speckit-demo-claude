# Adventure Game Skeleton

A minimal Phaser 3 top-down 2D adventure game demo built as a SpecKit + Codex CLI proof of concept.

## Description

Single-screen adventure game featuring:
- Player character with keyboard or touch controls (cross-platform)
- On-screen virtual controls for mobile devices (Phase 3)
- Collision detection with world boundaries
- NPC interaction with dialog system
- Interactive object (chest) collection with visual feedback
- Enhanced character sprites with idle animations (Phase 2)
- All visual assets generated as code-based SVGs (no bitmap files)

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   - Navigate to `http://localhost:5173/` (or the port shown in terminal)
   - Game should load and be immediately playable

## Controls

### Desktop (Keyboard)

- **Movement**: Arrow keys or WASD
- **Interact**: E or Space
  - Approach NPC and press to show dialog
  - Press again to close dialog
  - Approach chest and press to collect

### Mobile (Touch)

The game supports touch controls on mobile devices and tablets:

- **On-screen D-pad** (bottom-left): Tap and hold directional buttons to move the character
  - Four buttons: Up, Down, Left, Right arranged in cross pattern
- **Action button** (bottom-right): Tap to interact with NPCs and objects
  - Shows dialog when near NPC
  - Collects items when near chest

**Orientation**: Landscape orientation recommended for best experience (portrait support may be limited)

**Testing on Desktop**: To test mobile controls on desktop:
- Resize your browser window to less than 768px width, OR
- Use Chrome DevTools device emulation (F12 → Toggle device toolbar)
- Controls will appear automatically on narrow viewports
- You can click buttons with mouse to test functionality

## Build

To create a production build:

```bash
npm run build
```

Built files will be in the `dist/` directory.

To preview the production build:

```bash
npm run preview
```

## Project Structure

```
├── src/
│   ├── main.js              # Phaser game configuration and entry point
│   ├── scenes/
│   │   └── MainScene.js     # Main game scene with all gameplay logic
│   ├── input/               # Phase 3: Input abstraction layer
│   │   └── PlayerInput.js   # Unified keyboard + touch input interface
│   ├── ui/                  # Phase 3: UI components
│   │   └── VirtualControls.js  # On-screen touch buttons for mobile
│   ├── svg/                 # Code-generated SVG asset functions
│   │   ├── palette.js       # Central color constants (Phase 2)
│   │   ├── sprites/         # Parametric sprite generators
│   │   │   ├── createPlayerSvg.js
│   │   │   ├── createNpcSvg.js
│   │   │   ├── createChestSvg.js
│   │   │   ├── createWallTileSvg.js
│   │   │   └── createTouchButtonSvg.js  # Phase 3: Touch button graphics
│   │   └── shapes/          # Reusable shape helpers
│   └── utils/
│       ├── svgLoader.js     # SVG to data URI conversion utility
│       ├── textureLoader.js # SVG to Phaser texture loader (Phase 2)
│       └── deviceDetector.js # Phase 3: Touch/mobile device detection
├── public/                  # Static assets (currently empty)
├── index.html               # HTML entry point
├── vite.config.js           # Vite build configuration
└── package.json             # Dependencies and scripts
```

## Dependencies

- **Phaser** (^3.90.0): 2D game engine
- **Vite** (^5.4.21): Build tool and development server

## Technical Highlights

- **Frontend-only**: No backend or database required
- **Code-generated SVGs**: All visual assets created via JavaScript functions (constitutional requirement)
- **Minimal dependencies**: Only Phaser and Vite
- **Modern ES modules**: Clean ES2020+ JavaScript with standard imports
- **Local-first**: Runs entirely in browser after `npm install && npm run dev`

## Constitution

This project is governed by constitutional principles defined in `.specify/memory/constitution.md` (v1.2.0):

1. **Simplicity First** - Prioritize simple implementations over features
2. **Minimal Dependencies** - Avoid unnecessary libraries (Phaser 3 + Vite only)
3. **Code-Generated SVG Assets** - All graphics as code-generated SVGs (no bitmaps)
4. **Local-First Execution** - Frontend-only, runs with `npm install && npm run dev`
5. **Standard Project Structure** - Follow modern JavaScript conventions
6. **Cross-Platform Playability** (v1.2.0) - Keyboard remains primary, touch added as secondary input

## License

MIT
