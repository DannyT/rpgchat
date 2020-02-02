import SpeechBubble from "../gameobjects/SpeechBubble";

class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene'
    });

    // Array of characters in conversation
    this.avatars = [];

    // Array of speech bubbles
    this.speechBubbles = [];
  }

  preload() {}

  create() {
    this.chat = this.cache.json.get('script').chat;
    this.chatIndex = 0;
    
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
    this.setCurrentSnippet();
    this.input.keyboard.on('keyup-SPACE', this.progressChat, this);
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

      this.tweens.add({
          targets: newCharacterImage,
          x: pos.x,
          alpha: 1,
          ease: 'Sine.easeOut',
          duration: 500
      });
    }
  }

  setCurrentSnippet() {
    // grab the current line of text
    let currentSnippet = this.chat[this.chatIndex];

    // look up who is talking
    let avatarIndex = this.avatars.findIndex(char => {return char.frame.name === currentSnippet[0]});
    let pos = this.avatarPositions[avatarIndex];
    let alignLeft = avatarIndex%2 === 0;

    // create a new speech bubble
    let options = currentSnippet.hasOwnProperty('options') ? currentSnippet.options : null; // TODO: implement options, maybe
    let textToAvatarOffset = alignLeft ? 75 : -100;
    let bubble = new SpeechBubble(this, pos.x + textToAvatarOffset, this.scale.height+150, currentSnippet[1], alignLeft, true, options);
    this.add.existing(bubble);
    this.speechBubbles.push(bubble);

    // handle options
    if(options !== null) {
        bubble.once('optionselected', this.optionSelected, this);
        this.input.keyboard.off('keyup-SPACE', this.progressChat, this);
    }

    // move everything else up
    let bottomBubbbleY = this.scale.height;
    for(let i=this.speechBubbles.length-1; i>=0; i--) {
        let bubble = this.speechBubbles[i];
        this.tweens.add({
            targets: [bubble],
            y: bottomBubbbleY,
            alpha: (i<this.speechBubbles.length-1) ? 0.7 : 1, // fade out everything but the latest
            ease: 'Sine.easeOut',
            duration: 300
        });
        bottomBubbbleY -= this.speechBubbles[i].bubble.height + 10;
    }

    // remove oldest
    const keepTextVisibleCount = 2;
    if(this.speechBubbles.length > keepTextVisibleCount){
        let topBubble = this.speechBubbles[0];
        // fade out and up
        this.tweens.add({
            targets: [topBubble],
            alpha: 0,
            ease: 'Sine.easeOut',
            duration: 300,
            onComplete: (tween, targets) => this.children.remove(targets[0], true) // remove from view
        });
        // remove from array
        this.speechBubbles.splice(0, 1);
    }
  }

  progressChat() {
    this.chatIndex++;
    if(this.chatIndex >= this.chat.length) {
        this.endConversation();
        return;
    }
    this.setCurrentSnippet();
  }

  endConversation() {
    let i = 0;
    for(i=this.speechBubbles.length-1; i>=0; i--) { 
        this.remove(this.speechBubbles[i], true);
        this.speechBubbles.splice(i,1);
    }
    this.speechBubbles = [];

    this.tweens.add({
        targets: this.avatars,
        x: {
            getEnd: function (target, key, value) {
                return value < 0 ? -500 : 500;
            }
        },
        alpha: 0,
        ease: 'Sine.easeOut',
        duration: 300,
        onComplete: (tween, targets) => {
            this.remove(targets, true);
            this.setVisible(false);
            this.setActive(false);
        }
    });        
    this.avatars = [];

    this.input.keyboard.off('keyup-SPACE', this.progressChat, this);
    this.emit('endConversation');
  }

  optionSelected(selectedOption) {
    if(selectedOption.hasOwnProperty('setVar')){
        this.setVars.push(selectedOption.setVar);
    }
    
    if(selectedOption.hasOwnProperty('goto')){
        let goto = Number(selectedOption.goto);
        if(goto == -1){
            this.endConversation();
            return;
        }
        this.conversationIndex = goto-1; // -1 because we immediately add one back on in progress chat
    }
    this.scene.input.keyboard.on('keyup-SPACE', this.progressChat, this);
    this.progressChat();
  }

}

export default GameScene;
