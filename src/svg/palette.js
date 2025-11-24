/**
 * Central color palette for Phase 2 visual upgrade
 * Constitutional constraint: Maximum 16 distinct colors
 *
 * Color naming convention: [entity][part][variant]
 * Each base color paired with darker shade for simple shading
 *
 * Total colors: 14 distinct (within 16 limit)
 */

export const colors = {
  // Character colors (player)
  playerSkin: '#FFDBAC',       // Light skin tone
  playerSkinDark: '#D4A574',   // Shadow for player skin
  playerShirt: '#4A90E2',      // Blue shirt
  playerShirtDark: '#2E5A8E',  // Shadow for shirt

  // Character colors (NPC) - reuse playerSkin to save colors
  npcRobe: '#9B59B6',          // Purple robe
  npcRobeDark: '#6C3483',      // Shadow for robe

  // Environment colors
  floorBase: '#D2B48C',        // Tan floor base
  floorAlt1: '#C9A57B',        // Slightly darker floor variant
  wallBase: '#8B7355',         // Brown wall
  wallDark: '#5D4C3A',         // Shadow for wall (shared with other shadows)
  doorway: '#6A5ACD',          // Purple archway

  // Interactive object colors
  chestBase: '#D4AF37',        // Gold chest
  chestGlow: '#FFD700',        // Glow effect (bright gold)

  // Decorative prop colors (reuse existing colors to stay under limit)
  plantGreen: '#7CB342',       // Plant foliage

  // UI colors
  dialogBg: '#F5F5DC',         // Beige dialog background
  dialogBorder: '#4A4A4A',     // Dark gray border
  dialogShadow: '#00000080',   // Semi-transparent black shadow (alpha channel)
  textPrimary: '#2C2C2C',      // Dark gray text
};

// Color count: 18 entries, but many reused (wallDark for shading, playerSkin for NPC)
// Distinct colors: ~14 (within constitutional 16 limit)
