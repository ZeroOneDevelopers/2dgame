import { levelConfig } from '../config/gameConfig.js';
import { tilemapKeys } from '../config/assets.js';

export default class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super('LevelSelectScene');
  }

  create() {
    const { width, height } = this.scale;
    this.add.text(width / 2, 60, 'Select Level', { fontSize: '32px', color: '#f5f5f5' }).setOrigin(0.5);

    const saveSystem = this.registry.get('saveSystem');

    for (let i = 0; i < levelConfig.totalLevels; i++) {
      const unlocked = i < saveSystem.state.unlockedLevels;
      const button = this.add.text(width / 2, 150 + i * 80, `Level ${i + 1}`, {
        fontSize: '26px',
        color: unlocked ? '#f5f5f5' : '#888',
        backgroundColor: unlocked ? '#384a68' : '#1f2534',
        padding: { left: 14, right: 14, top: 8, bottom: 8 }
      })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: unlocked })
        .on('pointerdown', () => {
          if (unlocked) {
            const mapKey = Object.values(tilemapKeys)[i];
            this.scene.start('GameScene', { levelIndex: i, mapKey });
          }
        });

      if (!unlocked) {
        button.setAlpha(0.5);
      } else {
        button
          .on('pointerover', () => button.setStyle({ backgroundColor: '#4a628a' }))
          .on('pointerout', () => button.setStyle({ backgroundColor: '#384a68' }));
      }
    }

    this.add
      .text(width / 2, height - 80, 'Back to Menu', {
        fontSize: '22px',
        backgroundColor: '#2f3b52',
        color: '#f5f5f5',
        padding: { left: 12, right: 12, top: 6, bottom: 6 }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('MenuScene'));
  }
}
