import Phaser from 'phaser';
import SaveSystem from '../systems/SaveSystem.js';
import { textureKeys, audioKeys } from '../config/assets.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  init() {
    this.registry.set('saveSystem', new SaveSystem());
  }

  preload() {
    this.createTexturePlaceholders();
    this.createAudioPlaceholders();
  }

  create() {
    this.scene.start('PreloadScene');
  }

  createTexturePlaceholders() {
    const createRect = (key, width, height, color) => {
      const graphics = this.make.graphics({ x: 0, y: 0, add: false });
      graphics.fillStyle(color, 1);
      graphics.fillRect(0, 0, width, height);
      graphics.generateTexture(key, width, height);
      graphics.destroy();
    };

    createRect(textureKeys.player, 32, 48, 0x4aa3df);
    createRect(textureKeys.enemy, 32, 32, 0xdf5f4a);
    createRect(textureKeys.collectible, 20, 20, 0xf7d23e);
    createRect(textureKeys.checkpoint, 24, 48, 0x5ad66f);
    createRect(textureKeys.movingPlatform, 64, 16, 0xffffff);

    // Tileset placeholder with three colored tiles for ground/one-way/hazard.
    const tileGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    const colors = [0x3b3b4f, 0x4d4d63, 0x6b2f2f];
    colors.forEach((color, index) => {
      tileGraphics.fillStyle(color, 1);
      tileGraphics.fillRect(index * 32, 0, 32, 32);
      tileGraphics.lineStyle(2, 0x101020, 1);
      tileGraphics.strokeRect(index * 32, 0, 32, 32);
    });
    tileGraphics.generateTexture(textureKeys.tileset, 96, 32);
    tileGraphics.destroy();

    textureKeys.backgroundLayers.forEach((key, index) => {
      const layerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
      const color = Phaser.Display.Color.ValueToColor(0x1e1f2b);
      color.brightnessSC(1 + index * 0.2);
      layerGraphics.fillStyle(color.color, 1);
      layerGraphics.fillRect(0, 0, 512, 512);
      layerGraphics.generateTexture(key, 512, 512);
      layerGraphics.destroy();
    });
  }

  createAudioPlaceholders() {
    if (!this.sound.context) {
      return;
    }
    this.createTone(audioKeys.jump, 680, 0.15);
    this.createTone(audioKeys.coin, 880, 0.2);
    this.createTone(audioKeys.hit, 120, 0.3);
    this.createTone(audioKeys.music, 220, 1.5);
  }

  createTone(key, frequency, duration) {
    const context = this.sound.context;
    const sampleRate = context.sampleRate;
    const frameCount = Math.floor(sampleRate * duration);
    const buffer = context.createBuffer(1, frameCount, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      const envelope = 1 - i / frameCount;
      data[i] = Math.sin((2 * Math.PI * frequency * i) / sampleRate) * envelope * 0.3;
    }
    this.cache.audio.add(key, { buffer, context, duration });
  }
}
