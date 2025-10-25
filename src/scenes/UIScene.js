import Phaser from 'phaser';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
  }

  init(data) {
    this.hudState = data.hudState;
    this.gameScene = data.gameScene;
  }

  create() {
    this.scoreText = this.addText(20, 20, `Score: ${this.hudState.score}`);
    this.livesText = this.addText(20, 60, `Lives: ${this.hudState.lives}`);
    this.timerText = this.addText(20, 100, `Time: ${this.hudState.time}`);
    this.levelText = this.addText(20, 140, `Level: ${this.hudState.level}`);

    this.gameScene.events.on('hudupdate', () => this.refresh());

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.gameScene.events.off('hudupdate', this.refresh, this);
    });
  }

  addText(x, y, text) {
    return this.add
      .text(x, y, text, {
        fontSize: '22px',
        fontStyle: 'bold',
        backgroundColor: '#0d1321',
        color: '#f5f5f5',
        padding: { left: 10, right: 10, top: 6, bottom: 6 }
      })
      .setScrollFactor(0)
      .setDepth(1000);
  }

  refresh() {
    this.scoreText.setText(`Score: ${this.hudState.score}`);
    this.livesText.setText(`Lives: ${this.hudState.lives}`);
    this.timerText.setText(`Time: ${this.hudState.time}`);
    this.levelText.setText(`Level: ${this.hudState.level}`);
  }
}
