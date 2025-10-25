import { hudConfig, levelConfig, storageKeys } from '../config/gameConfig.js';

const defaultState = () => ({
  unlockedLevels: 1,
  highScore: 0,
  lives: hudConfig.initialLives,
  score: hudConfig.initialScore,
  settings: {
    music: 1,
    sfx: 1
  }
});

export default class SaveSystem {
  constructor() {
    this.state = defaultState();
    this.load();
  }

  load() {
    if (typeof localStorage === 'undefined') {
      this.state = defaultState();
      return;
    }
    try {
      const raw = localStorage.getItem(storageKeys.saveData);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.state = {
          ...defaultState(),
          ...parsed,
          settings: {
            ...defaultState().settings,
            ...(parsed.settings || {})
          }
        };
      }
    } catch (error) {
      // Local storage not available; keep defaults.
      this.state = defaultState();
    }
  }

  save() {
    if (typeof localStorage === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(storageKeys.saveData, JSON.stringify(this.state));
    } catch (error) {
      // Ignore errors to keep gameplay unaffected.
    }
  }

  unlockLevel(levelIndex) {
    this.state.unlockedLevels = Math.max(this.state.unlockedLevels, levelIndex + 2);
    this.state.unlockedLevels = Math.min(this.state.unlockedLevels, levelConfig.totalLevels);
    this.save();
  }

  updateHighScore(score) {
    if (score > this.state.highScore) {
      this.state.highScore = score;
      this.save();
    }
  }

  resetProgress() {
    this.state = defaultState();
    this.save();
  }

  setSetting(key, value) {
    this.state.settings[key] = value;
    this.save();
  }

  getSetting(key) {
    return this.state.settings[key];
  }
}
