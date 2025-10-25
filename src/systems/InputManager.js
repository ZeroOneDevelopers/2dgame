import Phaser from 'phaser';
import { ControlConfig } from '../config/controls.js';

export default class InputManager {
  constructor(scene) {
    this.scene = scene;
    this.controlConfig = new ControlConfig();
    this.keys = {};
  }

  createKeys() {
    const input = this.scene.input.keyboard;
    Object.entries(this.controlConfig.keymap).forEach(([action, key]) => {
      const keyCode = Phaser.Input.Keyboard.KeyCodes[key];
      if (keyCode) {
        this.keys[action] = input.addKey(keyCode);
      }
    });
  }

  getKey(action) {
    return this.keys[action];
  }

  updateKeyBindings() {
    Object.keys(this.keys).forEach((action) => {
      this.keys[action].destroy();
    });
    this.createKeys();
  }

  listenForRemap(action, callback) {
    const keyboard = this.scene.input.keyboard;
    const keyCodes = Phaser.Input.Keyboard.KeyCodes;
    const handler = (event) => {
      const { keyCode } = event;
      const keyString = Object.keys(keyCodes).find((name) => keyCodes[name] === keyCode);
      if (keyString) {
        this.controlConfig.remapAction(action, keyString);
        this.updateKeyBindings();
        callback(keyString);
        keyboard.off('keydown', handler);
      }
    };
    keyboard.on('keydown', handler);
  }
}
