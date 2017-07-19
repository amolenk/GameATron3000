/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { Cursor } from './cursor'

export abstract class RoomObject {

    private game: Phaser.Game;
    private sprite: Phaser.Sprite;

    constructor(private name: string) {
    }

    public abstract DisplayName : string;

    public initialize(game: Phaser.Game) {
        this.game = game;
    }

    public draw(x: number, y: number, onInputDown: Function, onInputDownContext?: any): void {

        this.sprite = this.game.add.sprite(x, y, "object-" + this.name);
        this.sprite.anchor.set(0.5);
    }

    public isHit(cursor: Cursor) : boolean {

        return cursor.overlap(this.sprite);
    }
}
