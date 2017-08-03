/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { RoomObject } from './room-object'
import { Settings } from './settings'

export abstract class Actor extends RoomObject {

    private text: Phaser.Text;
    private talkAnimation: Phaser.Animation;
    private spriteGroup: Phaser.Group;

    public initialize(x: number, y: number, game: Phaser.Game) {

        super.initialize(x, y, game);

        // Actors are anchored at the bottom instead of middle for easier placement.
        this.sprite.anchor.set(0.5, 1);

        var textStyle = {
            font: "54px Onesize", // Using a large font-size and scaling it back looks better.
            fill: "white",
            stroke: "black",
            strokeThickness: 12,
            align: "center",
            wordWrap: "true",
            wordWrapWidth: 800 // Account for scaling.
        };

        this.text = this.game.add.text(x, y - this.sprite.height - 40, "", textStyle);
        this.text.anchor.setTo(0.5);
        this.text.lineSpacing = -30;
        this.text.scale.x = 0.5;
        this.text.scale.y = 0.5;

        this.talkAnimation = this.sprite.animations.add("talk");

        this.spriteGroup = game.add.group();
        this.spriteGroup.addMultiple([ this.sprite, this.text ]);

//        this.walkAnimation = this.sprite.animations.add('walk');
    }

    public say(text: string): Promise<void> {

        this.talkAnimation.play(6, true);
        this.text.setText(text);

        return new Promise((resolve) => {
            
            this.game.time.events.add(
                Math.max(text.length * Settings.TEXT_SPEED, Settings.MIN_TEXT_DURATION),
                () => {
                    this.text.setText('');
                    this.talkAnimation.stop(true);
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
