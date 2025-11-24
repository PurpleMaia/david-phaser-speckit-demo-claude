import Phaser from 'phaser';
import { createPlayerSvg } from '../svg/sprites/createPlayerSvg.js';
import { createNpcSvg } from '../svg/sprites/createNpcSvg.js';
import { createChestSvg } from '../svg/sprites/createChestSvg.js';
import { createWallTileSvg } from '../svg/sprites/createWallTileSvg.js';
import { svgToDataUri } from '../utils/svgLoader.js';
import { svgToTexture } from '../utils/textureLoader.js';

export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  init() {
    this.gameState = {
      dialogOpen: false,
      currentInteractable: null
    };
    this.wasMoving = false; // Track movement state for tween management
  }

  // T028: Check proximity between player and target
  checkProximity(player, target) {
    if (!target || !target.active) return false;

    const distance = Phaser.Math.Distance.Between(
      player.x, player.y,
      target.x, target.y
    );

    return distance < (target.interactionRadius || 60);
  }

  // T029: Create dialog box UI element
  createDialogBox() {
    const container = this.add.container(100, 420);

    const background = this.add.rectangle(0, 0, 600, 120, 0x000000);
    background.setStrokeStyle(4, 0xFFFFFF);
    background.setOrigin(0, 0);

    const text = this.add.text(20, 20, '', {
      fontSize: '18px',
      color: '#FFFFFF',
      wordWrap: { width: 560 }
    });

    container.add([background, text]);
    container.textObject = text;

    return container;
  }

  // T034: Show dialog with message
  showDialog(message) {
    this.dialogBox.textObject.setText(message);
    this.dialogBox.setVisible(true);
    this.gameState.dialogOpen = true;
    this.player.setVelocity(0);
  }

  // T035: Hide dialog
  hideDialog() {
    this.dialogBox.setVisible(false);
    this.gameState.dialogOpen = false;
  }

  // T036: Handle interaction key press
  handleInteraction() {
    // If dialog open, close it
    if (this.gameState.dialogOpen) {
      this.hideDialog();
      return;
    }

    // If near NPC, show NPC dialog
    if (this.gameState.currentInteractable === this.npc) {
      this.showDialog(this.npc.dialogText);
      return;
    }

    // T044: If near chest and not collected, collect it
    if (this.gameState.currentInteractable === this.chest && !this.chest.isCollected) {
      this.collectChest();
      return;
    }
  }

  // T043: Collect chest
  collectChest() {
    this.chest.isCollected = true;
    this.chest.setTint(0x888888);
    this.showDialog("You found a thing!");
  }

  preload() {
    // Load SVG assets as data URIs
    const assets = {
      'player': createPlayerSvg(),
      'wall': createWallTileSvg(),
      'npc': createNpcSvg(),
      'chest': createChestSvg()
    };

    Object.entries(assets).forEach(([key, svgString]) => {
      this.load.image(key, svgToDataUri(svgString));
    });
  }

  create() {
    // T017: Create physics world bounds
    this.physics.world.setBounds(0, 0, 800, 600);

    // T018: Create player sprite with physics
    this.player = this.physics.add.sprite(400, 300, 'player');

    // T019: Enable player collision with world bounds
    this.player.setCollideWorldBounds(true);

    // Phase 2 - T018: Add idle animation for player (subtle bob)
    // Store reference to control the tween during movement
    this.playerIdleTween = this.tweens.add({
      targets: this.player,
      y: this.player.y - 4,  // 4px upward offset
      duration: 1000,        // 1 second cycle
      yoyo: true,            // Return to start position
      repeat: -1,            // Infinite loop
      ease: 'Sine.easeInOut', // Smooth motion
      paused: false
    });

    // T020: Create static wall group and add walls
    this.walls = this.physics.add.staticGroup();

    // Top wall
    this.walls.create(400, 16, 'wall').setDisplaySize(800, 32).refreshBody();
    // Right wall
    this.walls.create(784, 300, 'wall').setDisplaySize(32, 600).refreshBody();
    // Bottom wall
    this.walls.create(400, 584, 'wall').setDisplaySize(800, 32).refreshBody();
    // Left wall
    this.walls.create(16, 300, 'wall').setDisplaySize(32, 600).refreshBody();

    // T021: Add collision between player and walls
    this.physics.add.collider(this.player, this.walls);

    // T022: Set up keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D
    });

    // T027: Create NPC sprite
    this.npc = this.add.sprite(500, 200, 'npc');
    this.npc.interactionRadius = 60;
    this.npc.dialogText = "Hello, traveler! Welcome to this demo world.";

    // Phase 2 - T019: Add idle animation for NPC (subtle bob, same as player)
    this.tweens.add({
      targets: this.npc,
      y: this.npc.y - 4,     // 4px upward offset
      duration: 1000,        // 1 second cycle
      yoyo: true,            // Return to start position
      repeat: -1,            // Infinite loop
      ease: 'Sine.easeInOut' // Smooth motion
    });

    // T030: Initialize dialog box (hidden)
    this.dialogBox = this.createDialogBox();
    this.dialogBox.setVisible(false);

    // T031: Set up interaction keys
    this.interactKey = this.input.keyboard.addKey('E');
    this.spaceKey = this.input.keyboard.addKey('SPACE');

    // T041: Create interactive object (chest)
    this.chest = this.add.sprite(200, 400, 'chest');
    this.chest.interactionRadius = 60;
    this.chest.isCollected = false;
  }

  update() {
    // T033: Check proximity to NPC
    const nearNPC = this.checkProximity(this.player, this.npc);
    // T042: Check proximity to chest (only if not collected)
    const nearChest = this.checkProximity(this.player, this.chest) && !this.chest.isCollected;
    // T045: Prioritize NPC over chest when both are nearby
    this.gameState.currentInteractable = nearNPC ? this.npc : (nearChest ? this.chest : null);

    // T037: Handle interaction key press
    if (Phaser.Input.Keyboard.JustDown(this.interactKey) ||
        Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.handleInteraction();
    }

    // T038: Disable movement when dialog is open
    if (this.gameState.dialogOpen) {
      return;
    }

    // Stop player movement by default
    this.player.setVelocity(0);

    // Check if any movement key is pressed
    const isMoving = this.cursors.left.isDown || this.cursors.right.isDown ||
                     this.cursors.up.isDown || this.cursors.down.isDown ||
                     this.wasd.A.isDown || this.wasd.D.isDown ||
                     this.wasd.W.isDown || this.wasd.S.isDown;

    // Manage idle animation tween based on movement state transitions
    if (isMoving && !this.wasMoving) {
      // Started moving: stop and remove the tween
      if (this.playerIdleTween) {
        this.playerIdleTween.stop();
        this.playerIdleTween.remove();
      }
    } else if (!isMoving && this.wasMoving) {
      // Stopped moving: create new tween at current position
      if (this.playerIdleTween) {
        this.playerIdleTween.stop();
        this.playerIdleTween.remove();
      }
      this.playerIdleTween = this.tweens.add({
        targets: this.player,
        y: this.player.y - 4,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    this.wasMoving = isMoving;

    // T023-T024: Implement movement logic for arrow keys and WASD
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      this.player.setVelocityX(160);
    }

    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      this.player.setVelocityY(-160);
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      this.player.setVelocityY(160);
    }
  }
}
