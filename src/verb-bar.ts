/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

export class VerbBar {

    private game: Phaser.Game;
    private textBox: Phaser.BitmapText;

    constructor(game: Phaser.Game) {
        this.game = game;
    }

    public create(): void {
        this.textBox = this.game.add.bitmapText(this.game.world.centerX, 560, "onesize", "", 20);
        this.textBox.anchor.setTo(0.5, 0.5);
    }

    public clearText(): void {
        this.setText("");
    }

    public setText(text: string): void {
        this.textBox.setText(text);
    }
}