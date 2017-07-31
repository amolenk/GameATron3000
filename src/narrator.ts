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
        this.textBox = this.game.add.bitmapText(400, 200, "onesize", "", 24);
        this.textBox.anchor.setTo(0.5);
    }

    public say(lines: string[]): void {

        this.printNextLine(lines.reverse());
    }

    private printNextLine(lines: string[]) : void {

        var line = lines.pop();
        if (line != null) {
            this.textBox.setText(line);

            var timer = this.game.time.events.add(
                Phaser.Timer.SECOND * 2,
                () => this.printNextLine(lines));
        } else {
            this.textBox.setText("");
        }
    }
}