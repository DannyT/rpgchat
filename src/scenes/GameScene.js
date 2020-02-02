class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene'
    });

    // Array of characters in conversation
    this.avatars = [];
  }

  preload() {}

  create() {
    this.chat = this.cache.json.get('script').chat;
    console.log(this.chat);
    
    // Positions to present avatars
    this.avatarPositions = [
      new Phaser.Math.Vector2(150, this.scale.height-100),
      new Phaser.Math.Vector2(this.scale.width-150, this.scale.height-100)
     ];

    // show button
    this.startButton = this.add.image(this.scale.width/2, this.scale.height/2, 'atlas', 'ui/yellow_button00.png');
    this.startButton.setInteractive();
    this.startButton.on('pointerdown', (event) => this.startChat(event));
  }

  startChat(e) {
    this.startButton.setVisible(false);
    this.conversationIndex = 0;
    this.createAvatars();
  }

  createAvatars() {
    for(let i = 0; i < this.chat.length; i++) {
      
      let chatLine = this.chat[i];
      let avatarPath = chatLine[0];
      let avatarIndex = this.avatars.findIndex(avatar => {return avatar.frame.name === avatarPath});
      if(avatarIndex > -1) {
        continue;
      }
      
      let posIndex = this.avatars.length;
      let pos = this.avatarPositions[posIndex];

      let newCharacterImage = this.add.image(posIndex%2==0 ? -200 : this.scale.width+200, pos.y, 'atlas', avatarPath)
          .setAlpha(0);

      if(posIndex%2!=0) {
        newCharacterImage.setFlipX(true);
      }
      this.avatars.push(newCharacterImage);
      console.log(newCharacterImage.x);
      this.tweens.add({
          targets: newCharacterImage,
          x: pos.x,
          alpha: 1,
          ease: 'Sine.easeOut',
          duration: 500
      });
    }
  }

}

export default GameScene;
