class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene'
    });
  }

  preload() {}

  create() {
    this.add.text(100, 100, 'Hello World', {
      fontFamily: 'Arial',
      fontSize: 64,
      color: '#00ff00'
    });
  }

  update(time, delta) {}
}

export default GameScene;
