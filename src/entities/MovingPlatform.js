import Phaser from 'phaser';
import { textureKeys } from '../config/assets.js';

export default class MovingPlatform extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, data = {}) {
    super(scene, x, y, textureKeys.movingPlatform);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setAllowGravity(false);
    this.body.setImmovable(true);

    this.startX = x;
    this.startY = y;
    this.range = data.range || 120;
    this.speed = data.speed || 40;
    this.vertical = data.vertical || false;
    this.direction = 1;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    const distance = this.vertical
      ? Math.abs(this.y - this.startY)
      : Math.abs(this.x - this.startX);

    if (distance >= this.range) {
      this.direction *= -1;
    }

    if (this.vertical) {
      this.setVelocityY(this.speed * this.direction);
      this.setVelocityX(0);
    } else {
      this.setVelocityX(this.speed * this.direction);
      this.setVelocityY(0);
    }
  }
}
