/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

export class Narrator {

    private game: Phaser.Game;

    constructor() {
    }

    public initialize(game: Phaser.Game): void {
        this.game = game;
    }

    public say(text: string): void {

        console.log('narrator created');

        let textbox = this.game.add.bitmapText(200, 160, "onesize", text, 20);

//           //  this.textbox.text = "Look at fridge";
//             // this.textbox.updateText();
//         }, this);


//         // Print some test text.
//         let text = game.add.bitmapText(200, 560, "onesize", "Talk to cleverly disguised Rolorob.", 20);

    }
}