import Phaser from 'phaser';
import { audioConfig } from '../config/gameConfig.js';
import { audioKeys } from '../config/assets.js';

export default class AudioManager {
  constructor(scene) {
    this.scene = scene;
    this.music = null;
  }

  playMusic(key = audioKeys.music) {
    if (this.music) {
      return;
    }
    if (!this.scene.sound.locked) {
      this.music = this.scene.sound.add(key, {
        loop: true,
        volume: audioConfig.musicVolume
      });
      if (this.music) {
        this.music.play();
      }
    } else {
      this.scene.sound.once(Phaser.Sound.Events.UNLOCKED, () => this.playMusic(key));
    }
  }

  stopMusic() {
    if (this.music) {
      this.music.stop();
      this.music.destroy();
      this.music = null;
    }
  }

  playSfx(key, config = {}) {
    if (this.scene.sound.get(key)) {
      this.scene.sound.play(key, { volume: audioConfig.sfxVolume, ...config });
      return;
    }
    const sound = this.scene.sound.add(key, { volume: audioConfig.sfxVolume, ...config });
    if (sound) {
      sound.play();
    }
  }
}
