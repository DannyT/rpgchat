import atlas from '../assets/atlas/rpgchat.png';
import atlasData from '../assets/atlas/rpgchat.json';
import TitleScene from './GameScene';
import logo from '../assets/images/logo.png';

class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BootScene',
      pack: {
        files: [{ type: 'image', key: 'logo', url: logo }]
      }
    });
  }

  preload() {
    var progress = this.add.graphics();

    this.load.on('progress', value => {
      progress.clear();
      progress.fillStyle(0x990000, 1);
      progress.fillRect(
        0,
        this.sys.game.config.width / 2 - 60,
        this.sys.game.config.width * value,
        60
      );
    });

    this.load.on('complete', function() {
      progress.destroy();
    });

    this.load.atlas('atlas', atlas, atlasData);

    var id = window.location.hash.replace('#', '');
    this.load.json('script', 'https://api.myjson.com/bins/' + id);
  }

  create() {
    this.scene.add('GameScene', TitleScene);
    this.scene.start('GameScene');
  }
}

export default BootScene;
