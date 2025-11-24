# Tasks: Adventure Game Skeleton

**Input**: Design documents from `/specs/001-adventure-game-skeleton/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Per constitution, testing is OPTIONAL for this project. If included, keep tests minimal (sanity/smoke tests only). Testing MUST NOT block delivery of a running demo.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend-only web app**: `src/`, `public/` at repository root
- Phaser 3 game structure: `src/main.js`, `src/scenes/`, `src/svg/`, `src/utils/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize npm project with package.json at repository root
- [X] T002 Install Phaser 3 (^3.80.0) and Vite (^5.0.0) as dependencies
- [X] T003 [P] Create directory structure (src/, src/scenes/, src/svg/, src/utils/, public/)
- [X] T004 [P] Create public/index.html with game-container div and script tag for src/main.js
- [X] T005 [P] Create vite.config.js with basic configuration
- [X] T006 [P] Create .gitignore with node_modules, dist, .DS_Store
- [X] T007 [P] Add npm scripts to package.json (dev: vite, build: vite build, preview: vite preview)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 Create svgToDataUri utility function in src/utils/svgLoader.js
- [X] T009 [P] Create createPlayerSvg function in src/svg/player.js (blue circle with triangle indicator)
- [X] T010 [P] Create createNpcSvg function in src/svg/npc.js (purple square)
- [X] T011 [P] Create createChestSvg function in src/svg/chest.js (yellow/gold chest icon)
- [X] T012 [P] Create createWallSvg function in src/svg/wall.js (gray wall tile)
- [X] T013 Create src/main.js with Phaser game configuration (800x600, Arcade physics, gravity 0)
- [X] T014 Create MainScene class skeleton in src/scenes/MainScene.js (constructor, init, preload, create, update methods)
- [X] T015 Import and register MainScene in src/main.js Phaser config

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Explore the Game World (Priority: P1) 🎯 MVP

**Goal**: Player can move character around room using keyboard controls with collision detection

**Independent Test**: Load game in browser, use arrow keys or WASD to move character around room, verify character cannot walk through walls. Delivers core "I'm controlling something in a game world" experience.

### Implementation for User Story 1

- [X] T016 [P] [US1] Implement SVG asset loading in MainScene.preload() using svgToDataUri for player and wall sprites
- [X] T017 [US1] Create physics world bounds (800x600) in MainScene.create()
- [X] T018 [US1] Create player sprite with physics at position (400, 300) in MainScene.create()
- [X] T019 [US1] Enable player collision with world bounds in MainScene.create()
- [X] T020 [US1] Create static wall group and add 4 wall rectangles (top, right, bottom, left) using wall texture in MainScene.create()
- [X] T021 [US1] Add collision between player and walls in MainScene.create()
- [X] T022 [US1] Set up keyboard input (cursors for arrow keys, WASD keys) in MainScene.create()
- [X] T023 [US1] Implement movement logic in MainScene.update() responding to arrow keys (160 px/s velocity)
- [X] T024 [US1] Implement movement logic in MainScene.update() responding to WASD keys (160 px/s velocity)
- [X] T025 [US1] Test player movement and collision - verify FR-001 through FR-006

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (MVP delivered)

---

## Phase 4: User Story 2 - Interact with NPC (Priority: P2)

**Goal**: Player can approach NPC and trigger simple text-based dialog by pressing interaction key

**Independent Test**: Load game, move character to NPC location, press E or Space, see dialog appear, press key again to dismiss. Delivers "I can talk to characters" experience.

### Implementation for User Story 2

- [X] T026 [P] [US2] Load NPC SVG texture in MainScene.preload() using svgToDataUri
- [X] T027 [US2] Create NPC sprite at position (e.g., 500, 200) in MainScene.create() with interaction radius and dialog text properties
- [X] T028 [US2] Create checkProximity helper method in MainScene (checks distance between player and target < interaction radius)
- [X] T029 [US2] Create createDialogBox helper method in MainScene returning Phaser Container with background rectangle and text object
- [X] T030 [US2] Initialize dialog box (hidden) in MainScene.create()
- [X] T031 [US2] Set up interaction key inputs (E and Space) in MainScene.create()
- [X] T032 [US2] Initialize gameState object in MainScene.init() with dialogOpen=false and currentInteractable=null properties
- [X] T033 [US2] Add proximity detection for NPC in MainScene.update() using checkProximity method
- [X] T034 [US2] Create showDialog helper method in MainScene (sets text, makes visible, updates gameState, stops player)
- [X] T035 [US2] Create hideDialog helper method in MainScene (hides dialog, updates gameState)
- [X] T036 [US2] Create handleInteraction method in MainScene (checks dialog state, shows/hides dialog for NPC)
- [X] T037 [US2] Add interaction key handler in MainScene.update() calling handleInteraction when E or Space pressed
- [X] T038 [US2] Disable player movement when dialog is open in MainScene.update()
- [X] T039 [US2] Test NPC interaction - verify FR-007, FR-009, FR-010, FR-011, FR-012

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Collect Interactive Object (Priority: P3)

**Goal**: Player can discover and interact with objects, receiving feedback and visual confirmation when collected

**Independent Test**: Load game, move to chest, press E or Space, see "You found a thing!" message, observe chest changes color/disappears. Delivers "I found something" discovery experience.

### Implementation for User Story 3

- [ ] T040 [P] [US3] Load chest SVG texture in MainScene.preload() using svgToDataUri
- [ ] T041 [US3] Create interactive object (chest) sprite at position (e.g., 200, 400) in MainScene.create() with interaction radius and isCollected=false properties
- [X] T042 [US3] Add proximity detection for chest in MainScene.update() using checkProximity method (only if not collected)
- [ ] T043 [US3] Create collectChest helper method in MainScene (sets isCollected=true, changes sprite tint to gray or hides sprite, shows message)
- [ ] T044 [US3] Update handleInteraction method to handle chest collection (check if currentInteractable is chest and not collected)
- [X] T045 [US3] Update currentInteractable logic in MainScene.update() to prioritize NPC over chest when both are nearby
- [X] T046 [US3] Ensure chest cannot be collected twice (check isCollected flag before interaction)
- [X] T047 [US3] Test object collection - verify FR-008, FR-013, FR-014, FR-015

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories, documentation, and final validation

- [X] T048 [P] Update repository README.md with project description, prerequisites, setup instructions (npm install, npm run dev)
- [X] T049 [P] Add background color or floor texture to game canvas in src/main.js config
- [X] T050 Test all three user stories end-to-end (movement → NPC interaction → chest collection)
- [X] T051 Verify success criteria SC-001: Player can move across room in < 5 seconds
- [X] T052 Verify success criteria SC-002: Complete all interactions in < 60 seconds
- [X] T053 Verify success criteria SC-003: Game loads in < 3 seconds (use browser DevTools)
- [X] T054 Verify success criteria SC-004: Interaction feedback < 0.5 seconds
- [X] T055 Verify success criteria SC-005: Count source code lines excluding dependencies (should be < 500 lines)
- [X] T056 Verify constitutional compliance: All assets are code-generated SVGs (no bitmap files in repository)
- [X] T057 Verify constitutional compliance: Only 2 dependencies (Phaser + Vite) in package.json
- [X] T058 Remove any console.log statements or debug code from src/ files
- [X] T059 Test edge cases: rapid key presses, boundary interactions, simultaneous interactions
- [X] T060 Run production build (npm run build) and verify dist/ output works

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3, 4, 5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1's player and input system but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Builds on US2's interaction system but independently testable

### Within Each User Story

**User Story 1 (Movement)**:
- T016 (asset loading) before T018 (create player sprite)
- T017 (physics world) before T018 (create player sprite)
- T020 (create walls) before T021 (add collision)
- T022 (setup input) before T023-T024 (movement logic)
- T018-T021 (sprite setup) before T023-T024 (movement logic)

**User Story 2 (NPC Interaction)**:
- T026 (load NPC texture) before T027 (create NPC sprite)
- T028 (checkProximity method) before T033 (proximity detection in update)
- T029 (createDialogBox method) before T030 (initialize dialog)
- T032 (gameState init) before T034-T036 (dialog methods using gameState)
- T034-T036 (dialog helper methods) before T036 (handleInteraction using them)
- T027, T030, T031, T032 (create phase) before T033, T037, T038 (update phase)

**User Story 3 (Object Collection)**:
- T040 (load chest texture) before T041 (create chest sprite)
- T043 (collectChest method) before T044 (handleInteraction update)
- T041 (create chest) before T042 (proximity detection)
- T044 (update handleInteraction) before T047 (final testing)

### Parallel Opportunities

- **All Setup tasks** (T001-T007) marked [P] can run in parallel
- **All SVG generator tasks** (T009-T012) in Foundational phase can run in parallel
- **Within User Story 1**: T016 (asset loading parallel with T017 (physics setup)
- **Within User Story 2**: T026 (load NPC texture) parallel with T028 (checkProximity method) parallel with T029 (createDialogBox method)
- **User Stories can be worked on in parallel** by different team members after Foundational phase completes
- **Polish tasks** T048 (README) and T049 (background) can run in parallel with each other

---

## Parallel Example: Foundational Phase

```bash
# Launch all SVG generators together:
Task: "Create createPlayerSvg function in src/svg/player.js"
Task: "Create createNpcSvg function in src/svg/npc.js"
Task: "Create createChestSvg function in src/svg/chest.js"
Task: "Create createWallSvg function in src/svg/wall.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Foundational (T008-T015) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 (T016-T025)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Can deploy/demo at this point - basic playable game with movement

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (T001-T015)
2. Add User Story 1 (T016-T025) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (T026-T039) → Test independently → Deploy/Demo (NPC interaction added)
4. Add User Story 3 (T040-T047) → Test independently → Deploy/Demo (Full feature set)
5. Polish (T048-T060) → Final validation and cleanup
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T015)
2. Once Foundational is done:
   - Developer A: User Story 1 (T016-T025)
   - Developer B: User Story 2 (T026-T039) - can start immediately after Foundational
   - Developer C: User Story 3 (T040-T047) - can start immediately after Foundational
3. Stories complete and integrate independently (all use same MainScene)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Per constitution: Testing is OPTIONAL - focus on getting a running demo
- Target: < 500 lines of source code total (excluding dependencies)
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Task Summary

**Total Tasks**: 60
- Phase 1 (Setup): 7 tasks
- Phase 2 (Foundational): 8 tasks
- Phase 3 (User Story 1 - P1): 10 tasks
- Phase 4 (User Story 2 - P2): 14 tasks
- Phase 5 (User Story 3 - P3): 8 tasks
- Phase 6 (Polish): 13 tasks

**Parallel Opportunities**: 15 tasks can run in parallel (marked with [P])

**Critical Path**:
1. Setup (T001-T007) → ~1-2 hours
2. Foundational (T008-T015) → ~2-3 hours
3. User Story 1 (T016-T025) → ~3-4 hours ← **MVP milestone**
4. User Story 2 (T026-T039) → ~3-4 hours
5. User Story 3 (T040-T047) → ~2-3 hours
6. Polish (T048-T060) → ~2-3 hours

**Estimated Total Effort**: ~15-20 hours for complete implementation

**MVP Milestone**: After T025 (User Story 1 complete) - playable game with movement and collision
