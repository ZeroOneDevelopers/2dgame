export const defaultControls = {
  moveLeft: 'LEFT',
  moveRight: 'RIGHT',
  jump: 'SPACE',
  pause: 'ESC',
  select: 'ENTER',
  back: 'BACKSPACE'
};

export class ControlConfig {
  constructor(storageKey = 'phaser-platformer-controls') {
    this.storageKey = storageKey;
    this.keymap = { ...defaultControls };
    this.load();
  }

  load() {
    if (typeof localStorage === 'undefined') {
      return;
    }
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.keymap = { ...this.keymap, ...parsed };
      }
    } catch (error) {
      // Fail silently and keep defaults to avoid breaking gameplay.
    }
  }

  save() {
    if (typeof localStorage === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.keymap));
    } catch (error) {
      // Storage can fail (private mode); we keep in-memory map.
    }
  }

  remapAction(action, keyCode) {
    this.keymap[action] = keyCode;
    this.save();
  }

  getKey(action) {
    return this.keymap[action];
  }
}
