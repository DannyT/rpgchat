import './index.css';

import Phaser from 'phaser';

import constants from './config/constants';
import BootScene from './scenes/BootScene';

window.Phaser = Phaser;

const config = {
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
  scene: [BootScene]
};

const game = new Phaser.Game(config);
