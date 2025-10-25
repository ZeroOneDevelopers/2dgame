export const textureKeys = {
  player: 'player-placeholder',
  enemy: 'enemy-placeholder',
  collectible: 'collectible-placeholder',
  checkpoint: 'checkpoint-placeholder',
  movingPlatform: 'moving-platform-placeholder',
  backgroundLayers: ['bg-layer-0', 'bg-layer-1', 'bg-layer-2'],
  tileset: 'tiles-placeholder'
};

export const audioKeys = {
  music: 'music-loop',
  jump: 'sfx-jump',
  coin: 'sfx-coin',
  hit: 'sfx-hit'
};

export const tilemapKeys = {
  level1: 'map-level-1',
  level2: 'map-level-2',
  level3: 'map-level-3-placeholder'
};

export const assetPaths = {
  maps: {
    [tilemapKeys.level1]: 'assets/maps/level1.json',
    [tilemapKeys.level2]: 'assets/maps/level2.json',
    [tilemapKeys.level3]: 'assets/maps/level2.json'
  },
  audio: {
    [audioKeys.music]: 'assets/audio/music-loop.ogg',
    [audioKeys.jump]: 'assets/audio/jump.wav',
    [audioKeys.coin]: 'assets/audio/coin.wav',
    [audioKeys.hit]: 'assets/audio/hit.wav'
  },
  tileset: 'assets/tiles/tileset.tsx'
};
