# Feature Specification: Phase 3 – Mobile / Touch Controls

**Feature Branch**: `003-mobile-touch-controls`
**Created**: 2025-11-24
**Status**: Draft
**Input**: User description: "Add a new section titled 'Phase 3 – Mobile / Touch Controls' to the existing spec. Keep all current mechanics and visuals. We are only adding another input method."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Play Game with Touch Controls on Mobile (Priority: P1)

A mobile player loads the game on their smartphone or tablet and sees on-screen controls (D-pad and Action button) that allow them to move the character and interact with NPCs/objects using touch input, providing the same gameplay experience as keyboard controls.

**Why this priority**: Touch control functionality is the core value of this feature. Without working touch input, mobile players cannot play the game at all. This is the minimum viable product for mobile support.

**Independent Test**: Load the game on a touch device or mobile viewport. Verify that D-pad buttons (up/down/left/right) and an Action button appear on screen. Touch and hold direction buttons to move the character. Tap the Action button near an NPC to trigger dialog and near the chest to trigger interaction. All gameplay must work identically to keyboard controls.

**Acceptance Scenarios**:

1. **Given** the game is loaded on a touch device, **When** the player views the screen, **Then** on-screen controls (D-pad and Action button) are visible and positioned near the bottom corners
2. **Given** the player touches and holds a direction button (up/down/left/right), **When** held, **Then** the character moves continuously in that direction until the touch is released
3. **Given** the player is near an NPC, **When** the Action button is tapped, **Then** the NPC dialog appears (same as pressing spacebar on keyboard)
4. **Given** the player is near the interactive object (chest), **When** the Action button is tapped, **Then** the interaction triggers (same as pressing spacebar on keyboard)
5. **Given** the player releases a direction button, **When** touch ends, **Then** the character stops moving in that direction immediately

---

### User Story 2 - Seamless Desktop Keyboard Experience (Priority: P1)

A desktop player loads the game and uses keyboard controls exactly as in Phase 1 and Phase 2, with on-screen controls either hidden or de-emphasized to avoid visual clutter and maintain the clean desktop experience.

**Why this priority**: Ensuring keyboard controls remain fully functional and the primary input method is a constitutional requirement (Principle VI). Desktop players must not experience any degradation or distraction from the addition of mobile controls.

**Independent Test**: Load the game on a desktop browser. Verify keyboard controls (arrow keys + spacebar) work identically to Phase 1/2. Check that on-screen controls are either hidden entirely or visually de-emphasized (low opacity, minimal presence). Desktop gameplay experience must be unchanged.

**Acceptance Scenarios**:

1. **Given** the game is loaded on a desktop browser, **When** the player uses arrow keys, **Then** character movement works identically to Phase 1/2 (same speed, collision, responsiveness)
2. **Given** the player is on desktop, **When** the game renders, **Then** on-screen controls are either completely hidden OR visually de-emphasized (low opacity, minimal size)
3. **Given** the player uses spacebar for interactions, **When** near NPCs or objects, **Then** interactions trigger identically to Phase 1/2 behavior
4. **Given** the game is on desktop, **When** comparing to Phase 2 visuals, **Then** no other aspect of the game has changed (same graphics, layout, performance)

---

### User Story 3 - Responsive Layout on Mobile Viewport (Priority: P2)

A mobile player loads the game and sees the game canvas and on-screen controls fit within the viewport without causing horizontal or vertical scrolling, ensuring a smooth mobile experience.

**Why this priority**: After controls are functional (P1), viewport fit is the next most important mobile UX requirement. Without proper responsive layout, players will struggle with scrolling and off-screen elements, severely degrading playability.

**Independent Test**: Load the game on various mobile viewports (portrait and landscape, different screen sizes). Verify that the game canvas scales appropriately and on-screen controls remain visible and accessible without requiring scrolling. Document any landscape-only limitations in README.

**Acceptance Scenarios**:

1. **Given** the game is loaded on a mobile viewport, **When** the page renders, **Then** no horizontal scrolling is required to see the full game area and controls
2. **Given** the game is loaded on a mobile viewport, **When** the page renders, **Then** no vertical scrolling is required to access controls during gameplay
3. **Given** the game canvas is scaled for mobile, **When** testing touch controls, **Then** controls remain responsive and accurately positioned relative to the canvas
4. **Given** the game is in landscape orientation, **When** on a mobile device, **Then** gameplay area and controls fit within viewport (portrait support may be deferred - document in README if so)

---

### User Story 4 - Thumb-Friendly Touch Targets (Priority: P3)

A mobile player uses touch controls and finds that all buttons are large enough to tap accurately with a thumb (48×48 CSS pixels or larger) without frequent mis-taps, providing a comfortable touch experience.

**Why this priority**: After controls are functional and viewport fits correctly (P1-P2), button sizing is the next UX refinement. This ensures comfort and reduces frustration, but the game is technically playable even with smaller buttons if necessary.

**Independent Test**: Load the game on a touch device and measure or visually verify that all touch buttons (D-pad directions and Action button) are at least 48×48 CSS pixels in size. Test by playing the game and noting any difficulty tapping buttons. Verify mis-taps are rare and controls feel comfortable.

**Acceptance Scenarios**:

1. **Given** the on-screen controls are rendered, **When** measuring button dimensions, **Then** each direction button and the Action button are at least 48×48 CSS pixels in tappable area
2. **Given** the player is playing with touch controls, **When** tapping buttons repeatedly, **Then** mis-taps are rare and buttons respond accurately to thumb touches
3. **Given** the buttons are sized for thumbs, **When** viewing the game, **Then** buttons do not cover the main gameplay area more than necessary
4. **Given** the player is interacting with controls, **When** using them over several minutes, **Then** touch controls feel comfortable and do not cause finger strain

---

### Edge Cases

- What happens when the player uses both keyboard and touch controls simultaneously (e.g., pressing arrow key while holding touch button)?
- How does the system detect desktop vs mobile to show/hide on-screen controls (viewport width threshold, touch capability detection)?
- What happens if the player rotates the device from landscape to portrait mid-game (layout reflow behavior)?
- How do touch controls behave when the game canvas is scaled to different sizes (do buttons scale proportionally)?
- What happens if the player taps multiple direction buttons at once (e.g., up + right for diagonal movement)?
- What happens if the player's finger drifts off a button during a long hold (does movement stop or continue)?
- How do on-screen controls render on very small screens (e.g., older small smartphones) or very large tablets?
- What happens if touch events conflict with browser gestures (e.g., swipe to navigate)?

## Requirements *(mandatory)*

### Functional Requirements

**Touch Control Rendering:**
- **FR-001**: Game MUST display on-screen controls (D-pad and Action button) when running on touch-enabled devices or mobile viewports
- **FR-002**: On-screen controls MUST be implemented using code-generated SVG elements consistent with the project's asset pipeline
- **FR-003**: D-pad MUST consist of four directional buttons (up, down, left, right) anchored near the bottom-left corner of the viewport
- **FR-004**: Action button MUST be a single button anchored near the bottom-right corner of the viewport
- **FR-005**: Each touch button MUST be at least 48×48 CSS pixels in tappable area for thumb-friendly interaction
- **FR-006**: On-screen controls MUST NOT cover the main gameplay area more than necessary (minimize obstruction of player, NPCs, objects)

**Touch Input Behavior:**
- **FR-007**: Touching and holding a direction button MUST move the character continuously in that direction (same behavior as holding keyboard arrow key)
- **FR-008**: Releasing a direction button MUST immediately stop character movement in that direction
- **FR-009**: Tapping the Action button while near an NPC MUST trigger NPC dialog (same behavior as pressing spacebar)
- **FR-010**: Tapping the Action button while near the interactive object (chest) MUST trigger object interaction (same behavior as pressing spacebar)
- **FR-011**: Touch controls MUST respond to touch events with minimal latency (comparable to keyboard input responsiveness)
- **FR-012**: Touch controls MUST handle multi-touch appropriately (e.g., holding direction + tapping Action button)

**Keyboard Control Preservation:**
- **FR-013**: Keyboard controls (arrow keys for movement, spacebar for action) MUST remain fully functional on desktop
- **FR-014**: Keyboard control behavior MUST be identical to Phase 1 and Phase 2 (no degradation in speed, responsiveness, or collision detection)
- **FR-015**: Game MUST NOT display on-screen controls on desktop viewports OR MUST render them in a de-emphasized state (hidden or low opacity)

**Responsive Layout:**
- **FR-016**: Game canvas and on-screen controls MUST fit within the viewport on mobile devices without requiring horizontal scrolling
- **FR-017**: Game canvas and on-screen controls MUST fit within the viewport on mobile devices without requiring vertical scrolling during gameplay
- **FR-018**: Game MUST support landscape orientation on mobile devices (portrait orientation support is OPTIONAL and may be deferred)
- **FR-019**: On-screen controls MUST remain positioned correctly and accessible when the device is rotated (if portrait is supported)

**Visual Style Consistency:**
- **FR-020**: Direction buttons and Action button MUST be rendered from code-generated SVG definitions (no external bitmap files)
- **FR-021**: Touch button visuals MUST be simple and consistent with the established SVG style guide (Principle III)
- **FR-022**: Touch buttons MUST prefer clarity and reliability over fancy UI effects (align with Simplicity First principle)
- **FR-023**: Touch button colors MUST use colors from the existing 10-16 color palette established in Phase 2
- **FR-024**: Touch button shapes MUST be simple geometric primitives (circles, rectangles, arrows) consistent with game's art style

**Device Detection and Adaptation:**
- **FR-025**: Game MUST detect whether it is running on a touch device OR in a mobile viewport (viewport width threshold)
- **FR-026**: On-screen controls MUST be shown when touch capability is detected OR viewport is narrow (mobile-sized)
- **FR-027**: On-screen controls MUST be hidden or de-emphasized when on desktop viewports and touch is not the primary input method

**Constitutional Compliance:**
- **FR-028**: Implementation MUST NOT add new dependencies beyond Phaser 3 and existing toolchain (Principle II: Minimal Dependencies)
- **FR-029**: Code MUST remain simple, readable, and self-explanatory (Principle I: Simplicity First)
- **FR-030**: Touch control implementation MUST NOT compromise desktop keyboard experience (Principle VI: Cross-Platform Playability)

### Key Entities

- **D-Pad Control**: Collection of four directional touch buttons (up, down, left, right), positioned bottom-left, each button 48×48px or larger, SVG-rendered
- **Action Button**: Single touch button for interactions, positioned bottom-right, 48×48px or larger, SVG-rendered
- **Touch Button Component**: Reusable button structure with SVG graphic, touch event listeners, active/inactive visual states
- **Input Manager Extension**: Logic to handle touch events alongside keyboard events, translating touch to movement/action commands
- **Device Detector**: Logic to determine if on-screen controls should be shown (based on touch capability or viewport size)
- **Control Layout Manager**: Positioning and scaling logic for on-screen controls relative to game canvas and viewport

### Visual Assets

**Constitutional Constraint**: All visual assets MUST be code-generated SVGs (no bitmap files).

**Touch Control Buttons:**
- **D-Pad Directional Buttons (4 buttons)**:
  - **Up Arrow Button**: Simple upward-pointing triangle or arrow shape inside a circle or rounded square, 48×48px minimum
  - **Down Arrow Button**: Simple downward-pointing triangle or arrow shape inside a circle or rounded square, 48×48px minimum
  - **Left Arrow Button**: Simple left-pointing triangle or arrow shape inside a circle or rounded square, 48×48px minimum
  - **Right Arrow Button**: Simple right-pointing triangle or arrow shape inside a circle or rounded square, 48×48px minimum
  - **Style**: Clean geometric shapes, 1-2px stroke outline, filled with color from palette (e.g., light gray or beige background, dark arrow icon)
  - **Active State**: Slightly darker background or stroke when pressed (visual feedback)

- **Action Button**:
  - **Shape**: Circle or rounded square, 48×48px minimum
  - **Label/Icon**: Letter "A" or simple icon (e.g., hand symbol, speech bubble) in contrasting color
  - **Style**: Consistent with D-pad style, same color palette
  - **Active State**: Slightly darker or highlighted when tapped (visual feedback)

**Layout Positioning:**
- **D-Pad**: Anchored to bottom-left corner with 16-24px margin from screen edges
- **Action Button**: Anchored to bottom-right corner with 16-24px margin from screen edges
- **Z-index**: Controls rendered above game canvas but below any modal dialogs

**Art Style**:
- Simple geometric shapes (circles, triangles, squares)
- Colors from existing 10-16 color palette
- 1-2px stroke outlines
- No gradients or complex effects
- Clear visual feedback on press (color change or slight scale)
- Parametric SVG generation preferred (e.g., `createTouchButton({ icon, size, baseColor })`)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A mobile player can load the game and successfully complete all Phase 1 gameplay tasks (move to NPC, trigger dialog, move to chest, trigger interaction) using only touch controls
- **SC-002**: Desktop keyboard controls remain 100% functional with identical behavior to Phase 2 (same movement speed, collision detection, interaction ranges)
- **SC-003**: On-screen controls render and respond to touch input with latency under 100ms (comparable to keyboard input responsiveness)
- **SC-004**: Touch buttons are measured to be at least 48×48 CSS pixels in tappable area (verifiable via browser developer tools)
- **SC-005**: Game canvas and controls fit within mobile viewport without scrolling on at least 3 test devices/viewports (e.g., iPhone 12, iPad, Android phone)
- **SC-006**: A developer can test mobile controls on desktop by resizing browser window to mobile width (viewport-based detection works)
- **SC-007**: No new npm dependencies are added to package.json beyond existing Phaser 3 and build toolchain

### Quality Outcomes

- Mobile players perceive touch controls as intuitive and responsive (comparable to native mobile games)
- Desktop players do not notice any change in gameplay experience (keyboard controls feel unchanged)
- Touch button visuals feel consistent with the game's "simple but charming" art style
- Control layout does not obscure important gameplay elements (player, NPCs, chest remain clearly visible)
- Code for touch controls remains simple, readable, and easy to extend
- README clearly documents mobile support status and any limitations (e.g., landscape-only)
- Touch controls work reliably across different mobile browsers (Safari, Chrome, Firefox mobile)

## Assumptions

- Phase 1 (001-adventure-game-skeleton) and Phase 2 (002-svg-visual-upgrade) are complete and functional
- Phaser 3 supports touch input events natively without additional plugins
- Viewport width detection (e.g., `window.innerWidth < 768px`) is acceptable for mobile/desktop differentiation
- Browser touch APIs (`touchstart`, `touchend`, `touchmove`) are sufficient for implementing touch controls
- SVG-to-texture conversion pipeline from Phase 1/2 can handle touch button SVGs efficiently
- Touch controls do not require haptic feedback or vibration API integration
- Landscape orientation is the primary mobile use case (portrait may be deferred to future phase)
- Mobile performance (60fps gameplay) is achievable with on-screen controls rendered
- Touch event handling does not conflict with Phaser's built-in input system
- Dialog dismissal on mobile can use the same Action button (no separate close button needed)
- On-screen controls can overlay the game canvas without requiring canvas resizing

## Scope Boundaries

### In Scope

- Implementing D-pad (4 directional buttons) for character movement via touch
- Implementing Action button for NPC dialog and object interaction via touch
- Rendering touch buttons using code-generated SVG assets
- Touch event handling (touchstart, touchend, touchmove) for continuous movement and button taps
- Device/viewport detection to show/hide on-screen controls appropriately
- Responsive layout ensuring canvas and controls fit mobile viewport without scrolling (landscape orientation)
- Maintaining 100% keyboard control functionality on desktop (no degradation)
- Visual consistency with Phase 2 art style and color palette
- Documenting mobile support and any limitations in README

### Out of Scope

- Portrait orientation support (may be deferred; landscape-only is acceptable for Phase 3)
- Advanced touch gestures (swipe, pinch, multi-finger gestures) beyond basic tap and hold
- Haptic feedback or vibration on button press
- Customizable control layout (buttons remain fixed in bottom corners)
- Touch control sensitivity settings or configuration UI
- On-screen virtual joystick (D-pad buttons are discrete, not analog)
- Touch control tutorials or on-screen hints for first-time mobile players
- Advanced mobile optimizations (aggressive asset compression, reduced particle effects, etc.)
- Support for stylus input or non-standard touch devices
- Gamepad/controller support (out of scope for Phase 3)
- Accessibility features specific to touch controls (e.g., button size customization, high contrast mode)
- Analytics or telemetry for tracking mobile vs desktop usage
- Separate mobile and desktop build targets (single build serves both)
