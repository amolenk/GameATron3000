/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

export class ActionUI {

    private textBox: Phaser.BitmapText;

    public create(game: Phaser.Game) {

        this.textBox = game.add.bitmapText(game.world.centerX, 470, "onesize", "", 20);
        this.textBox.anchor.setTo(0.5, 0.5);
    }

    public setEnabled(enabled: boolean) {
        this.textBox.visible = enabled;
    }

    public setText(text: string) {
        this.textBox.setText(text);
    }
}