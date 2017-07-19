/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { Cursor } from './cursor'
import { RoomObject } from './room-object'
import { VerbBar } from './verb-bar'

export abstract class Room {

    private game: Phaser.Game;
    private cursor: Cursor;
    private verbBar: VerbBar;
    private roomObjects: Array<RoomObject>;
    private hitbox: Phaser.Sprite;
    private selectedObject: Phaser.Sprite;

    constructor(private name: string) {
        this.roomObjects = new Array<RoomObject>();
    }

    public initialize(game: Phaser.Game, cursor: Cursor, verbBar: VerbBar): void {
        this.game = game;
        this.cursor = cursor;
        this.verbBar = verbBar;
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

        for (var i = 0; i < this.roomObjects.length; i++)
        {
            if (this.roomObjects[i].isHit(this.cursor)) {
                this.verbBar.setText(this.roomObjects[i].DisplayName);
                return;
            }
        };

        this.verbBar.clearText();
    }

    public abstract enter(): void;

    protected addRoomObject(roomObject: RoomObject, x: number, y: number): void {

        this.roomObjects.push(roomObject);

        roomObject.initialize(this.game);
        roomObject.draw(x, y, function onInputDown () {

        }, this);
    }
}
