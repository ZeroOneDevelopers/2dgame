import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, physicsConfig } from './config/gameConfig.js';
import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import MenuScene from './scenes/MenuScene.js';
import LevelSelectScene from './scenes/LevelSelectScene.js';
import GameScene from './scenes/GameScene.js';
import PauseScene from './scenes/PauseScene.js';
import UIScene from './scenes/UIScene.js';

const gameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  physics: physicsConfig,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: '#2b2d3c',
  scene: [BootScene, PreloadScene, MenuScene, LevelSelectScene, GameScene, PauseScene, UIScene]
};

// eslint-disable-next-line no-new
new Phaser.Game(gameConfig);
