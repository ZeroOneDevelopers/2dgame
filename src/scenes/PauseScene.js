import Phaser from 'phaser';

export default class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');
  }

  init(data) {
    this.gameScene = data.gameScene;
    this.inputManager = data.inputManager;
  }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0);

    this.add.text(width / 2, height / 2 - 160, 'Paused', {
      fontSize: '36px',
      color: '#f5f5f5'
    }).setOrigin(0.5);

    this.createButton(width / 2, height / 2 - 40, 'Resume', () => this.resumeGame());
    this.createButton(width / 2, height / 2 + 40, 'Restart Level', () => this.restartLevel());
    this.createButton(width / 2, height / 2 + 120, 'Exit to Level Select', () => this.exitToSelect());

    this.controlsText = this.add.text(width / 2, height / 2 + 200, 'Remap Jump', {
      fontSize: '20px',
      color: '#9ad1ff',
      backgroundColor: '#1f2534',
      padding: { left: 10, right: 10, top: 6, bottom: 6 }
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.beginRemap('jump'));
  }

  createButton(x, y, label, callback) {
    return this.add
      .text(x, y, label, {
        fontSize: '24px',
        backgroundColor: '#2f3b52',
        color: '#f5f5f5',
        padding: { left: 12, right: 12, top: 6, bottom: 6 }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', callback)
      .on('pointerover', function () {
        this.setStyle({ backgroundColor: '#425878' });
      })
      .on('pointerout', function () {
        this.setStyle({ backgroundColor: '#2f3b52' });
      });
  }

  beginRemap(action) {
    this.controlsText.setText('Press new key...');
    this.inputManager.listenForRemap(action, (keyString) => {
      this.controlsText.setText(`Remap Jump (${keyString})`);
    });
  }

  resumeGame() {
    this.scene.stop();
    this.gameScene.scene.resume();
    this.gameScene.scene.resume('UIScene');
  }

  restartLevel() {
    this.scene.stop();
    this.gameScene.audioManager?.stopMusic();
    this.gameScene.scene.stop('UIScene');
    this.gameScene.scene.restart();
  }

  exitToSelect() {
    this.scene.stop();
    this.gameScene.audioManager?.stopMusic();
    this.gameScene.scene.stop('UIScene');
    this.gameScene.scene.start('LevelSelectScene');
  }
}
