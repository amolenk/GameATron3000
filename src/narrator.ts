/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

export class Narrator {

    private game: Phaser.Game;
    private textBox: Phaser.BitmapText;

    constructor() {
    }

    public initialize(game: Phaser.Game): void {
        this.game = game;
    }

    public create(): void {
        this.textBox = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY, "onesize", "", 20);
        this.textBox.anchor.setTo(0.5);
    }

    public say(text: string): void {

        this.textBox.setText("Hello, world!");
//        this.textBox.updateText();

        // var timer = this.game.time.events.add(Phaser.Timer.SECOND * 2, function(this) {
        //     this.textBox.text = "";
        //     this.textBox.updateText();    
        // }, this);
                
        //at some point you want to remove itgame.time.events.remove(timer); MichaelD likes this
    }
}