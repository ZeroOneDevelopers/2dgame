import Phaser from 'phaser';
import { playerConfig } from '../config/gameConfig.js';
import { textureKeys, audioKeys } from '../config/assets.js';
import { JumpController } from '../utils/PhysicsHelpers.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, inputManager, audioManager) {
    super(scene, x, y, textureKeys.player);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setDragX(playerConfig.drag);
    this.setMaxVelocity(playerConfig.speed * 1.2, 1000);

    this.inputManager = inputManager;
    this.audioManager = audioManager;
    this.jumpController = new JumpController(this, playerConfig);

    this.health = playerConfig.maxHealth;
    this.invulnerableTimer = 0;
    this.activeCheckpoint = new Phaser.Math.Vector2(x, y);

    this.flashTween = scene.tweens.add({
      targets: this,
      alpha: { from: 1, to: 0.2 },
      ease: 'Linear',
      duration: 100,
      repeat: -1,
      yoyo: true,
      paused: true
    });
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.jumpController.update(delta);
    this.handleMovement();
    this.updateInvulnerability(delta);
  }

  handleMovement() {
    const left = this.inputManager.getKey('moveLeft')?.isDown ?? false;
    const right = this.inputManager.getKey('moveRight')?.isDown ?? false;
    const jumpKey = this.inputManager.getKey('jump');

    if (left && !right) {
      this.setAccelerationX(-playerConfig.acceleration);
      this.setFlipX(true);
    } else if (right && !left) {
      this.setAccelerationX(playerConfig.acceleration);
      this.setFlipX(false);
    } else {
      this.setAccelerationX(0);
      this.setDragX(playerConfig.drag);
    }

    if (jumpKey && Phaser.Input.Keyboard.JustDown(jumpKey)) {
      this.jumpController.requestJump();
    }

    if (this.jumpController.canJump()) {
      this.jumpController.performJump();
      this.audioManager?.playSfx(audioKeys.jump);
    }

    if (jumpKey && jumpKey.isUp && this.body.velocity.y < 0) {
      this.jumpController.cancelJump();
    }
  }

  updateInvulnerability(delta) {
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= delta;
      if (this.invulnerableTimer <= 0) {
        this.clearInvulnerability();
      }
    }
  }

  takeDamage(amount = 1) {
    if (this.invulnerableTimer > 0) {
      return;
    }
    this.health -= amount;
    if (this.health <= 0) {
      this.die();
    } else {
      this.invulnerableTimer = playerConfig.invulnerabilityDuration;
      this.flashTween.resume();
      this.audioManager?.playSfx(audioKeys.hit);
    }
  }

  clearInvulnerability() {
    this.invulnerableTimer = 0;
    this.flashTween.pause();
    this.setAlpha(1);
  }

  die() {
    this.emit('playerdied');
  }

  setCheckpoint(x, y) {
    this.activeCheckpoint.set(x, y);
  }

  respawn() {
    this.clearInvulnerability();
    this.health = playerConfig.maxHealth;
    this.setVelocity(0, 0);
    this.setPosition(this.activeCheckpoint.x, this.activeCheckpoint.y);
  }
}
