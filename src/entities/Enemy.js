import Phaser from 'phaser';
import { enemyConfig } from '../config/gameConfig.js';
import { textureKeys } from '../config/assets.js';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, data = {}) {
    super(scene, x, y, textureKeys.enemy);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.patrolRange = data.patrolRange || 120;
    this.speed = data.speed || enemyConfig.patrolSpeed;
    this.startX = x;
    this.direction = 1;

    this.body.setCollideWorldBounds(true);
    this.body.setImmovable(false);
    this.body.setAllowGravity(true);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.body.setVelocityX(this.speed * this.direction);
    const distance = Math.abs(this.x - this.startX);
    if (distance >= this.patrolRange) {
      this.direction *= -1;
      this.setFlipX(this.direction < 0);
    }
  }
}
