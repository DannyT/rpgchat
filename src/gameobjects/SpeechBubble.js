class SpeechBubble extends Phaser.GameObjects.Container {
    constructor (scene, x, y, text, alignLeft=true, typewriter=false, options=null, maxWidth=500) {
        super(scene, x, y);
        this.alignLeft = alignLeft;
        this.typewriter = typewriter;
        this.maxWidth = maxWidth;
        this.padding = 15;
        this.options = options;

        // keep track of height of text boxes
        this.topY = 0;
        this.widestBox = 0;

        // main text box
        this.textBoxes = [this.createTextBox(text)];
        
        // create boxes for options
        if(this.options !== null) {
            let i, optionBox;
            for(i=0; i < this.options.length; i++) {
                optionBox = this.createTextBox(options[i].text, 30);
                this.textBoxes.push(optionBox);
            }

            // option highlight
            this.highlight = scene.add.image(0, 0, 'atlas', 'ui/option-highlight.png');
            this.highlight.setVisible(false);
            this.add(this.highlight);
        }

        // shift all boxes up
        this.textBoxes.forEach(box => {
            box.y -= this.topY + this.padding*2;
            box.x = this.alignLeft ? box.x : -this.widestBox-this.padding;
        });

        let boxWidth = this.widestBox + this.padding*2;
        let boxHeight = this.topY + this.padding;

        this.bubble = scene.add.ninePatch(
            this.alignLeft ? boxWidth/2 : -boxWidth/2, -this.topY + -this.padding*2 + boxHeight/2,       // x / y
            boxWidth, boxHeight,   // width / height
            'atlas',
            'ui/dialogue-box.png',
            {
                top: 12, // Amount of pixels for top
                bottom: 12, // Amount of pixels for bottom
                left: 12, // Amount of pixels for left
                right: 12 // Amount of pixels for right
            }
        );

        // make it tappable
        this.bubble.setInteractive();
        this.add(this.bubble);

        // put the text back on top of the background
        this.sendToBack(this.bubble);

        // setup typewriter effect
        if(this.typewriter) {
            // fixes glitch where when a word is only part-written at the end of a line it shows on the line above then jumps down
            this.textArray = this.textBoxes.map(box => box.getWrappedText(box.text).join('\n'));
            // clears current text
            this.textBoxes.forEach(textBox => textBox.text = '');
            // timer to control speed of typing
            this.typewriterTimer = scene.time.addEvent({ delay: 10, callback: this.typeText, callbackScope: this, repeat:-1 });
        }

        // set props ready to transition in
        this.setAlpha(0);
        this.setScale(0.5);

        // tween it in
        scene.tweens.add({
            targets: this,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            ease: 'Sine.easeOut',
            duration: 300
        });
    }

    createTextBox(text, indent = 0) {
        const textStyle = {
            font: '32px "Courier New"',
            // backgroundColor: '#ff00ff',
            fill: 'white',
            wordWrap: { width: this.maxWidth, useAdvancedWrap: true }
        }

        let textBox = this.scene.make.text({
            x: this.padding + indent,
            y: this.padding,
            text: text,
            style: textStyle
        });
        this.add(textBox);

        // get text measurements
        let textWidth = textBox.width + indent;
        let textHeight = textBox.height;

        // we set a fixed size so the text can be cleared and tickered in
        textBox.setFixedSize(textWidth, textHeight)

        // increase the y position for next box
        this.topY += textHeight + this.padding;

        // track the widest text width so the bubble width can be set
        if(textWidth > this.widestBox) {
            this.widestBox = textWidth;
        }

        return textBox;
    }

    typeText() {
        let totalTextLength = this.textArray.join('').length;
        let currentText = this.textBoxes.map((textBox) => textBox.text);
        let currentTextLength = currentText.join('').length;
        
        if(currentTextLength === totalTextLength) {
            this.typewriterTimer.remove(false);
            
            // if there are options, show highlight
            if(this.textBoxes.length > 1) {
                this.highlight.setVisible(true);
                this.highlightIndex = 0;
                let pos = this.textBoxes[1].getTopLeft();
                this.highlight.setPosition(pos.x, pos.y);
                // handle input
                this.scene.input.keyboard.on('keyup-SPACE', this.chooseOption, this);
                this.scene.input.keyboard.on('keyup-ENTER', this.chooseOption, this);
                this.scene.input.keyboard.on('keydown-UP', this.moveHighlight, this);
                this.scene.input.keyboard.on('keydown-DOWN', this.moveHighlight, this);
            }
            return;
        }

        for(let i = 0; i < this.textArray.length; i++){
            let targetText = this.textArray[i];
            let textBox = this.textBoxes[i];
            if(textBox.text.length < targetText.length) {
                textBox.setText(targetText.substring(0,textBox.text.length+1));
                break;
            }
        }
    }

    moveHighlight(event) {
        if(event.keyCode == Phaser.Input.Keyboard.KeyCodes.UP){
            if(this.highlightIndex < 1) {
                return;
            }
            this.highlightIndex--;
        }
        if(event.keyCode == Phaser.Input.Keyboard.KeyCodes.DOWN){
            if(this.highlightIndex == this.options.length-1) {
                return;
            }
            this.highlightIndex++;
        }
        let pos = this.textBoxes[this.highlightIndex+1].getTopLeft();
        this.scene.tweens.add({
            targets: this.highlight,
            y: pos.y,
            ease: 'Sine.easeOut',
            duration: 150
        });
    }

    chooseOption(){
        this.highlight.setVisible(false);
        this.scene.input.keyboard.off('keyup-SPACE', this.chooseOption, this);
        this.scene.input.keyboard.off('keyup-ENTER', this.chooseOption, this);
        this.scene.input.keyboard.off('keydown-UP', this.moveHighlight, this);
        this.scene.input.keyboard.off('keydown-DOWN', this.moveHighlight, this);

        let selectedOption = this.options[this.highlightIndex];
        this.emit('optionselected', selectedOption);
    }

    destroy(){
        if(this.typewriterTimer){
            this.typewriterTimer.remove(false);
        }
        this.removeAll(true);
        super.destroy();
    }
}

export default SpeechBubble;