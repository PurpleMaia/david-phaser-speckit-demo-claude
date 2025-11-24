# Implementation Plan: Adventure Game Skeleton

**Branch**: `001-adventure-game-skeleton` | **Date**: 2025-11-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-adventure-game-skeleton/spec.md`

---

## Summary

Build a minimal top-down 2D adventure game skeleton using Phaser 3 that demonstrates the core mechanics of an RPG: player movement with collision detection, NPC dialog interaction, and interactive object collection. All visual assets will be code-generated SVGs (no bitmap files), and the game will run entirely in the browser with local-first architecture.

**Technical Approach**:
- **Frontend Stack**: Vite + JavaScript (ES2020+) + Phaser 3
- **Asset Pipeline**: Code-generated SVG functions → Data URI conversion → Phaser texture loading
- **Architecture**: Single-scene game with flat state management, Arcade physics for collision
- **Deployment**: Static site (no backend, no database)

---

## Technical Context

**Language/Version**: JavaScript ES2020+ (modern browsers only, no transpilation needed)

**Primary Dependencies**:
- Phaser 3 (^3.80.0) - 2D game engine for sprites, physics, input, and rendering
- Vite (^5.0.0) - Build tool and development server with HMR

**Storage**: None (N/A) - No persistence, state resets on page refresh per spec assumptions

**Testing**: Optional - Manual testing sufficient for this scope. Minimal sanity test if included (per constitution: testing secondary to running demo)

**Target Platform**: Modern desktop browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+) with ES2020+ support

**Project Type**: Frontend-only web app (Phaser 3 game)

**Performance Goals**:
- 60 FPS gameplay (16.67ms frame budget)
- < 3 second load time (per spec SC-003)
- < 0.5 second interaction feedback (per spec SC-004)
- < 500 lines of source code excluding dependencies (per spec SC-005)

**Constraints**:
- Desktop-only (no mobile/touch support required)
- 800x600 fixed resolution
- Offline-capable (no network requests)
- Constitutional: All visual assets MUST be code-generated SVGs (no bitmap files)
- Constitutional: Minimal dependencies (only Phaser + Vite permitted)

**Scale/Scope**:
- Single room/map
- 1 player character
- 1 NPC
- 1 interactive object
- Approximately 15 functional requirements (per spec FR-001 through FR-015)
- 3 user stories (movement, NPC interaction, object collection)

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Review the project constitution at `.specify/memory/constitution.md` and verify compliance:

- [x] **Simplicity First**: ✅ Single scene, flat state, no abstractions - simplest possible implementation
- [x] **Minimal Dependencies**: ✅ Only 2 dependencies (Phaser + Vite), both strictly necessary and justified
- [x] **Code-Generated SVG Assets**: ✅ All visual assets defined as JavaScript functions returning SVG strings
- [x] **Local-First Execution**: ✅ Frontend-only, no backend, no database, no API calls, works offline
- [x] **Standard Project Structure**: ✅ Standard Vite + ES modules structure (src/, public/, package.json)

**Violations Requiring Justification**: None

**Constitutional Compliance**: 100% - All principles satisfied

---

## Project Structure

### Documentation (this feature)

```text
specs/001-adventure-game-skeleton/
├── plan.md              # This file (implementation plan)
├── spec.md              # Feature specification
├── research.md          # Phase 0: Technical research
├── data-model.md        # Phase 1: Entity and state design
├── quickstart.md        # Phase 1: Developer guide
├── contracts/           # Phase 1: API contracts
│   ├── svg-generators.md      # SVG function interfaces
│   └── scene-interface.md     # Phaser scene contracts
└── checklists/
    └── requirements.md  # Spec quality validation
```

### Source Code (repository root)

```text
project-root/
├── src/
│   ├── main.js                # Entry point, Phaser game config
│   ├── scenes/
│   │   └── MainScene.js       # Primary game scene (all gameplay)
│   ├── svg/
│   │   ├── player.js          # createPlayerSvg() - blue circle + triangle
│   │   ├── npc.js             # createNpcSvg() - purple square
│   │   ├── chest.js           # createChestSvg() - yellow/gold chest
│   │   └── wall.js            # createWallSvg() - gray wall tile
│   └── utils/
│       └── svgLoader.js       # svgToDataUri() conversion utility
├── public/
│   └── index.html             # HTML entry point with game-container div
├── package.json               # Dependencies: phaser, vite
├── vite.config.js             # Vite build configuration (minimal)
├── README.md                  # Project overview, setup instructions
├── .gitignore                 # Ignore node_modules, dist, .DS_Store
└── specs/                     # Design documentation (see above)
```

**Structure Decision**: Using **Option 1: Frontend-only web app (Phaser 3 game)** from template.

**Rationale**:
- Frontend-only matches constitutional "Local-First Execution" principle
- Standard Vite structure (src/, public/) matches "Standard Project Structure" principle
- Clear separation: scenes (logic), svg (assets), utils (helpers)
- Easy to extend: add new scenes to scenes/, new assets to svg/
- Minimal: No backend/, no api/, no tests/ initially (testing optional per constitution)

---

## Complexity Tracking

No constitutional violations - this section intentionally left empty.

---

## Phase 0: Research

**Objective**: Validate technical feasibility and identify blockers

**Status**: ✅ Complete - See [research.md](./research.md)

**Key Findings**:
- ✅ Greenfield project (no existing code to integrate with)
- ✅ Phaser 3 + Vite + JavaScript stack validated
- ✅ SVG data URI approach confirmed viable (Phaser's `load.svg()` supports it)
- ✅ No blocking technical issues identified
- ✅ All constitutional constraints can be satisfied
- ✅ Dependency count: 2 (Phaser + Vite, within constitutional limits)

**Deliverables**:
- [x] Technology stack validation
- [x] SVG asset pipeline proof of concept
- [x] Phaser integration research
- [x] Risk assessment
- [x] research.md document

---

## Phase 1: Design

**Objective**: Define data model, contracts, and developer workflow

**Status**: ✅ Complete

### Data Model Design

**Status**: ✅ Complete - See [data-model.md](./data-model.md)

**Entities Defined**:
1. **Player Character**: Position, velocity, interaction radius, sprite reference
2. **Room/Map**: Dimensions (800x600), wall boundaries, floor area
3. **NPC**: Position, interaction radius, dialog text, sprite reference
4. **Interactive Object**: Position, interaction radius, collected state, message text
5. **Dialog Box**: Position, size, text content, visibility state

**State Management**: Flat scene-level properties (no state management library, per "Simplicity First")

**Deliverables**:
- [x] Entity specifications (5 core entities)
- [x] Interaction state machine (proximity detection, dialog flow, collection flow)
- [x] Configuration objects (Phaser config, SVG asset registry)
- [x] Edge case handling (rapid input, boundary interactions, simultaneous interactions)
- [x] data-model.md document

### Contracts Design

**Status**: ✅ Complete - See [contracts/](./contracts/)

**Contracts Defined**:

1. **SVG Generators** ([svg-generators.md](./contracts/svg-generators.md)):
   - `createPlayerSvg()` - Returns blue circle with direction triangle
   - `createNpcSvg()` - Returns purple square with distinguishing feature
   - `createChestSvg()` - Returns yellow/gold chest icon
   - `createWallSvg()` - Returns gray wall tile
   - `svgToDataUri()` - Utility for data URI conversion

2. **Scene Interface** ([scene-interface.md](./contracts/scene-interface.md)):
   - Lifecycle: `constructor()`, `init()`, `preload()`, `create()`, `update()`
   - Helpers: `checkProximity()`, `handleInteraction()`, `showDialog()`, `hideDialog()`, `collectChest()`
   - State management contract
   - Performance contract (< 16.67ms frame time)

**Deliverables**:
- [x] 5 SVG generator function signatures
- [x] MainScene lifecycle contract
- [x] 6 helper method signatures
- [x] Performance requirements
- [x] Extension patterns for adding new NPCs/objects

### Developer Workflow

**Status**: ✅ Complete - See [quickstart.md](./quickstart.md)

**Documentation Provided**:
- Setup instructions (prerequisites, npm install, npm run dev)
- Development workflow (hot reload, build, preview)
- Common tasks (add NPC, add object, change appearance, create new SVG)
- Troubleshooting guide (9 common issues + solutions)
- Advanced topics (multi-room support, save/load for future)

**Deliverables**:
- [x] Prerequisites and setup guide
- [x] Development workflow documentation
- [x] Project structure explanation
- [x] Common tasks with code examples
- [x] Troubleshooting section
- [x] quickstart.md document

---

## Phase 2: Implementation

**Objective**: Build the adventure game skeleton

**Status**: ⏸️ Ready to begin - Use `/speckit.tasks` to generate task breakdown

**Implementation Order** (recommended):

### Stage 1: Project Setup (Foundation)
1. Initialize npm project
2. Install dependencies (Phaser, Vite)
3. Create project structure (src/, public/, etc.)
4. Set up Vite config
5. Create index.html entry point

### Stage 2: Asset Pipeline (Blockers)
6. Create SVG generator functions (player, NPC, chest, wall)
7. Create svgLoader utility
8. Test SVG → data URI conversion

### Stage 3: User Story 1 - Movement (P1 - MVP)
9. Create main.js with Phaser config
10. Create MainScene skeleton (constructor, lifecycle methods)
11. Load SVG assets in preload()
12. Create player sprite with physics
13. Create wall boundaries with collision
14. Implement movement input (arrow keys, WASD)
15. Test collision detection

**Checkpoint**: At this point, player can move around room without passing through walls. This is the MVP.

### Stage 4: User Story 2 - NPC Interaction (P2)
16. Create NPC sprite
17. Implement proximity detection
18. Create dialog box UI element
19. Implement interaction key handler (E/Space)
20. Implement showDialog() / hideDialog()
21. Test NPC conversation flow

**Checkpoint**: Player can talk to NPC and dismiss dialog.

### Stage 5: User Story 3 - Object Collection (P3)
22. Create interactive object sprite (chest)
23. Implement object proximity detection
24. Implement collectChest() with visual feedback
25. Test collection flow (message, color change, no re-collection)

**Checkpoint**: Player can collect object once.

### Stage 6: Polish & Documentation
26. Add README.md with setup instructions
27. Test all three user stories end-to-end
28. Verify constitutional compliance (SVG-only, < 500 lines, 2 dependencies)
29. Verify success criteria (< 3s load, < 0.5s feedback, 60 FPS)
30. Final cleanup (remove console.logs, comments)

**Next Command**: Run `/speckit.tasks` to generate detailed task breakdown in `tasks.md`

---

## Design Artifacts Summary

### Phase 0 (Research)
- ✅ [research.md](./research.md) - 47 lines, technical validation complete

### Phase 1 (Design)
- ✅ [data-model.md](./data-model.md) - 273 lines, all entities and states defined
- ✅ [contracts/svg-generators.md](./contracts/svg-generators.md) - 197 lines, 5 SVG functions + 1 utility
- ✅ [contracts/scene-interface.md](./contracts/scene-interface.md) - 318 lines, complete scene API
- ✅ [quickstart.md](./quickstart.md) - 451 lines, comprehensive developer guide

**Total Design Documentation**: ~1,286 lines across 5 files

---

## Dependencies

### Production Dependencies

```json
{
  "dependencies": {
    "phaser": "^3.80.0"
  }
}
```

**Justification**: Phaser is the game engine - cannot build 2D browser game without it. Constitutional compliance: strictly necessary.

### Development Dependencies

```json
{
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

**Justification**: Vite provides dev server (`npm run dev` requirement) and production bundling. Constitutional compliance: strictly necessary for modern JavaScript toolchain.

**Total Dependency Count**: 2 (constitutional limit respected)

---

## npm Scripts

**Required by User**:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**Script Descriptions**:
- `dev` - Start Vite dev server with HMR at http://localhost:5173/
- `build` - Create optimized production build in dist/
- `preview` - Preview production build at http://localhost:4173/

---

## Success Criteria Validation

### From Spec (SC-001 through SC-006)

- [ ] **SC-001**: Player can move across room in < 5 seconds
  - **Validation**: Manual test with timer
  - **Target**: 160 px/s speed, 800px room width = 5 seconds

- [ ] **SC-002**: Complete all interactions in < 60 seconds
  - **Validation**: Manual walkthrough test
  - **Target**: Movement + NPC talk + Chest collect < 1 minute

- [ ] **SC-003**: Game loads in < 3 seconds
  - **Validation**: Browser DevTools Network tab, DOMContentLoaded timing
  - **Target**: Vite's optimized build + small SVGs = fast load

- [ ] **SC-004**: Interaction feedback < 0.5 seconds
  - **Validation**: Manual test with stopwatch
  - **Target**: Phaser's `update()` runs at 60 FPS (16.67ms), instant feedback

- [ ] **SC-005**: Codebase < 500 lines (excluding dependencies)
  - **Validation**: `cloc src/` command
  - **Target**: main.js + MainScene.js + 4 SVG files + svgLoader.js ≈ 350-450 lines

- [ ] **SC-006**: Developer can add NPC in < 30 minutes
  - **Validation**: Follow quickstart.md "Add a New NPC" guide with timer
  - **Target**: Clear patterns + good documentation = easy extension

### Constitutional Validation

- [ ] **Simplicity First**: Single scene, no abstractions, flat state ✅
- [ ] **Minimal Dependencies**: 2 dependencies (Phaser + Vite) ✅
- [ ] **Code-Generated SVG Assets**: All graphics are JavaScript functions ✅
- [ ] **Local-First Execution**: No backend, no database, works offline ✅
- [ ] **Standard Project Structure**: Standard Vite + ES modules layout ✅

---

## Risk Mitigation

### Technical Risks (from research.md)

| Risk | Mitigation Strategy | Status |
|------|---------------------|--------|
| SVG → Phaser integration complexity | Test data URI approach in Stage 2 (early) | ✅ Validated in research |
| Phaser version compatibility | Use Phaser ^3.80.0 (current stable), check official Vite examples | ✅ Version pinned |
| Performance with SVG rendering | Keep SVGs simple (32x32, basic shapes), Phaser handles efficiently | ✅ Design complete |
| Collision detection edge cases | Use Phaser's built-in Arcade Physics overlap checks | ✅ Approach confirmed |

### Constitutional Risks (from research.md)

| Risk | Mitigation Strategy | Status |
|------|---------------------|--------|
| Scope creep beyond skeleton | Strict adherence to spec's "Out of Scope" section, resist feature requests | ⚠️ Ongoing vigilance |
| Over-engineering (abstractions) | Follow "simplicity first" - inline code over classes, flat structure | ✅ Design enforces |
| Additional dependencies | Review each import against necessity criteria, only 2 permitted | ✅ Locked at 2 |
| Bitmap assets accidentally added | Code review, no files in public/assets/, only SVG generators in src/svg/ | ✅ Structure enforces |

---

## Next Steps

1. **Generate Task Breakdown**: Run `/speckit.tasks` to create `tasks.md` with granular implementation tasks
2. **Review Tasks**: Validate task breakdown covers all 3 user stories and success criteria
3. **Begin Implementation**: Start with Stage 1 (Project Setup), proceed through stages in order
4. **Test After Each Stage**: Verify each checkpoint before moving to next stage
5. **Final Validation**: Run all SC-001 through SC-006 tests before marking complete

---

## References

### Design Documents
- [spec.md](./spec.md) - Feature specification with user stories and requirements
- [research.md](./research.md) - Phase 0 technical research
- [data-model.md](./data-model.md) - Entity and state design
- [quickstart.md](./quickstart.md) - Developer workflow guide
- [contracts/svg-generators.md](./contracts/svg-generators.md) - SVG function contracts
- [contracts/scene-interface.md](./contracts/scene-interface.md) - MainScene API contracts

### External Resources
- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Phaser + Vite Template](https://github.com/phaserjs/template-vite)

### Constitutional Reference
- [.specify/memory/constitution.md](../../.specify/memory/constitution.md) - Project governance principles

---

**Plan Status**: ✅ Complete - Ready for task generation (`/speckit.tasks`)

**Design Completeness**: 100% (all Phase 0 and Phase 1 artifacts delivered)

**Constitutional Compliance**: 100% (all 5 principles satisfied)

**Blocking Issues**: None
