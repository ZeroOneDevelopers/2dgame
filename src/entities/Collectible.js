import Phaser from 'phaser';
import { textureKeys, audioKeys } from '../config/assets.js';

export default class Collectible extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, data = {}) {
    super(scene, x, y, textureKeys.collectible);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.value = data.value || 10;
    this.audioManager = scene.audioManager;
  }

  collect() {
    this.audioManager?.playSfx(audioKeys.coin);
    this.disableBody(true, true);
    this.emit('collected', this.value);
  }
}
