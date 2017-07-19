/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { Cursor } from './cursor'

export abstract class Room {

    private game: Phaser.Game;
    private cursor: Cursor;
    private hitbox: Phaser.Sprite;
    private selectedObject: Phaser.Sprite;

    constructor(private name: string) {
    }

    public initialize(game: Phaser.Game, cursor: Cursor): void {
        this.game = game;
        this.cursor = cursor;
    }

    public preload(): void {

        this.game.load.image(this.name + "-room-background", "assets/backgrounds/" + this.name + ".png");

        // TODO Load other sprites.
    }

    public create(): void {

        this.game.add.sprite(0, 0, this.name + "-room-background");

        this.enter();
    }

    public update(): void {

        if (this.cursor.overlap(this.hitbox)) {

            if (this.hitbox !== this.selectedObject) {
                console.log("enter");
                this.selectedObject = this.hitbox;
            }
        } else if (this.selectedObject != null) {
            console.log("exit");
            this.selectedObject = null;
        }
    }

    public abstract enter(): void;

    protected addObject(): void {

        this.hitbox = this.game.add.sprite(500, 240, "ufo-room-background");
        this.hitbox.scale.setTo(0.05, 0.25);
        this.hitbox.inputEnabled = true;
        this.hitbox.renderable = false;
    }
}
