export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;
export const TILE_SIZE = 32;

export const physicsConfig = {
  default: 'arcade',
  arcade: {
    gravity: { y: 1000 },
    debug: false
  }
};

export const playerConfig = {
  speed: 220,
  acceleration: 600,
  drag: 900,
  jumpVelocity: -420,
  doubleJumpVelocity: -380,
  maxJumps: 2,
  maxHealth: 3,
  coyoteTime: 120,
  jumpBufferTime: 120,
  invulnerabilityDuration: 1000
};

export const enemyConfig = {
  patrolSpeed: 80,
  detectionRange: 200,
  damage: 1
};

export const levelConfig = {
  totalLevels: 3,
  parallaxScrollFactors: [0.2, 0.5, 0.8]
};

export const hudConfig = {
  initialLives: 3,
  initialScore: 0,
  timerDuration: 300
};

export const cameraConfig = {
  lerp: 0.15,
  deadzone: {
    width: 200,
    height: 100
  }
};

export const audioConfig = {
  musicVolume: 0.4,
  sfxVolume: 0.6
};

export const storageKeys = {
  saveData: 'phaser-platformer-save'
};
