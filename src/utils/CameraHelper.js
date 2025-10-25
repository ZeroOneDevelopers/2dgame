import { cameraConfig, GAME_HEIGHT, GAME_WIDTH } from '../config/gameConfig.js';

export default class CameraHelper {
  constructor(scene) {
    this.scene = scene;
  }

  setupFollow(target) {
    const camera = this.scene.cameras.main;
    camera.startFollow(target, true, cameraConfig.lerp, cameraConfig.lerp);
    camera.setBounds(0, 0, this.scene.mapWidth, this.scene.mapHeight);
    camera.setDeadzone(cameraConfig.deadzone.width, cameraConfig.deadzone.height);
    camera.setRoundPixels(true);
  }

  createParallaxBackgrounds(textures) {
    const layers = textures.map((key, index) => {
      const image = this.scene.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, key);
      image.setOrigin(0, 0);
      image.setScrollFactor(0);
      image.depth = -10 - index;
      return image;
    });

    return {
      update: (camera) => {
        layers.forEach((layer, index) => {
          layer.tilePositionX = camera.scrollX * (index * 0.2);
          layer.tilePositionY = camera.scrollY * (index * 0.05);
        });
      }
    };
  }
}
