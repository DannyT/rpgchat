import GameScene from './GameScene';

class TitleScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'TitleScene'
    });
  }

  preload() {}

  create() {
    var particles = this.add.particles('blue');

    var emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: 'ADD'
    });

    var logo = this.physics.add.image(400, 100, 'logo');

    logo.setVelocity(300, 400);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);

    this.input.once('pointerdown', () => {
      this.scene.add('GameScene', GameScene);
      this.scene.start('GameScene');
    });
  }

  update(time, delta) {}
}

export default TitleScene;
