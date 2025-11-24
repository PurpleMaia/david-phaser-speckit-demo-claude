# Tasks: Phase 3 – Mobile / Touch Controls

**Input**: Design documents from `/specs/003-mobile-touch-controls/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Per constitution, testing is OPTIONAL for this Phaser 3 demo project. Tests are NOT included in this task list. Testing MUST NOT block delivery of a running demo.

**Organization**: Tasks are grouped by functional area: Input Abstraction → Virtual Controls UI → Layout & Responsiveness → Testing & Documentation. This enables incremental implementation while maintaining keyboard controls throughout.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `public/` at repository root (Phaser 3 frontend-only)
- All paths are absolute starting from `/workspace/`

---

## Group 1: Input Abstraction Layer

**Purpose**: Create a unified input system that combines keyboard and touch inputs. This layer maintains 100% keyboard functionality while preparing for virtual button integration.

**⚠️ CRITICAL**: Keyboard controls MUST work identically to Phase 2 after this group is complete

- [ ] T001 [US1] Create PlayerInput class skeleton in src/input/PlayerInput.js: implement constructor accepting (scene, virtualControls=null), add empty getMovementVector() and isActionPressed() methods
- [ ] T002 [US1] Implement keyboard input handling in src/input/PlayerInput.js: add cursor keys (arrow keys) and WASD key listeners, track up/down/left/right/action pressed state, store keyboard references in class properties
- [ ] T003 [US1] Implement getMovementVector() in src/input/PlayerInput.js: return normalized vector {x, y} based on keyboard state (up=-1y, down=+1y, left=-1x, right=+1x), support diagonal movement (e.g., up+right = {x:1, y:-1}), return {x:0, y:0} for no input
- [ ] T004 [US1] Implement action input methods in src/input/PlayerInput.js: add isActionPressed() returning true if spacebar held, add isActionJustPressed() returning true for one frame on press (track lastActionState, reset after one update() call)
- [ ] T005 [US1] Implement PlayerInput.update() method in src/input/PlayerInput.js: track actionJustPressed state (set true on first press, reset to false after one frame), prepare for virtual controls integration (check if virtualControls exists, placeholder for future)
- [ ] T006 [US1] Integrate PlayerInput into src/scenes/MainScene.js: import PlayerInput class, replace direct keyboard input (this.cursors, this.keys) with this.playerInput = new PlayerInput(this), update movement logic to use this.playerInput.getMovementVector()
- [ ] T007 [US1] Update interaction logic in src/scenes/MainScene.js: replace spacebar checks with this.playerInput.isActionJustPressed() for NPC dialog trigger and chest interaction, verify interactions work identically to Phase 2
- [ ] T008 [US1] Regression test keyboard controls: load game on desktop, test arrow keys + WASD for movement in all 4 directions, test spacebar for NPC dialog and chest interaction, verify movement speed and collision detection identical to Phase 2

**Checkpoint**: Group 1 complete - PlayerInput abstraction layer working with keyboard-only, Phase 2 functionality preserved

---

## Group 2: Virtual Controls UI (SVG Assets & Touch Buttons)

**Purpose**: Create the on-screen touch button UI using SVG-based assets. This includes button visuals, positioning, and touch event handling.

**⚠️ PREREQUISITE**: Group 1 must be complete before starting Group 2

- [ ] T009 [P] [US2] Create device detection utility in src/utils/deviceDetector.js: implement detectDevice() function checking navigator.maxTouchPoints (>0 = touch device) and window.innerWidth (<768px = mobile viewport), return {isTouchDevice, isMobileViewport, shouldShowControls} where shouldShowControls = isTouchDevice || isMobileViewport
- [ ] T010 [P] [US2] Add FORCE_VIRTUAL_CONTROLS config flag in src/utils/deviceDetector.js: add optional config parameter to detectDevice({forceShow}), override shouldShowControls if forceShow=true (for desktop testing), default forceShow=false
- [ ] T011 [P] [US2] Add touch button colors to src/svg/palette.js: add buttonBase (light gray/beige background), buttonBaseDark (darker shade for pressed state), buttonIcon (dark gray/black for arrows), ensure total colors ≤16 (may reuse existing colors like colors.dialogBg, colors.dialogBorder)
- [ ] T012 [US2] Create touch button SVG generator in src/svg/sprites/createTouchButtonSvg.js: implement function accepting {type, direction, size, baseColor, iconColor, state}, for type='direction' render circle with arrow triangle (▲▼◀▶), for type='action' render circle with "A" text, for state='pressed' use darker baseColor
- [ ] T013 [US2] Test touch button SVG generator: manually call createTouchButtonSvg with different parameters (up/down/left/right directions, action type, normal/pressed states), visually inspect output in browser console or temporary test file, verify arrows point correctly and "A" is centered
- [ ] T014 [US2] Create VirtualControls class skeleton in src/ui/VirtualControls.js: implement constructor accepting (scene, config={visible, buttonSize, margin}), add properties for button sprites (upButton, downButton, leftButton, rightButton, actionButton), add properties for button pressed state (upPressed, downPressed, etc.), set defaults (buttonSize=48, margin=20)
- [ ] T015 [US2] Implement texture loading in VirtualControls.create() in src/ui/VirtualControls.js: generate SVG strings for all 5 buttons (up/down/left/right/action) in both normal and pressed states (10 textures total), use svgToTexture() from src/utils/textureLoader.js to load textures with keys like 'button-up', 'button-up-pressed', etc.
- [ ] T016 [US2] Implement D-pad positioning in VirtualControls.create() in src/ui/VirtualControls.js: create 4 direction button sprites using loaded textures, position in cross layout bottom-left (up: x=margin+buttonSize, y=gameHeight-margin-buttonSize*2; down: x=margin+buttonSize, y=gameHeight-margin; left: x=margin, y=gameHeight-margin-buttonSize; right: x=margin+buttonSize*2, y=gameHeight-margin-buttonSize), use setScrollFactor(0) for HUD anchoring, set depth to 1000
- [ ] T017 [US2] Implement Action button positioning in VirtualControls.create() in src/ui/VirtualControls.js: create action button sprite using loaded texture, position bottom-right (x=gameWidth-margin-buttonSize, y=gameHeight-margin-buttonSize), use setScrollFactor(0) and depth=1000
- [ ] T018 [US2] Implement button visibility toggle in src/ui/VirtualControls.js: add setVisible(visible) method iterating through all 5 button sprites and calling sprite.setVisible(visible), add getButtonStates() method returning {up: this.upPressed, down: this.downPressed, left: this.leftPressed, right: this.rightPressed, action: this.actionPressed}

**Checkpoint**: Group 2 complete - Virtual controls rendered and positioned on screen (not yet interactive)

---

## Group 3: Touch Event Handling & Multi-Touch Support

**Purpose**: Wire up touch event handlers to make virtual buttons interactive and integrate touch state into PlayerInput.

**⚠️ PREREQUISITE**: Group 2 must be complete before starting Group 3

- [ ] T019 [US1] Add multi-touch pointer support in src/scenes/MainScene.js: in create() method before VirtualControls instantiation, call this.input.addPointer(4) to support up to 5 simultaneous touches (directional buttons + action button)
- [ ] T020 [US1] Implement D-pad touch event handlers in src/ui/VirtualControls.js: for each direction button (up/down/left/right), call sprite.setInteractive() then add pointerdown handler (set corresponding pressed state to true, change texture to pressed variant), add pointerup handler (set pressed to false, restore normal texture), add pointerout handler (set pressed to false, restore normal texture for finger drift)
- [ ] T021 [US1] Implement Action button touch event handlers in src/ui/VirtualControls.js: call this.actionButton.setInteractive(), add pointerdown handler (set this.actionPressed=true, track this.actionJustPressed=true for one frame, change texture to pressed), add pointerup handler (set actionPressed=false, restore normal texture), add pointerout handler (set actionPressed=false, restore normal texture)
- [ ] T022 [US1] Implement actionJustPressed tracking in src/ui/VirtualControls.js: add update() method that resets this.actionJustPressed to false after one frame (similar to keyboard tracking), add isActionJustPressed() method returning this.actionJustPressed value
- [ ] T023 [US1] Integrate virtual controls into PlayerInput in src/input/PlayerInput.js: in update() method, check if this.virtualControls exists, if yes call this.virtualControls.update() and this.virtualControls.getButtonStates(), combine keyboard and virtual states using logical OR (e.g., this.up = keyboardUp || virtualUp), combine actionJustPressed from both sources (keyboardAction || virtualAction)
- [ ] T024 [US1] Instantiate VirtualControls in src/scenes/MainScene.js: in create() method before PlayerInput instantiation, call detectDevice() to get shouldShowControls, create this.virtualControls = shouldShowControls ? new VirtualControls(this, {visible: true}) : null, call this.virtualControls.create() if not null, pass virtualControls to PlayerInput constructor
- [ ] T025 [US1] Update MainScene.update() to call virtualControls.update() in src/scenes/MainScene.js: if this.virtualControls exists, call this.virtualControls.update() before this.playerInput.update() to ensure actionJustPressed state is tracked correctly

**Checkpoint**: Group 3 complete - Touch controls fully interactive, multi-touch working, input integrated with keyboard

---

## Group 4: Layout, Responsiveness & Visibility Rules

**Purpose**: Ensure virtual controls adapt to different screen sizes and device types, remain visible on mobile, hidden on desktop.

**⚠️ PREREQUISITE**: Group 3 must be complete before starting Group 4

- [ ] T026 [P] [US3] Verify Phaser Scale Manager configuration in src/main.js: check current scale mode (FIT, RESIZE, etc.), document scale config in comments, identify if controls need to use this.scale.width/height vs hardcoded dimensions
- [ ] T027 [US3] Update VirtualControls positioning to use scale dimensions in src/ui/VirtualControls.js: replace hardcoded game dimensions with this.scene.scale.width and this.scene.scale.height in button positioning calculations (if needed based on T026 findings), test on multiple viewport sizes to verify buttons remain correctly positioned
- [ ] T028 [US3] Implement viewport resize handler in src/scenes/MainScene.js (optional): add this.scale.on('resize', this.handleResize, this) listener in create(), implement handleResize(gameSize) method that re-detects device with detectDevice(), updates this.virtualControls.setVisible() based on new shouldShowControls, repositions buttons if needed (may require adding updatePositions() method to VirtualControls)
- [ ] T029 [US3] Test desktop viewport (controls hidden): load game in desktop browser (window width >768px), verify on-screen controls are completely hidden (not visible), verify keyboard controls work normally (arrow keys + spacebar), verify no visual clutter or obstruction of gameplay area
- [ ] T030 [US3] Test mobile viewport (controls visible): resize desktop browser window to <768px width OR use Chrome DevTools device emulation, verify on-screen controls appear (D-pad + Action button), verify buttons positioned correctly in bottom corners with proper margins, verify buttons do not cover player character or main gameplay area
- [ ] T031 [US3] Test landscape orientation on mobile emulator: use Chrome DevTools device toolbar with landscape preset (e.g., iPhone 12 landscape), verify game canvas and controls fit within viewport without scrolling (no horizontal or vertical scroll), verify controls remain accessible and gameplay area visible

**Checkpoint**: Group 4 complete - Responsive layout working, controls show/hide correctly based on device/viewport

---

## Group 5: Testing & Documentation

**Purpose**: Comprehensive testing across desktop and mobile, performance validation, and README documentation.

**⚠️ PREREQUISITE**: Group 4 must be complete before starting Group 5

### Functional Testing

- [ ] T032 [P] [US1] Desktop keyboard regression test: load game on desktop (>768px viewport), use arrow keys to move in all 4 directions + test WASD, test spacebar for NPC dialog and chest interaction, verify movement speed identical to Phase 2, verify collision detection unchanged (stops at walls), verify interaction ranges unchanged
- [ ] T033 [P] [US1] Mobile touch control integration test: load game on mobile emulator or <768px viewport, verify D-pad and Action button visible, tap and hold each direction button individually (up/down/left/right) and verify character moves continuously in that direction, release button and verify character stops immediately, approach NPC and tap Action button to trigger dialog, approach chest and tap Action button to trigger interaction
- [ ] T034 [US1] Multi-touch test: on mobile emulator, hold down a direction button (e.g., right) with one finger, tap Action button with another finger while moving, verify character continues moving while dialog opens (both inputs work simultaneously), test diagonal movement by tapping up+right buttons simultaneously (if supported)
- [ ] T035 [US1] Button pressed state visual feedback test: on mobile emulator, tap and hold each button, verify button texture changes to pressed state (darker color or visual change), release button and verify texture returns to normal state, test rapid tapping to ensure state changes are responsive

### Layout & Sizing Tests

- [ ] T036 [P] [US4] Button size verification: open browser DevTools → Elements panel, inspect each touch button (D-pad buttons + Action button), measure button dimensions using DevTools ruler or computed styles, verify each button is at least 48×48 CSS pixels (meets thumb-friendly requirement)
- [ ] T037 [P] [US4] Viewport fit test (landscape): load game on mobile emulator in landscape orientation (e.g., iPhone 12 landscape, iPad landscape), verify game canvas and controls fit within viewport with no scrolling required (neither horizontal nor vertical), verify controls positioned in corners with appropriate margins (not cut off or overlapping)
- [ ] T038 [P] [US4] Gameplay area obstruction test: load game on mobile, verify D-pad and Action button do not cover player character at starting position, move player around room and verify buttons do not obstruct NPCs or chest during normal gameplay, verify player remains visible and interactions are not blocked by button placement

### Device Detection & Visibility Tests

- [ ] T039 [US2] Touch capability detection test: open browser console on touch device (or emulator with touch enabled), check navigator.maxTouchPoints value (should be >0), call detectDevice() in console and verify isTouchDevice=true, verify shouldShowControls=true
- [ ] T040 [US2] Mobile viewport detection test: on desktop browser, resize window to 767px width (just below threshold), call detectDevice() and verify isMobileViewport=true, verify controls appear, resize to 768px width and verify isMobileViewport=false, verify controls disappear
- [ ] T041 [US2] Force show controls test (desktop testing): in src/utils/deviceDetector.js temporarily set FORCE_VIRTUAL_CONTROLS=true or pass {forceShow: true} in MainScene, load game on desktop (>768px, no touch), verify on-screen controls are visible, click direction buttons with mouse and verify character moves, click Action button with mouse and verify interactions trigger, reset forceShow to false after testing

### Performance Tests

- [ ] T042 [P] Touch latency test: on mobile emulator, tap a direction button and observe character response time, verify character starts moving within ~100ms of tap (feels responsive, no noticeable lag), tap Action button and observe dialog/interaction response time, verify interaction triggers within ~100ms of tap
- [ ] T043 [P] Frame rate test with touch controls: open Chrome DevTools → Performance tab (if available on mobile), OR observe visual smoothness manually, move character continuously using touch controls while idle animations play, verify 60fps gameplay (smooth movement and animations, no stuttering), verify no frame drops compared to Phase 2
- [ ] T044 [P] Load time test: open browser DevTools → Network tab, hard refresh page (Ctrl+Shift+R), measure time to DOMContentLoaded event, verify ≤4 seconds total load time (≤0.5s increase from Phase 2 baseline of ~3.5s)

### Cross-Browser & Device Testing

- [ ] T045 [P] Test on multiple browsers (desktop): test on Chrome desktop (keyboard only, controls hidden), test on Firefox desktop (keyboard only), test on Safari desktop if available, verify keyboard controls work identically across browsers, verify controls remain hidden on desktop viewports
- [ ] T046 [P] Test on mobile browsers (emulator): test on Chrome mobile emulator (touch controls visible), test on Safari iOS emulator if available, test on Firefox mobile emulator, verify touch controls work across browsers, verify button rendering and positioning consistent

### Documentation

- [ ] T047 Update README.md with mobile controls section: add "## Mobile Controls" heading, document that game supports touch controls on mobile devices, describe on-screen D-pad (bottom-left) for character movement, describe Action button (bottom-right) for NPC dialog and object interactions, note "Landscape orientation recommended (portrait support may be limited)", note "Keyboard controls remain fully functional on desktop"
- [ ] T048 Add testing instructions to README.md: document how to test mobile controls on desktop ("Resize browser window to <768px width or use Chrome DevTools device emulation with mobile preset"), document force show controls option ("Temporarily set FORCE_VIRTUAL_CONTROLS=true in src/utils/deviceDetector.js to test controls on desktop with mouse"), add browser compatibility note ("Tested on Chrome, Firefox, Safari for desktop and mobile")

**Checkpoint**: Group 5 complete - All testing passed, README documented, feature ready for delivery

---

## Dependencies & Execution Order

```
Group 1: Input Abstraction Layer
├── T001-T007 (can run in parallel after T001)
└── T008 (GATE: keyboard must work before continuing)

Group 2: Virtual Controls UI
├── T009-T011 (can run in parallel, no dependencies)
├── T012-T013 (SVG generator, depends on T011 for colors)
├── T014 (VirtualControls skeleton, no dependencies)
├── T015 (texture loading, depends on T012-T014)
└── T016-T018 (positioning, depends on T015)

Group 3: Touch Event Handling
├── T019 (multi-touch, can run early)
├── T020-T022 (touch handlers, depends on Group 2 complete)
├── T023 (PlayerInput integration, depends on T020-T022)
└── T024-T025 (MainScene integration, depends on T023)

Group 4: Layout & Responsiveness
├── T026-T027 (scale manager, can run in parallel)
├── T028 (resize handler, optional, depends on T027)
└── T029-T031 (viewport tests, depends on T027-T028)

Group 5: Testing & Documentation
├── Functional Tests (T032-T035): depends on Group 3 complete
├── Layout Tests (T036-T038): depends on Group 4 complete
├── Detection Tests (T039-T041): can run after Group 2 complete
├── Performance Tests (T042-T044): depends on Group 3 complete
├── Cross-Browser Tests (T045-T046): depends on Group 3 complete
└── Documentation (T047-T048): can run in parallel once feature is stable

CRITICAL PATH:
T001→T006→T008 (keyboard working)
→ T011→T012→T015→T016 (buttons rendered)
→ T020→T023→T024 (touch integrated)
→ T027→T029 (responsive)
→ T032-T033 (functional tests)
→ T047 (documented)
```

---

## Parallel Execution Opportunities

**After Group 1 (T008) GATE passes, these can run in parallel:**
- T009-T010 (device detection)
- T011 (color palette)
- T012-T013 (SVG generator)
- T014 (VirtualControls skeleton)

**After Group 2 complete, these can run in parallel:**
- T026 (scale manager investigation)
- T039-T041 (device detection tests)

**After Group 3 complete, these can run in parallel:**
- T032-T035 (functional tests)
- T036-T038 (layout tests)
- T042-T044 (performance tests)
- T045-T046 (cross-browser tests)

**After Group 4 complete, documentation can run in parallel:**
- T047 (README mobile controls section)
- T048 (README testing instructions)

---

## Task Summary by Group

| Group | Task Count | Parallel Tasks | Critical Path |
|-------|------------|----------------|---------------|
| Group 1: Input Abstraction | 8 | T002-T005 after T001 | T001→T006→T008 |
| Group 2: Virtual Controls UI | 10 | T009-T011, T016-T018 | T011→T012→T015→T016 |
| Group 3: Touch Event Handling | 7 | None (sequential) | T020→T023→T024 |
| Group 4: Layout & Responsiveness | 6 | T026-T027, T029-T031 | T027→T029 |
| Group 5: Testing & Documentation | 17 | Most tests parallel | T032-T033→T047 |
| **Total** | **48** | **~25 parallel** | **~15 critical** |

---

## Success Criteria Validation

After completing all tasks, verify these success criteria from spec.md:

- **SC-001**: ✅ Mobile player completes all Phase 1 gameplay tasks using touch-only (verify with T033)
- **SC-002**: ✅ Desktop keyboard controls 100% functional, identical to Phase 2 (verify with T032)
- **SC-003**: ✅ Touch latency under 100ms (verify with T042)
- **SC-004**: ✅ Touch buttons ≥48×48px (verify with T036)
- **SC-005**: ✅ Fits viewport on 3+ test devices without scrolling (verify with T037)
- **SC-006**: ✅ Developer can test mobile controls on desktop via resize/force flag (verify with T029, T041)
- **SC-007**: ✅ No new npm dependencies added (verify package.json unchanged)

---

## Quality Gates

**Gate 1 (After Group 1)**: Keyboard controls work identically to Phase 2
- Run T008 regression test
- If fails: Fix PlayerInput before continuing to Group 2

**Gate 2 (After Group 2)**: Virtual controls render on screen
- Manually verify buttons visible in mobile viewport
- If fails: Fix VirtualControls.create() before continuing to Group 3

**Gate 3 (After Group 3)**: Touch controls interactive and integrated
- Run T033 integration test
- If fails: Fix touch handlers or PlayerInput integration before continuing to Group 4

**Gate 4 (After Group 4)**: Responsive layout working
- Run T029-T031 viewport tests
- If fails: Fix positioning or visibility logic before continuing to Group 5

**Gate 5 (After Group 5)**: All tests passing, documented
- Run all T032-T046 tests
- Review T047-T048 documentation
- If fails: Fix issues, update docs, re-test

---

## Notes

- **Testing Philosophy**: Manual testing is primary (per constitution: "optional minimal sanity tests"). All tests are manual verification steps, not automated test code.
- **Keyboard Preservation**: Group 1 MUST pass regression test (T008) before any touch work begins. This ensures keyboard controls never break.
- **Incremental Integration**: Each group builds on the previous, enabling testing at each stage. If a group fails, earlier groups remain functional.
- **Desktop Testing**: Use `FORCE_VIRTUAL_CONTROLS=true` flag (T041) to test touch controls with mouse on desktop, avoiding need for physical mobile device during development.
- **Portrait Orientation**: Deferred per spec scope boundaries. If portrait issues arise, document in README as known limitation.
- **Performance Budget**: ≤0.5s load time increase (T044), maintain 60fps (T043). If budget exceeded, optimize SVG complexity or button count.
