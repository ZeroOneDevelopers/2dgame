import Phaser from 'phaser';
import { audioKeys } from '../config/assets.js';
import AudioManager from '../systems/AudioManager.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.audioManager = new AudioManager(this);
    this.audioManager.playMusic(audioKeys.music);

    const { width, height } = this.scale;
    this.add.text(width / 2, height / 2 - 120, 'PHASER PLATFORMER', {
      fontSize: '36px',
      color: '#f5f5f5'
    }).setOrigin(0.5);

    this.createButton(width / 2, height / 2 - 20, 'Start Game', () => {
      this.audioManager.stopMusic();
      this.scene.start('LevelSelectScene');
    });

    this.createButton(width / 2, height / 2 + 60, 'Reset Progress', () => {
      const saveSystem = this.registry.get('saveSystem');
      saveSystem.resetProgress();
      this.showToast('Progress reset.');
    });

    this.createButton(width / 2, height / 2 + 140, 'Settings (Controls)', () => {
      this.showToast('Control remapping available in game pause menu.');
    });

    this.toastText = this.add.text(width / 2, height - 40, '', {
      fontSize: '18px',
      color: '#9ad1ff'
    })
      .setOrigin(0.5)
      .setAlpha(0);
  }

  createButton(x, y, label, callback) {
    const button = this.add.text(x, y, label, {
      fontSize: '24px',
      backgroundColor: '#2f3b52',
      padding: { left: 12, right: 12, top: 6, bottom: 6 },
      color: '#f5f5f5'
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', callback)
      .on('pointerover', () => button.setStyle({ backgroundColor: '#3b4a67' }))
      .on('pointerout', () => button.setStyle({ backgroundColor: '#2f3b52' }));
    return button;
  }

  showToast(message) {
    this.toastText.setText(message);
    this.toastText.setAlpha(1);
    this.tweens.add({
      targets: this.toastText,
      alpha: 0,
      duration: 2000,
      ease: 'Sine.easeOut',
      delay: 500
    });
  }
}
