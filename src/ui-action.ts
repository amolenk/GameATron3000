/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

export class ActionUI {

    private textBox: Phaser.BitmapText;

    constructor(private game: Phaser.Game) {
    }

    public create(group: Phaser.Group) {

        this.textBox = this.game.add.bitmapText(this.game.world.centerX, 466, "onesize", "", 20);
        this.textBox.anchor.setTo(0.5, 0.5);

        group.add(this.textBox);
    }

    public setText(text: string) {
        this.textBox.setText(text);
    }

    public setVisible(visible: boolean) {
        this.textBox.visible = visible;
    }
}