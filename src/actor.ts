/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { RoomObject } from './room-object'
import { Settings } from './settings'

export abstract class Actor extends RoomObject {

    private textBox: Phaser.BitmapText;
    private walkAnimation: Phaser.Animation;
    private spriteGroup: Phaser.Group;

    public initialize(x: number, y: number, game: Phaser.Game) {

        super.initialize(x, y, game);

        // Actors are anchored at the bottom instead of middle for easier placement.
        this.sprite.anchor.set(0.5, 1);

        this.textBox = this.game.add.bitmapText(x, y - this.sprite.height - 40, "onesize", "", 24);
        this.textBox.anchor.setTo(0.5);

        this.spriteGroup = game.add.group();
        this.spriteGroup.addMultiple([ this.sprite, this.textBox ]);

        this.walkAnimation = this.sprite.animations.add('walk');
    }

    public say(text: string): Promise<void> {

        this.textBox.setText(text);

        return new Promise((resolve) => {
            
            this.game.time.events.add(
                Math.max(text.length * Settings.TEXT_SPEED, Settings.MIN_TEXT_DURATION),
                () => {
                    this.textBox.setText('');
                    resolve();
                });
        });
    }

    public walk(deltaX: number, deltaY?: number): Promise<void> {

//        this.walkAnimation.play(10, true);

        var duration = Math.abs(deltaX) * 3;

        var tween = this.game.add.tween(this.spriteGroup).to( { x: deltaX, y: deltaY }, duration, Phaser.Easing.Default, true);

        return new Promise(function (resolve) {
            tween.onComplete.add(resolve);
        });
    }
}
