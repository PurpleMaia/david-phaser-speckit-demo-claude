# Tasks: Phase 2 – Visual Upgrade (SVG only)

**Input**: Design documents from `/specs/002-svg-visual-upgrade/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Per constitution, testing is OPTIONAL for this Phaser 3 demo project. Tests are NOT included in this task list. Testing MUST NOT block delivery of a running demo.

**Organization**: Tasks are grouped by foundational setup followed by user stories (P1→P4) to enable independent implementation and testing of each visual upgrade.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `public/` at repository root (Phaser 3 frontend-only)
- All paths are absolute starting from `/workspace/`

---

## Phase 1: Setup (SVG Design System Foundation)

**Purpose**: Establish the core SVG design system architecture - palette, helpers, and parametric sprite generators. This phase refactors existing Phase 1 code into the new organized structure.

- [x] T001 Create central color palette in src/svg/palette.js with 10-16 colors (base + dark shade pairs) per Visual Style Guide
- [x] T002 [P] Create rounded rectangle shape helper in src/svg/shapes/roundedRect.js for dialog panel and chest lid
- [x] T003 [P] Create circle shape helper in src/svg/shapes/circle.js for character heads and plant foliage
- [x] T004 [P] Create drop-shadow shape helper in src/svg/shapes/shadow.js using offset rectangle technique
- [x] T005 Create texture loader utility in src/utils/textureLoader.js implementing svgToTexture(scene, key, svgString, width, height)

**Checkpoint**: SVG design system foundation complete - palette, shape helpers, and texture loader ready

---

## Phase 2: Foundational Refactoring (Blocking Prerequisites)

**Purpose**: Refactor existing Phase 1 SVG files to use the new palette and move them into the parametric sprite generator structure. This MUST be complete before ANY user story implementation.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 [P] Refactor src/svg/player.js to import colors from src/svg/palette.js and use palette constants instead of hardcoded hex
- [x] T007 [P] Refactor src/svg/npc.js to import colors from src/svg/palette.js and use palette constants instead of hardcoded hex
- [x] T008 [P] Refactor src/svg/chest.js to import colors from src/svg/palette.js and use palette constants instead of hardcoded hex
- [x] T009 [P] Refactor src/svg/wall.js to import colors from src/svg/palette.js and use palette constants instead of hardcoded hex
- [x] T010 Move src/svg/player.js to src/svg/sprites/createPlayerSvg.js and add config parameter support (bodyColor, headColor, pantsColor)
- [x] T011 Move src/svg/npc.js to src/svg/sprites/createNpcSvg.js and add config parameter support (bodyColor, headColor, accessoryColor, type)
- [x] T012 Move src/svg/chest.js to src/svg/sprites/createChestSvg.js and add config parameter support (state, glowColor)
- [x] T013 Move src/svg/wall.js to src/svg/sprites/createWallTileSvg.js and add config parameter support (type: 'solid' | 'doorway')
- [x] T014 Update src/scenes/MainScene.js imports to reference new sprite generator paths in src/svg/sprites/

**Checkpoint**: Foundation ready - all existing SVG files refactored into parametric design system. User story implementation can now begin.

---

## Phase 3: User Story 1 - Experience Enhanced Character Visuals (Priority: P1) 🎯 MVP

**Goal**: Upgrade player and NPC sprites with head+body structure, 2-3 colors, clear silhouettes, and subtle idle animations. All gameplay mechanics remain identical to Phase 1.

**Independent Test**: Load game and verify player/NPC have head+body structure with 2-3 colors, display idle bob animation when stationary, and movement/collision work identically to Phase 1.

### Implementation for User Story 1

- [x] T015 [US1] Upgrade player sprite in src/svg/sprites/createPlayerSvg.js: implement head (circle) + body (rectangle) structure using colors.playerSkin, colors.playerShirt, colors.playerPants with shading (darker variants on edges)
- [x] T016 [US1] Upgrade NPC sprite in src/svg/sprites/createNpcSvg.js: implement head (circle) + body (rectangle) structure using colors.npcSkin, colors.npcRobe, colors.npcRobeDark with shading (darker variants on edges)
- [x] T017 [US1] Update src/scenes/MainScene.js to use new svgToTexture utility for loading player and NPC textures (replace existing svgToDataUri usage)
- [x] T018 [US1] Add idle animation tween for player sprite in src/scenes/MainScene.js: animate y property with -4px offset, 1s duration, yoyo, infinite repeat, Sine.easeInOut easing
- [x] T019 [US1] Add idle animation tween for NPC sprite in src/scenes/MainScene.js: same parameters as player (y offset -4px, 1s duration, yoyo, infinite)
- [x] T020 [US1] Verify character sprites maintain 32x32 dimensions and existing collision boundaries in src/scenes/MainScene.js (no changes to physics bodies)

**Checkpoint**: User Story 1 complete - player and NPC have characterful head+body sprites with idle animations, all gameplay mechanics unchanged

---

## Phase 4: User Story 2 - Navigate Enhanced Environment (Priority: P2)

**Goal**: Add visual variety to environment through floor tile variations (2-3 types), wall tiles with doorway/archway, and 1-2 decorative props. Collision detection remains identical to Phase 1.

**Independent Test**: Load game and verify floor shows 2-3 tile variations, walls include doorway/archway element, 1-2 decorative props visible, and collision boundaries unchanged from Phase 1.

### Implementation for User Story 2

- [ ] T021 [P] [US2] Create floor tile sprite generator in src/svg/sprites/createFloorTileSvg.js: implement 3 variants (0=solid, 1=checkerboard, 2=stone lines) using colors.floorBase, colors.floorAlt1, colors.floorAlt2, 64x64 size
- [ ] T022 [P] [US2] Create wall tile sprite generator in src/svg/sprites/createWallTileSvg.js: implement 'solid' (plain with edge shading) and 'doorway' (archway cutout) types using colors.wallBase, colors.wallDark, colors.doorway, 64x64 size
- [ ] T023 [P] [US2] Create decorative prop sprite generator in src/svg/sprites/createPropSvg.js: implement 'plant' (green circle + pot), 'table' (rectangle top + legs), 'rug' (oval with pattern) types using palette colors, 32x32 or 48x48 size
- [ ] T024 [US2] Update src/scenes/MainScene.js floor rendering: load 3 floor tile texture variants via svgToTexture, replace existing floor with tile-based grid (random variant selection per tile position)
- [ ] T025 [US2] Update src/scenes/MainScene.js wall rendering: load wall tile textures (solid + doorway), replace existing wall rendering with tile-based approach, place doorway tile at designated location
- [ ] T026 [US2] Add decorative props to src/scenes/MainScene.js: load prop textures (plant + table or rug), place 1-2 props in room as static sprites with depth=1 (non-blocking, purely visual)
- [ ] T027 [US2] Verify collision detection unchanged in src/scenes/MainScene.js: test player movement against walls and props, ensure existing physics bodies remain unchanged

**Checkpoint**: User Story 2 complete - environment has visual variety (floor tiles, wall tiles, props), collision behavior identical to Phase 1

---

## Phase 5: User Story 3 - Discover Visually Distinct Reward Object (Priority: P3)

**Goal**: Enhance interactive chest sprite with simple shading (one darker shade) and subtle glow effect (halo or outer stroke). Interaction behavior remains identical to Phase 1.

**Independent Test**: Load game, approach chest, verify shading visible (darker edges), glow effect present (halo or stroke), visually distinct from environment, and interaction behavior unchanged from Phase 1.

### Implementation for User Story 3

- [ ] T028 [US3] Upgrade chest sprite in src/svg/sprites/createChestSvg.js: implement body (rectangle) + lid (smaller rectangle) structure with shading using colors.chestDark on bottom/side edges, maintain state parameter ('closed' vs 'collected' with opacity change)
- [ ] T029 [US3] Add glow effect to chest sprite in src/svg/sprites/createChestSvg.js: implement halo rectangle behind chest (120% scale, colors.chestGlow fill, low opacity ~0.3) OR outer stroke (2-3px, colors.chestGlow color)
- [ ] T030 [US3] Update chest texture loading in src/scenes/MainScene.js: use svgToTexture with new enhanced chest SVG, maintain existing chest sprite creation and physics
- [ ] T031 [US3] Test glow visibility in src/scenes/MainScene.js: verify glow effect visible against all 3 floor tile variants (load game multiple times or place chest on different floor tiles)
- [ ] T032 [US3] Verify interaction behavior unchanged in src/scenes/MainScene.js: test chest interaction, confirm "You found a thing!" message appears, chest state changes correctly (opacity or visibility), same as Phase 1

**Checkpoint**: User Story 3 complete - chest has shading and glow effect, visually distinct and rewarding, interaction behavior unchanged

---

## Phase 6: User Story 4 - Read Improved Dialog Presentation (Priority: P4)

**Goal**: Replace plain dialog box with framed panel featuring rounded corners and drop-shadow effect. Colors consistent with 10-16 color palette. Dialog functionality remains identical to Phase 1.

**Independent Test**: Trigger NPC dialog and chest interaction messages, verify text appears in rounded panel with drop-shadow, colors match palette, and dialog dismiss/behavior unchanged from Phase 1.

### Implementation for User Story 4

- [ ] T033 [US4] Create dialog panel sprite generator in src/svg/sprites/createDialogPanelSvg.js: use roundedRect and shadow helpers from src/svg/shapes/, implement rounded rectangle with rx=8 ry=8, background colors.dialogBg, border colors.dialogBorder (3px), drop-shadow via offset rectangle (6px offset, colors.dialogShadow), default 600x120 dimensions
- [ ] T034 [US4] Update MainScene dialog rendering in src/scenes/MainScene.js: replace createDialogBox() rectangle logic with dialog panel texture loaded via svgToTexture
- [ ] T035 [US4] Adjust text positioning in src/scenes/MainScene.js: ensure dialog text remains readable within new rounded panel, adjust text offset if needed to account for padding/borders
- [ ] T036 [US4] Verify shadow visibility in src/scenes/MainScene.js: test dialog panel against game background (room floor/walls), confirm drop-shadow effect visible and provides depth perception
- [ ] T037 [US4] Verify dialog behavior unchanged in src/scenes/MainScene.js: test NPC interaction (E or space key), chest interaction message, dialog dismissal (press key again), ensure same Phase 1 behavior

**Checkpoint**: User Story 4 complete - dialog panel polished with rounded corners and drop-shadow, functionality unchanged

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, performance testing, and visual consistency checks across all user stories. Ensure Phase 1 parity and constitutional compliance.

- [ ] T038 [P] Visual consistency validation: open src/svg/palette.js and count total distinct colors (must be ≤16), grep codebase for hardcoded hex colors outside palette (none should exist), visually inspect all sprites in browser to verify palette usage
- [ ] T039 [P] Color contrast verification: load game and screenshot with all entities visible (player, NPC, chest, props, tiles), convert to grayscale and verify player/NPC/props remain distinct (clear silhouettes)
- [ ] T040 [P] Shading effectiveness test: zoom in on character sprites in browser DevTools, verify darker shades visible on body edges (head bottom, body sides), check chest shading suggests depth (bottom/side edges darker)
- [ ] T041 Performance testing: open browser DevTools Network tab, hard refresh page, measure time to DOMContentLoaded (must be ≤3.5 seconds, ≤0.5s increase from Phase 1 baseline ~3s)
- [ ] T042 Animation performance test: open browser DevTools Performance tab, record 10 seconds of gameplay (player moving + idle animations), analyze FPS graph (must maintain 60fps with no significant drops)
- [ ] T043 Functional regression test - movement: use arrow keys and WASD to move character, verify movement speed identical to Phase 1, verify collision detection unchanged (character stops at walls, cannot pass through)
- [ ] T044 Functional regression test - interaction: approach NPC and press E/space (dialog appears in new panel), approach chest and press E/space ("You found a thing!" message), verify chest state change (opacity or visibility), dismiss dialogs, ensure all behavior identical to Phase 1
- [ ] T045 Edge case testing: start moving during idle animation (verify smooth transition, no jitter), stand on boundary between floor tile variants (verify no visual glitches), interact while moving (verify same behavior as Phase 1, no interruption)
- [ ] T046 Aesthetic validation: compare game visuals to SNES-era reference images (Zelda: Link to the Past, Secret of Mana), verify "simple but charming" feel (not too plain, not overly detailed), ensure all sprites feel cohesive (consistent palette and shading approach)

**Checkpoint**: All user stories validated - visual consistency confirmed, performance meets targets (≤3.5s load, 60fps), Phase 1 parity verified, constitutional compliance achieved

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational Refactoring (Phase 2)**: Depends on Setup (Phase 1) completion - BLOCKS all user stories
- **User Stories (Phases 3-6)**: All depend on Foundational (Phase 2) completion
  - User stories can then proceed in parallel (if staffed) or sequentially in priority order (P1→P2→P3→P4)
  - Recommended: Complete US1 (P1) first as MVP, then add US2, US3, US4 incrementally
- **Polish (Phase 7)**: Depends on all user stories (Phases 3-6) being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories ✅
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1 ✅
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent of US1/US2 ✅
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Independent of US1/US2/US3 ✅

**Note**: All user stories are independently implementable and testable. No cross-story dependencies exist.

### Within Each Phase

**Phase 1 (Setup)**:
- T002, T003, T004 can run in parallel (different shape helper files)
- T001 (palette) should complete before T005 (texture loader) for reference, but not blocking
- T005 can run independently

**Phase 2 (Foundational)**:
- T006, T007, T008, T009 can run in parallel (different SVG files)
- T010-T013 must wait for T006-T009 respectively (moving refactored files)
- T014 must wait for T010-T013 (updating imports after files moved)

**Phase 3 (US1)**:
- T015, T016 can be developed in parallel initially (different sprite files)
- T017 depends on T015, T016 (loading upgraded textures)
- T018, T019 depend on T017 (adding animations to loaded sprites)
- T020 depends on T018, T019 (verifying after animations added)

**Phase 4 (US2)**:
- T021, T022, T023 can run in parallel (different sprite generator files)
- T024, T025, T026 depend on T021, T022, T023 respectively (loading generated textures)
- T027 depends on T024, T025, T026 (verifying after all environment changes)

**Phase 5 (US3)**:
- T028, T029 sequential (glow depends on base chest structure)
- T030 depends on T029 (loading enhanced chest texture)
- T031, T032 depend on T030 (testing after chest loaded)

**Phase 6 (US4)**:
- T033 standalone (creating dialog panel sprite)
- T034 depends on T033 (using created panel texture)
- T035, T036, T037 depend on T034 (testing after panel integrated)

**Phase 7 (Polish)**:
- T038, T039, T040 can run in parallel (different validation aspects)
- T041, T042 can run in parallel (different performance metrics)
- T043, T044, T045 sequential or parallel (different functional tests)
- T046 standalone (aesthetic validation)

### Parallel Opportunities

**Maximum Parallelism** (with 4+ developers after Phase 2 complete):
- Developer A: User Story 1 (T015-T020)
- Developer B: User Story 2 (T021-T027)
- Developer C: User Story 3 (T028-T032)
- Developer D: User Story 4 (T033-T037)

**Within Phase 1 (Setup)**:
```bash
# Launch together:
Task T002: "Create roundedRect helper"
Task T003: "Create circle helper"
Task T004: "Create shadow helper"
```

**Within Phase 2 (Foundational)**:
```bash
# Launch together:
Task T006: "Refactor player.js to use palette"
Task T007: "Refactor npc.js to use palette"
Task T008: "Refactor chest.js to use palette"
Task T009: "Refactor wall.js to use palette"
```

**Within Phase 4 (US2)**:
```bash
# Launch together:
Task T021: "Create floor tile generator"
Task T022: "Create wall tile generator"
Task T023: "Create prop generator"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational Refactoring (T006-T014) - CRITICAL
3. Complete Phase 3: User Story 1 (T015-T020) - Enhanced character visuals
4. **STOP and VALIDATE**: Load game, verify player/NPC sprites upgraded with head+body, idle animations working, gameplay unchanged
5. **MVP READY**: Game now has characterful sprites and animations - deploy/demo if ready

**Estimated Time**: ~1-2 days for solo developer (MVP scope)

---

### Incremental Delivery (All User Stories)

1. **Foundation** (Phases 1-2): Setup + Refactoring → SVG design system ready
2. **Iteration 1** (Phase 3): Add User Story 1 → Test independently → Enhanced characters ✅
3. **Iteration 2** (Phase 4): Add User Story 2 → Test independently → Enhanced environment ✅
4. **Iteration 3** (Phase 5): Add User Story 3 → Test independently → Enhanced chest ✅
5. **Iteration 4** (Phase 6): Add User Story 4 → Test independently → Enhanced dialog UI ✅
6. **Polish** (Phase 7): Final validation → Full visual upgrade complete ✅

**Estimated Time**: ~2-3 days for solo developer (full scope)

**Value**: Each iteration adds visual polish without breaking existing functionality. Can stop at any iteration and have a working, improved game.

---

### Parallel Team Strategy (4 developers)

**Day 1** (All developers together):
- Complete Phase 1: Setup (T001-T005)
- Complete Phase 2: Foundational (T006-T014)

**Day 2** (Parallel user story work):
- Developer A: Phase 3 / User Story 1 (T015-T020)
- Developer B: Phase 4 / User Story 2 (T021-T027)
- Developer C: Phase 5 / User Story 3 (T028-T032)
- Developer D: Phase 6 / User Story 4 (T033-T037)

**Day 3** (All developers together):
- Complete Phase 7: Polish (T038-T046)
- Final integration testing
- Demo preparation

**Estimated Time**: ~3 days with 4 developers (full scope, parallel execution)

---

## Task Summary

**Total Tasks**: 46
- **Phase 1 (Setup)**: 5 tasks
- **Phase 2 (Foundational)**: 9 tasks (BLOCKING)
- **Phase 3 (US1 - Characters)**: 6 tasks 🎯 MVP
- **Phase 4 (US2 - Environment)**: 7 tasks
- **Phase 5 (US3 - Chest)**: 5 tasks
- **Phase 6 (US4 - Dialog)**: 5 tasks
- **Phase 7 (Polish)**: 9 tasks

**Parallelizable Tasks**: 15 tasks marked [P] (can run simultaneously with others)

**Independent Tests** (per user story):
- **US1**: Load game, observe player/NPC sprites (head+body, 2-3 colors), verify idle bob animation, test movement/collision unchanged
- **US2**: Load game, observe floor tile variations (2-3 types), wall doorway, 1-2 props, test collision unchanged
- **US3**: Load game, approach chest, verify shading + glow effect, test interaction unchanged
- **US4**: Trigger NPC/chest dialog, verify rounded panel + drop-shadow, test dialog dismiss unchanged

**Suggested MVP Scope**: Complete through Phase 3 (US1) - delivers characterful player/NPC sprites with idle animations as minimum viable visual upgrade

---

## Notes

- **[P] tasks**: Different files, no dependencies - can run in parallel
- **[Story] labels**: Map tasks to user stories for traceability and independent testing
- **File paths**: All paths are absolute and specific (e.g., `src/svg/palette.js`)
- **Verification**: Each phase ends with checkpoint/testing to validate story independently
- **Commit frequency**: Commit after each task or logical group (e.g., after T001-T005, after T015-T017, etc.)
- **Stop points**: Can stop after any completed phase and have a working game with partial visual upgrades
- **Constitutional compliance**: All tasks respect simplicity-first, code-generated SVGs only, 10-16 color limit, local-first execution
- **No tests**: Per constitution, testing is optional for this demo - tests not included but manual validation tasks in Phase 7
