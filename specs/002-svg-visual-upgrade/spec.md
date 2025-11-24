# Feature Specification: Phase 2 – Visual Upgrade (SVG only)

**Feature Branch**: `002-svg-visual-upgrade`
**Created**: 2025-11-24
**Status**: Draft
**Input**: User description: "Add a new section to the spec titled 'Phase 2 – Visual Upgrade (SVG only)'. Keep all existing gameplay mechanics as-is. We are only upgrading visuals and minor presentation."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Experience Enhanced Character Visuals (Priority: P1)

A player loads the game and immediately notices that the player character and NPCs have more personality and charm through improved visual design, while still maintaining clear readability and game functionality.

**Why this priority**: Character visuals are the most visible and impactful change. Players interact with these sprites constantly, so upgrading them provides immediate perceived value and sets the tone for the entire visual upgrade.

**Independent Test**: Load the game and visually inspect the player character and NPC. Verify that they have head + body structure, use 2-3 colors per character, display clear silhouettes, and show subtle idle animations (breathing or bobbing effect). All gameplay (movement, collision, interaction) must work identically to Phase 1.

**Acceptance Scenarios**:

1. **Given** the game is loaded, **When** the player observes their character, **Then** the character displays a simple head + body structure with 2-3 distinct colors and a clear silhouette
2. **Given** the character is standing still, **When** no input is provided for 1+ seconds, **Then** the character displays a subtle idle animation (bob or breathing effect via tween or 2-3 frame cycle)
3. **Given** the NPC is visible on screen, **When** the player observes it, **Then** the NPC also displays improved characterful design with head + body structure and 2-3 colors
4. **Given** the player moves the character, **When** movement keys are pressed, **Then** movement behavior remains identical to Phase 1 (no functional changes)

---

### User Story 2 - Navigate Enhanced Environment (Priority: P2)

A player explores the room and notices the environment now has visual variety through a simple tile set including floor variations, wall tiles with doorways/archways, and decorative props.

**Why this priority**: Environment tiles provide context and atmosphere. After characters are upgraded, the tile set makes the world feel more cohesive and lived-in without adding complexity.

**Independent Test**: Load the game and observe the room. Verify presence of 2-3 floor tile variations, wall tiles with at least one doorway/archway, and 1-2 decorative props (e.g., potted plant, table, rug). All collision detection must remain identical to Phase 1.

**Acceptance Scenarios**:

1. **Given** the game is loaded, **When** the player observes the floor, **Then** the floor displays 2-3 visual variations (different tile patterns or colors) rather than a uniform background
2. **Given** the room has walls, **When** the player observes the walls, **Then** walls use tile-based rendering and include at least one doorway or archway visual element
3. **Given** the room contains decorative props, **When** the player explores, **Then** the player sees 1-2 non-interactive decorative objects (e.g., potted plant, table, rug) that add visual interest
4. **Given** the player moves near walls or props, **When** testing collision, **Then** collision behavior remains identical to Phase 1 (no functional changes to collision boundaries)

---

### User Story 3 - Discover Visually Distinct Reward Object (Priority: P3)

A player approaches the interactive object (chest) and notices it now looks more rewarding and valuable through improved shading and visual effects.

**Why this priority**: The interactive object represents the "reward" element of the game. Making it visually distinct and appealing increases player motivation to interact with it. This is lower priority because it only affects one object.

**Independent Test**: Load the game, approach the chest/object, and verify it has simple shading, a subtle glow effect (via outer stroke or halo circle/rectangle), and stands out visually from the environment. Interaction behavior must remain identical to Phase 1.

**Acceptance Scenarios**:

1. **Given** the interactive object is visible, **When** the player observes it, **Then** the object displays simple shading (one darker shade) to suggest depth and dimensionality
2. **Given** the object has a glow effect, **When** the player views it, **Then** the glow is achieved via a slight outer stroke or a "halo" shape (circle or rectangle) behind it as part of the SVG
3. **Given** the player approaches the object, **When** comparing it to other environment elements, **Then** the object is visually distinct and draws attention as a collectible reward
4. **Given** the player interacts with the object, **When** pressing the interaction key, **Then** interaction behavior remains identical to Phase 1 (same message, same state change)

---

### User Story 4 - Read Improved Dialog Presentation (Priority: P4)

A player triggers NPC or object interactions and sees dialog displayed in a framed panel with rounded corners and drop-shadow effect, making the text more readable and polished.

**Why this priority**: Dialog panel is only visible during interactions, so it's the lowest visual priority. However, it completes the visual polish by ensuring UI elements match the upgraded art style.

**Independent Test**: Trigger NPC dialog and object interaction messages. Verify the text appears in a framed panel with rounded corners, drop-shadow effect, and colors consistent with the main palette. Dialog functionality must remain identical to Phase 1.

**Acceptance Scenarios**:

1. **Given** the player interacts with the NPC, **When** the dialog appears, **Then** the text is displayed in a framed panel with rounded corners rather than a plain rectangle
2. **Given** the dialog panel is visible, **When** the player observes it, **Then** the panel has a subtle drop-shadow effect achieved via SVG primitives or simple rectangles
3. **Given** the dialog panel uses colors, **When** comparing to other visual elements, **Then** the panel colors are consistent with the main 10-16 color palette established for the game
4. **Given** the player dismisses the dialog, **When** pressing the interaction key, **Then** dialog behavior remains identical to Phase 1 (same dismiss mechanism)

---

### Edge Cases

- What happens when idle animations overlap with movement input (player starts moving mid-animation)?
- How does the system handle rendering performance with multiple tile variations and decorative props?
- What happens if parametric SVG generation functions receive invalid color values or parameters?
- How does the glow effect on the chest render on different background tile variations?
- What happens if the dialog panel is displayed while the player is moving (does it interrupt movement)?

## Requirements *(mandatory)*

### Functional Requirements

**Character Visuals:**
- **FR-001**: Player character sprite MUST be replaced with an SVG featuring simple head + body structure
- **FR-002**: Player character MUST use 2-3 distinct colors with clear color contrast against environment
- **FR-003**: Player character MUST display a clear, readable silhouette when viewed against any background
- **FR-004**: Player character MUST display a subtle idle animation (bob or breathing effect) when stationary
- **FR-005**: Idle animation MUST be implemented via Phaser tween or 2-3 SVG frame cycle
- **FR-006**: NPC sprite MUST be replaced with similar characterful design (head + body, 2-3 colors)
- **FR-007**: All character sprite changes MUST maintain existing collision boundaries and gameplay behavior

**Environment Tiles:**
- **FR-008**: Game MUST display 2-3 floor tile variations using code-generated SVG textures
- **FR-009**: Game MUST display wall tiles using code-generated SVG textures
- **FR-010**: Walls MUST include at least one doorway or archway visual element
- **FR-011**: Room MUST contain 1-2 decorative props (e.g., potted plant, table, rug) as SVG sprites
- **FR-012**: Decorative props MUST be non-interactive and non-blocking (purely visual)
- **FR-013**: All tiles and props MUST maintain existing collision detection behavior

**Interactive Object Enhancement:**
- **FR-014**: Interactive object (chest) MUST display simple shading using one darker shade per base color
- **FR-015**: Interactive object MUST have a subtle glow effect via outer stroke OR halo shape behind it
- **FR-016**: Glow effect MUST be part of the SVG definition (no runtime lighting or particles)
- **FR-017**: Interactive object MUST be visually distinct from environment and decorative props

**Dialog UI:**
- **FR-018**: Dialog box MUST be replaced with a framed panel featuring rounded corners
- **FR-019**: Dialog panel MUST include a drop-shadow effect using SVG primitives or simple rectangles
- **FR-020**: Dialog panel colors MUST be consistent with the main game color palette
- **FR-021**: Dialog text MUST remain readable and meet existing text display requirements

**Style Constraints (Constitutional Compliance):**
- **FR-022**: ALL visual assets MUST be generated from SVG strings or functions in code (no external bitmap files)
- **FR-023**: Game MUST use a total color palette of 10-16 colors maximum across all visual elements
- **FR-024**: Each base color MUST have ONE darker shade for shading (no gradients or complex lighting)
- **FR-025**: SVG generation MUST prefer parametric, reusable functions over one-off drawings (e.g., `createCharacterSvg({ bodyColor, accessoryColor, emotion })`)
- **FR-026**: SVG shapes and math MUST remain simple enough for an LLM to understand and extend

### Key Entities

- **Player Character Visual**: SVG sprite definition with head/body structure, 2-3 colors, idle animation frames or tween parameters
- **NPC Visual**: SVG sprite definition with similar structure to player but distinct colors/accessories
- **Tile Set**: Collection of 2-3 floor SVG patterns, wall SVG patterns, doorway/archway SVG elements
- **Decorative Props**: 1-2 non-interactive SVG sprites (plant, table, rug) with positions
- **Interactive Object Visual**: Enhanced chest SVG with shading layer and glow effect layer
- **Dialog Panel Visual**: Framed SVG panel definition with rounded corners, shadow layer, and text area
- **Color Palette**: Defined set of 10-16 colors (base colors + one darker shade each) used consistently across all assets

### Visual Assets

**Constitutional Constraint**: All visual assets MUST be code-generated SVGs (no bitmap files).

**Target Aesthetic**: "Simple but charming" — early Zelda/SNES vibes with modern clarity.

**Character Sprites:**
- **Player Character SVG**: Head (circle or rounded shape) + body (rectangle or rounded rectangle), 2-3 colors (e.g., skin tone, clothing primary, clothing accent), clear outline, idle animation via tween (vertical bob) or 2-3 frames (breathing)
- **NPC Character SVG**: Similar structure to player, different color scheme to distinguish role (e.g., red/brown for merchant, purple/white for wizard)

**Environment Tiles:**
- **Floor Tile Variations (2-3)**: Simple geometric patterns or color variations (e.g., checkerboard, stone pattern, wood grain represented by lines), consistent size (32x32 or 64x64)
- **Wall Tiles**: Solid color with subtle texture (simple line patterns), consistent with room theme
- **Doorway/Archway**: Simple arch shape or rectangular opening, distinct color to indicate passageway
- **Decorative Props**:
  - Potted plant (green circle foliage + brown rectangle pot)
  - Table (brown rectangle top + two rectangles for legs)
  - Rug (oval or rectangle with simple pattern)

**Interactive Object:**
- **Enhanced Chest SVG**:
  - Base shape: Rectangle (chest body) + smaller rectangle (lid)
  - Shading: Darker shade on bottom edge and sides to suggest depth
  - Glow effect: Yellow/gold outer stroke (2-3px) OR yellow/gold circle/rectangle halo behind chest scaled 110-120%

**Dialog UI:**
- **Framed Panel SVG**:
  - Rounded rectangle (rx/ry attributes for corner radius)
  - Background color (light beige or white from palette)
  - Border/outline (dark color from palette, 2-3px stroke)
  - Drop-shadow: Offset gray/black rectangle behind main panel OR SVG `<filter>` with drop-shadow (prefer simple rectangle for LLM clarity)

**Art Style**:
- Clean silhouettes with clear color contrast
- 10-16 color palette total
- Soft outlines (1-2px stroke)
- Simple shading (one darker shade per base color, no gradients)
- Parametric SVG generators preferred (e.g., `createCharacterSvg({ bodyColor, accessoryColor, emotion })`)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Player can immediately distinguish player character from NPCs and environment through color and shape contrast when viewing the game
- **SC-002**: All visual upgrades load and render without increasing game load time beyond 0.5 seconds compared to Phase 1
- **SC-003**: Idle animations run smoothly at 60fps without impacting game performance
- **SC-004**: A developer can generate a new character variant by calling a parametric function with different color parameters in under 2 minutes
- **SC-005**: Total color count across all visual assets remains at or below 16 distinct colors
- **SC-006**: All gameplay mechanics (movement speed, collision detection, interaction ranges) remain identical to Phase 1 measurements (same success criteria as SC-001 through SC-004 from Phase 1)

### Quality Outcomes

- Player perceives the game as "simple but charming" with early Zelda/SNES aesthetic
- Character designs feel expressive and personable despite simplicity
- Environment feels varied and lived-in rather than empty/placeholder
- Interactive object clearly signals "reward" and draws player attention
- Dialog presentation feels polished and readable
- Visual style remains cohesive across all elements (consistent palette and shading approach)
- Code for SVG generation remains readable and extendable by other developers or LLMs

## Assumptions

- Phase 1 implementation (001-adventure-game-skeleton) is complete and functional
- All Phase 1 gameplay mechanics (movement, collision, interaction) will remain unchanged
- Color palette of 10-16 colors is sufficient to create visual variety and charm
- Idle animations at 1-2 second cycle length are sufficient for "breathing/bobbing" effect
- Phaser's tween system or sprite frame animation can handle idle animations without custom animation code
- SVG-to-texture conversion pipeline established in Phase 1 supports multiple SVG assets efficiently
- Simple parametric functions (e.g., function calls with color parameters) are acceptable for "reusable SVG generators"
- Drop-shadow effects can be achieved with simple offset rectangles (no need for complex SVG filters)
- Decorative props do not require collision detection (non-blocking)
- Visual upgrades do not require changes to core game logic or state management

## Scope Boundaries

### In Scope

- Replacing player and NPC sprites with characterful SVG designs (head + body)
- Adding subtle idle animations for stationary characters
- Creating 2-3 floor tile variations and wall tiles with doorway/archway
- Adding 1-2 decorative props (plant, table, rug)
- Enhancing interactive object (chest) with shading and glow effect
- Upgrading dialog box to framed panel with rounded corners and drop-shadow
- Establishing and documenting 10-16 color palette
- Creating parametric SVG generation functions for character sprites

### Out of Scope

- Changes to gameplay mechanics or logic (movement, collision, interaction)
- New features or game content (no new NPCs, objects, rooms)
- Animated sprite sheets or complex multi-frame animations
- Particle effects, lighting systems, or dynamic visual effects
- Audio or sound effects (not visual)
- Mobile/responsive layout changes
- Performance optimization beyond maintaining Phase 1 performance
- Advanced SVG features (filters, masks, complex gradients)
- Character facing direction sprites (characters remain static orientation)
- Multiple emotion states for characters (single expression sufficient)
- Interactive animations (e.g., chest opening animation when collected)
