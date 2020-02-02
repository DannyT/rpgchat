import './index.css';

import Phaser from 'phaser';
import { NinePatchPlugin, NinePatch } from '@koreez/phaser3-ninepatch';

import constants from './config/constants';
import BootScene from './scenes/BootScene';

window.Phaser = Phaser;

const config = {
  backgroundColor: '#fff',
  type: Phaser.AUTO,
  width: constants.WIDTH,
  height: constants.HEIGHT,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      debug: false
    }
  },
  plugins: {
    global: [{ key: 'NinePatchPlugin', plugin: NinePatchPlugin, start: true }]
  },
  scene: [BootScene]
};

const game = new Phaser.Game(config);
