/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { Settings } from './settings'

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

    public say(text: string): Promise<void> {

        this.textBox.setText('NARRATOR: ' + text);

        return new Promise((resolve) => {
            
            this.game.time.events.add(
                Math.max(text.length * Settings.TEXT_SPEED, Settings.MIN_TEXT_DURATION),
                () => {
                    this.textBox.setText('');
                    resolve();
                });
        });
    }
}