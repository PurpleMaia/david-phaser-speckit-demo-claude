# Phase 0: Research - Adventure Game Skeleton

**Feature**: Adventure Game Skeleton
**Date**: 2025-11-24
**Phase**: Technical Research & Discovery

## Current Project State

### Existing Infrastructure

- **Repository**: Empty greenfield project (no existing source code)
- **Package Manager**: None (npm will be initialized)
- **Build System**: None (Vite will be configured)
- **Dependencies**: None (clean start)
- **Source Structure**: No `src/` directory exists yet

### Constitutional Constraints Review

Per `.specify/memory/constitution.md`:

1. **Simplicity First**: Keep implementation minimal, avoid abstractions
2. **Minimal Dependencies**: Only Phaser 3 + Vite + essential tooling
3. **Code-Generated SVG Assets (NON-NEGOTIABLE)**: All graphics must be SVG strings
4. **Local-First Execution**: Frontend-only, no backend/API
5. **Standard Project Structure**: Use conventional JavaScript project layout

## Technology Stack Research

### Game Engine: Phaser 3

**Version**: Latest stable (^3.80.0 as of research date)

**Rationale**:
- Industry-standard 2D game framework for browser games
- Excellent documentation and community support
- Built-in support for sprites, physics, input handling, and scenes
- Works well with modern bundlers (Vite)
- Constitutional compliance: Minimal dependency (one framework)

**Key Features Used**:
- Scene system for game structure
- Arcade Physics for collision detection
- Input handling (keyboard events)
- Texture loading from data URIs
- Sprite rendering and management

### Build Tool: Vite

**Version**: Latest stable (^5.0.0)

**Rationale**:
- Fast development server with HMR (hot module replacement)
- Simple configuration for vanilla JavaScript projects
- Excellent ES module support
- Small, focused tool (constitutional "minimal dependencies" principle)
- Industry standard for modern frontend projects

**Configuration Needs**:
- Basic HTML entry point
- Development server (port 5173 by default)
- Build optimization for production

### Language: JavaScript (ES2020+)

**Rationale**:
- User specifically requested JavaScript over TypeScript
- ES2020+ provides modern syntax (async/await, modules, optional chaining)
- No build complexity from type checking
- Faster development iteration
- Constitutional "simplicity first" principle

## SVG Asset Pipeline Research

### Challenge

Phaser expects image files or URLs, but constitution mandates code-generated SVGs (no bitmap files).

### Solution Architecture

**Approach**: Data URI Conversion

1. **SVG Generation** (`src/svg/`):
   - Functions that return SVG strings
   - Example: `createPlayerSvg()` returns `<svg>...</svg>` string

2. **Data URI Utility** (`src/utils/svgLoader.js`):
   ```javascript
   function svgToDataUri(svgString) {
     return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgString);
   }
   ```

3. **Phaser Integration**:
   - In scene's `preload()`: use `this.load.svg(key, dataUri)`
   - Or use `this.textures.addSVG(key, svgString)` if supported
   - Create sprites from loaded textures

**Research Finding**: Phaser 3 supports loading SVGs via:
- `this.load.svg(key, url)` - for URLs (we'll use data URIs)
- `this.textures.addSVG(key, data)` - for inline data (preferred method)

**Recommendation**: Use data URIs with `load.svg()` for consistency with Phaser's asset loader patterns.

## Project Structure Design

### Directory Layout

```
project-root/
├── src/
│   ├── main.js           # Entry point, Phaser config
│   ├── scenes/
│   │   └── MainScene.js  # Primary game scene
│   ├── svg/
│   │   ├── player.js     # createPlayerSvg()
│   │   ├── npc.js        # createNpcSvg()
│   │   ├── chest.js      # createChestSvg()
│   │   ├── wall.js       # createWallSvg()
│   │   └── floor.js      # createFloorSvg()
│   └── utils/
│       └── svgLoader.js  # Data URI conversion
├── public/
│   └── index.html        # HTML entry point
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
└── README.md             # Setup and run instructions
```

**Rationale**:
- Clear separation: scenes, assets (SVG), utilities
- Standard Vite project structure (public/ for static assets)
- Easy to extend: add new scenes or SVG assets to respective folders
- Constitutional "standard project structure" compliance

## Dependency Analysis

### Required Dependencies

**Production**:
- `phaser` (^3.80.0) - Game engine

**Development**:
- `vite` (^5.0.0) - Build tool and dev server

**Total**: 2 dependencies (constitutional "minimal dependencies" principle ✓)

### Justification

- **Phaser**: Core requirement - cannot build 2D game without game engine
- **Vite**: Required for modern JavaScript bundling and dev server (`npm run dev` requirement)

**No additional dependencies needed**:
- No utility libraries (lodash, etc.) - use vanilla JS
- No UI frameworks - Phaser handles all rendering
- No state management - simple game state in scene variables
- No testing frameworks initially - per constitution, testing is optional

## Technical Constraints

### Performance Targets

- Game loads within 3 seconds (per spec SC-003)
- Interaction feedback < 0.5 seconds (per spec SC-004)
- 60 FPS target for smooth movement

**How Achieved**:
- Minimal asset count (5-6 small SVGs)
- No heavy physics calculations (simple AABB collision)
- Vite production build optimization
- Phaser's optimized rendering pipeline

### Browser Compatibility

**Target**: Modern browsers (ES2020+)
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**No Support Needed**:
- Internet Explorer (per constitutional assumptions)
- Mobile browsers (desktop-only per spec)
- Legacy ES5 environments

### Resolution & Display

- Fixed canvas size: 800x600 pixels
- No responsive layout needed
- No fullscreen mode required
- Pixel-perfect rendering (Phaser default)

## Phaser 3 Integration Research

### Scene Lifecycle

```
constructor() → init() → preload() → create() → update()
```

**Implementation Plan**:
1. `preload()`: Load all SVG textures as data URIs
2. `create()`: Set up game world, player, NPC, object, physics
3. `update()`: Handle continuous input, collision checks

### Physics System

**Choice**: Arcade Physics (simplest option)

**Rationale**:
- Lightweight AABB collision (perfect for top-down games)
- Built-in velocity and collision handling
- Simpler than Matter.js (physics engine overkill for this game)
- Constitutional "simplicity first" principle

**Configuration**:
```javascript
physics: {
  default: 'arcade',
  arcade: {
    gravity: { y: 0 },  // Top-down view = no gravity
    debug: false
  }
}
```

### Input Handling

**Methods**:
- `this.input.keyboard.createCursorKeys()` - Arrow keys
- `this.input.keyboard.addKeys('W,A,S,D')` - WASD
- `this.input.keyboard.on('keydown-E')` - Interaction key

**Proximity Detection**:
- `Phaser.Math.Distance.Between(player, target)` < threshold
- Threshold: 60 pixels (per spec assumption ~50-80px)

## Risk Assessment

### Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| SVG → Phaser integration complexity | Medium | Test data URI approach early in Phase 1 |
| Phaser version compatibility | Low | Use LTS version, check official Vite examples |
| Performance with SVG rendering | Low | SVGs are small, Phaser handles efficiently |
| Collision detection edge cases | Low | Use Phaser's built-in overlap checks |

### Constitutional Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope creep beyond skeleton | Medium | Strict adherence to spec's "Out of Scope" section |
| Over-engineering (abstractions) | Medium | Follow "simplicity first" - inline code over classes |
| Additional dependencies | Low | Review each import against necessity criteria |
| Bitmap assets accidentally added | Low | Code review + no asset files in public/ |

## Open Questions

None - user provided clear implementation guidance:
- ✓ Vite + JavaScript confirmed
- ✓ Phaser 3 confirmed
- ✓ Project structure specified
- ✓ SVG integration approach defined
- ✓ npm scripts specified

## Next Steps (Phase 1)

1. **Data Model Design** (`data-model.md`):
   - Define game entities (Player, NPC, InteractiveObject, Room)
   - Specify entity properties and behaviors
   - Define interaction state machine

2. **Contracts** (`contracts/`):
   - SVG generator function signatures
   - Phaser scene interface
   - Configuration object structure

3. **Quickstart Guide** (`quickstart.md`):
   - Development workflow
   - How to add new NPCs/objects
   - How to create new SVG assets

## Research Summary

**Status**: ✅ Ready for Phase 1 Design

**Key Findings**:
- Greenfield project - no existing code to integrate with
- Phaser 3 + Vite + JavaScript stack validated
- SVG data URI approach confirmed technically viable
- All constitutional constraints can be satisfied
- No blocking technical issues identified
- Dependency count: 2 (within constitutional limits)

**Recommendation**: Proceed to Phase 1 (Design) with confidence.
