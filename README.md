# Adventure Game Skeleton

A minimal Phaser 3 top-down 2D adventure game demo built as a SpecKit + Codex CLI proof of concept.

## Description

Single-screen adventure game featuring:
- Player character with keyboard movement (arrow keys or WASD)
- Collision detection with world boundaries
- NPC interaction with dialog system
- Interactive object (chest) collection with visual feedback
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

- **Movement**: Arrow keys or WASD
- **Interact**: E or Space
  - Approach NPC and press to show dialog
  - Press again to close dialog
  - Approach chest and press to collect

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
│   ├── svg/                 # Code-generated SVG asset functions
│   │   ├── player.js        # Blue circle player sprite
│   │   ├── npc.js           # Purple square NPC sprite
│   │   ├── chest.js         # Yellow/gold chest sprite
│   │   └── wall.js          # Gray wall tile sprite
│   └── utils/
│       └── svgLoader.js     # SVG to data URI conversion utility
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

This project is governed by constitutional principles defined in `.specify/memory/constitution.md`:

1. **Simplicity First** - Prioritize simple implementations over features
2. **Minimal Dependencies** - Avoid unnecessary libraries (Phaser 3 + Vite only)
3. **Code-Generated SVG Assets** - All graphics as code-generated SVGs (no bitmaps)
4. **Local-First Execution** - Frontend-only, runs with `npm install && npm run dev`
5. **Standard Project Structure** - Follow modern JavaScript conventions

## License

MIT
