import { TILE_SIZE } from '../config/gameConfig.js';
import { textureKeys } from '../config/assets.js';

export default class TilemapLoader {
  constructor(scene) {
    this.scene = scene;
  }

  loadMap(key) {
    const map = this.scene.make.tilemap({ key });
    const tileset = map.addTilesetImage('tileset', textureKeys.tileset, TILE_SIZE, TILE_SIZE, 0, 0);

    const groundLayer = map.createLayer('Ground', tileset);
    const oneWayLayer = map.createLayer('OneWay', tileset);
    const hazardLayer = map.createLayer('Hazards', tileset);

    if (groundLayer) {
      groundLayer.setCollisionByProperty({ collides: true });
    }
    if (oneWayLayer) {
      oneWayLayer.setCollisionByProperty({ collides: true });
    }
    if (hazardLayer) {
      hazardLayer.setCollisionByProperty({ collides: true });
    }

    this.scene.mapWidth = map.widthInPixels;
    this.scene.mapHeight = map.heightInPixels;

    this.scene.physics.world.setBounds(0, 0, this.scene.mapWidth, this.scene.mapHeight);

    return { map, groundLayer, oneWayLayer, hazardLayer };
  }

  parseObjectLayer(map, layerName, callback) {
    const layer = map.getObjectLayer(layerName);
    if (!layer) {
      return;
    }
    layer.objects.forEach((object) => {
      callback(object);
    });
  }
}
