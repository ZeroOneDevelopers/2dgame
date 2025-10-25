import Phaser from 'phaser';
import InputManager from '../systems/InputManager.js';
import AudioManager from '../systems/AudioManager.js';
import CameraHelper from '../utils/CameraHelper.js';
import TilemapLoader from '../utils/TilemapLoader.js';
import ObjectFactory from '../utils/ObjectFactory.js';
import Player from '../entities/Player.js';
import { textureKeys, tilemapKeys, audioKeys } from '../config/assets.js';
import { hudConfig } from '../config/gameConfig.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.levelIndex = 0;
  }

  init(data) {
    this.levelIndex = data.levelIndex || 0;
    this.mapKey = data.mapKey || tilemapKeys.level1;
  }

  create() {
    this.levelComplete = false;
    this.audioManager = new AudioManager(this);
    this.audioManager.playMusic(audioKeys.music);

    this.inputManager = new InputManager(this);
    this.inputManager.createKeys();

    this.cameraHelper = new CameraHelper(this);
    this.tilemapLoader = new TilemapLoader(this);
    this.objectFactory = new ObjectFactory(this);

    this.collectibles = this.add.group();
    this.enemies = this.add.group();
    this.movingPlatforms = this.add.group();
    this.checkpoints = this.add.group();

    this.hudState = {
      score: hudConfig.initialScore,
      lives: hudConfig.initialLives,
      level: this.levelIndex + 1,
      time: hudConfig.timerDuration
    };

    this.createWorld();
    this.setupEvents();
    this.scene.launch('UIScene', { hudState: this.hudState, gameScene: this });
  }

  createWorld() {
    const { map, groundLayer, oneWayLayer, hazardLayer } = this.tilemapLoader.loadMap(this.mapKey);
    this.map = map;
    this.groundLayer = groundLayer;
    this.oneWayLayer = oneWayLayer;
    this.hazardLayer = hazardLayer;

    this.groundLayer.setDepth(-1);
    this.oneWayLayer.setDepth(-1);
    this.hazardLayer.setDepth(-1);

    this.parallax = this.cameraHelper.createParallaxBackgrounds(textureKeys.backgroundLayers);

    this.spawnEntitiesFromMap(map);

    if (groundLayer) {
      this.physics.add.collider(this.player, groundLayer);
      this.physics.add.collider(this.enemies, groundLayer);
      this.physics.add.collider(this.movingPlatforms, groundLayer);
    }

    if (oneWayLayer) {
      this.physics.add.collider(this.player, oneWayLayer, null, this.handleOneWayCollision, this);
      this.physics.add.collider(this.enemies, oneWayLayer);
    }

    if (hazardLayer) {
      hazardLayer.setTileIndexCallback([3], () => this.handlePlayerHazard(), this);
      this.physics.add.overlap(this.player, hazardLayer);
    }

    this.physics.add.collider(this.player, this.movingPlatforms, this.handlePlatformCollision, undefined, this);

    this.physics.add.overlap(this.player, this.collectibles, this.collectCoin, undefined, this);
    this.physics.add.overlap(this.player, this.enemies, this.handleEnemyCollision, undefined, this);
    this.physics.add.overlap(this.player, this.checkpoints, this.activateCheckpoint, undefined, this);

    this.cameraHelper.setupFollow(this.player);
  }

  spawnEntitiesFromMap(map) {
    const spawnsLayer = map.getObjectLayer('Spawns');
    if (!spawnsLayer) {
      this.createFallbackSpawns();
      return;
    }

    spawnsLayer.objects.forEach((object) => {
      const { name, x, y, properties } = object;
      const data = {};
      (properties || []).forEach((prop) => {
        data[prop.name] = prop.value;
      });

      switch (name) {
        case 'Player':
          this.createPlayer(x, y);
          break;
        case 'Enemy':
          this.objectFactory.createEnemy(x, y, data);
          break;
        case 'Collectible':
          this.objectFactory.createCollectible(x, y, data);
          break;
        case 'MovingPlatform':
          this.objectFactory.createMovingPlatform(x, y, data);
          break;
        case 'Checkpoint':
          this.objectFactory.createCheckpoint(x, y, data);
          break;
        default:
          break;
      }
    });

    if (!this.player) {
      this.createFallbackSpawns();
    }
  }

  createFallbackSpawns() {
    const startX = 100;
    const startY = 300;
    this.createPlayer(startX, startY);
    this.objectFactory.createCollectible(startX + 100, startY - 80, { value: 25 });
    this.objectFactory.createEnemy(startX + 220, startY, { patrolRange: 80 });
    this.objectFactory.createMovingPlatform(startX + 320, startY - 40, { range: 60, vertical: true });
    this.objectFactory.createCheckpoint(startX + 40, startY - 60, {});
  }

  createPlayer(x, y) {
    this.player = new Player(this, x, y, this.inputManager, this.audioManager);
    this.player.on('playerdied', () => this.handlePlayerDeath());
  }

  setupEvents() {
    this.events.on(Phaser.Scenes.Events.RESUME, () => {
      this.inputManager.createKeys();
    });

    this.updateTimerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.hudState.time = Math.max(0, this.hudState.time - 1);
        if (this.hudState.time === 0) {
          this.handlePlayerDeath();
        }
        this.events.emit('hudupdate', this.hudState);
      },
      loop: true
    });
  }

  handleOneWayCollision(player, tile) {
    if (!tile) return false;
    const tileWorldY = tile.getWorldY();
    const playerBottom = player.body.bottom;
    const tolerance = 10;
    if (player.body.velocity.y > 0 && playerBottom <= tileWorldY + tolerance) {
      return true;
    }
    return false;
  }

  handlePlatformCollision(player, platform) {
    if (player.body.velocity.y > 0 && player.body.bottom <= platform.body.top + 10) {
      player.x += platform.body.deltaX();
      return true;
    }
    return false;
  }

  collectCoin(player, collectible) {
    collectible.collect();
    this.hudState.score += collectible.value;
    this.events.emit('hudupdate', this.hudState);
  }

  handleEnemyCollision(player, enemy) {
    const isFalling = player.body.velocity.y > 0 && player.y < enemy.y;
    if (isFalling) {
      enemy.destroy();
      player.setVelocityY(-220);
    } else {
      player.takeDamage();
      if (player.health <= 0) {
        this.handlePlayerDeath();
      }
    }
  }

  activateCheckpoint(player, checkpoint) {
    if (!checkpoint.activated) {
      checkpoint.activate();
      player.setCheckpoint(checkpoint.x, checkpoint.y - player.height / 2);
    }
  }

  handlePlayerHazard() {
    this.handlePlayerDeath();
  }

  handlePlayerDeath() {
    this.hudState.lives -= 1;
    if (this.hudState.lives <= 0) {
      this.endLevel(false);
    } else {
      this.player.respawn();
      this.events.emit('hudupdate', this.hudState);
    }
  }

  endLevel(success) {
    if (this.levelComplete) {
      return;
    }
    this.levelComplete = true;
    const saveSystem = this.registry.get('saveSystem');
    if (success) {
      saveSystem.unlockLevel(this.levelIndex);
    }
    saveSystem.updateHighScore(this.hudState.score);
    this.audioManager.stopMusic();
    if (this.updateTimerEvent) {
      this.updateTimerEvent.remove(false);
      this.updateTimerEvent = null;
    }
    this.scene.stop('UIScene');
    this.scene.start('LevelSelectScene');
  }

  update() {
    if (this.parallax) {
      this.parallax.update(this.cameras.main);
    }

    const pauseKey = this.inputManager.getKey('pause');
    if (pauseKey && Phaser.Input.Keyboard.JustDown(pauseKey)) {
      this.scene.launch('PauseScene', { gameScene: this, inputManager: this.inputManager });
      this.scene.pause();
      this.scene.pause('UIScene');
    }

    if (this.player && this.player.y > this.mapHeight + 100) {
      this.handlePlayerDeath();
    }

    if (this.player && this.player.x > this.mapWidth - 64) {
      this.endLevel(true);
    }
  }
}
