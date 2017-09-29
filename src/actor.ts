/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { RoomObject } from "./room-object"
import { Settings } from "./settings"
import { UIMediator } from "./ui-mediator"

export class Actor extends RoomObject {

    private game: Phaser.Game;

    private originX: number;
    private originY: number;

    private text: Phaser.Text;
    private walkSprite: Phaser.Sprite;
    private spriteGroup: Phaser.Group;

    private talkAnimation: Phaser.Animation;
    private walkAnimation: Phaser.Animation;
    private backSprite: Phaser.Sprite;
    
    public constructor(name: string, displayName: string, private textColor: string) {
        super(name, displayName);
    }

    public init(game: Phaser.Game, uiMediator: UIMediator, x: number, y: number, group: Phaser.Group) {
        
        super.init(game, uiMediator, x, y, group);

        this.game = game;

        this.originX = x;
        this.originY = y;

        // Actors are anchored at the bottom instead of middle for easier placement.
        this.sprite.anchor.set(0.5, 1);

        this.walkSprite = game.add.sprite(x, y, this.name + "-walk");
        this.walkSprite.anchor.set(0.5, 1);
        this.walkSprite.inputEnabled = true;
        this.walkSprite.input.pixelPerfectClick = true;
        this.walkSprite.input.pixelPerfectOver = true;
        this.walkSprite.visible = false;

        this.backSprite = game.add.sprite(x, y, this.name + "-back");
        this.backSprite.anchor.set(0.5, 1);
        this.backSprite.visible = false;

        var textStyle = {
            font: "54px Onesize", // Using a large font-size and scaling it back looks better.
            fill: this.textColor,
            stroke: "black",
            strokeThickness: 12,
            align: "center",
            wordWrap: "true",
            wordWrapWidth: 600 // Account for scaling.
        };

        this.text = this.game.add.text(x, y - this.sprite.height - 40, "", textStyle);
        this.text.anchor.setTo(0.5);
        this.text.lineSpacing = -30;
        this.text.scale.x = 0.5;
        this.text.scale.y = 0.5;

        this.talkAnimation = this.sprite.animations.add("talk");

        this.walkAnimation = this.walkSprite.animations.add("walk");

        // TODO JIT play
        this.walkAnimation.play(6, true);

        this.spriteGroup = game.add.group();
        this.spriteGroup.addMultiple([ this.sprite, this.walkSprite, this.backSprite, this.text ]);

        group.add(this.spriteGroup);
    }

    public kill() {
    }

    public async say(text: string) {

        var lines = text.split('\n');
        for (var line of lines) {
            await this.sayLine(line);
        }
    }

    public async turnAway() {
        this.sprite.visible = false;
        this.backSprite.visible = true;
    }

    public async turnFront() {
        this.backSprite.visible = false;
        this.sprite.visible = true;
    }

    public walkTo(x: number, y: number): Promise<void> {

        // Calculate the delta's compared to the original position.
        var deltaX = x - this.originX;
        var deltaY = y - this.originY;

        // No need to walk anywhere if the actor's already there.
        if (deltaX == this.spriteGroup.x && deltaY == this.spriteGroup.y) {
            return Promise.resolve();
        }

        // Walk animation plays at 6 frames per second.
        // A single loop of the walk animation covers 100 pixels.
        // So, an actor walks 100 pixels per second.
        var duration = Math.abs((deltaX - this.spriteGroup.x) / 100 * 1000); // Milliseconds.

        // If the actor walks to the left, flip the walk sprite.
        // Otherwise, reset the sprite if it is already flipped.
        var rightToLeft = deltaX < this.spriteGroup.x;
        var isFlipped = this.walkSprite.scale.x < 0;

        if ((rightToLeft && !isFlipped) || (!rightToLeft && isFlipped)) {
            this.walkSprite.scale.x *= -1;
        }

        // Switch to the walk sprite.
        this.sprite.visible = false;
        this.walkSprite.visible = true;

        // Animate!
        var tween = this.game.add.tween(this.spriteGroup)
            .to( { x: deltaX, y: deltaY }, duration, Phaser.Easing.Default, true);

        return new Promise((resolve) => {
            tween.onComplete.add(() => {

                // Switch back to the default sprite.
                this.walkSprite.visible = false;
                this.sprite.visible = true;

                resolve();
            });
        });
    }

    private sayLine(text: string) {

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
}
