import Phaser from 'phaser';
import { assetPaths } from '../config/assets.js';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.createLoadingBar();

    Object.entries(assetPaths.maps).forEach(([key, path]) => {
      this.load.tilemapTiledJSON(key, path);
    });

    this.load.on('complete', () => {
      this.scene.start('MenuScene');
    });
  }

  createLoadingBar() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
    });

    this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontSize: '18px',
      color: '#f5f5f5'
    }).setOrigin(0.5, 0.5);
  }
}
