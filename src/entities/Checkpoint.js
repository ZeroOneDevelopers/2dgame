import Phaser from 'phaser';
import { textureKeys } from '../config/assets.js';

export default class Checkpoint extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, data = {}) {
    super(scene, x, y, textureKeys.checkpoint);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.activated = false;
  }

  activate() {
    this.activated = true;
    this.setTint(0x88ff88);
  }
}
