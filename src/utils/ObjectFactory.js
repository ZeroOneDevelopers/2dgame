import Collectible from '../entities/Collectible.js';
import Enemy from '../entities/Enemy.js';
import MovingPlatform from '../entities/MovingPlatform.js';
import Checkpoint from '../entities/Checkpoint.js';

export default class ObjectFactory {
  constructor(scene) {
    this.scene = scene;
  }

  createCollectible(x, y, data = {}) {
    const collectible = new Collectible(this.scene, x, y, data);
    this.scene.collectibles.add(collectible);
    return collectible;
  }

  createEnemy(x, y, data = {}) {
    const enemy = new Enemy(this.scene, x, y, data);
    this.scene.enemies.add(enemy);
    return enemy;
  }

  createMovingPlatform(x, y, data) {
    const platform = new MovingPlatform(this.scene, x, y, data);
    this.scene.movingPlatforms.add(platform);
    return platform;
  }

  createCheckpoint(x, y, data = {}) {
    const checkpoint = new Checkpoint(this.scene, x, y, data);
    this.scene.checkpoints.add(checkpoint);
    return checkpoint;
  }
}
