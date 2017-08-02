/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
/// <reference path="../node_modules/typescript/lib/lib.es6.d.ts" />

import { Action } from './action'
import { Actor } from './actor'
import { Cursor } from './cursor'
import { Narrator } from './narrator'
import { RoomObject } from './room-object'
import { VerbBar } from './verb-bar'

export abstract class Room {

    private game: Phaser.Game;
    private cursor: Cursor;
    private verbBar: VerbBar;
    public roomObjects: Array<RoomObject>;
    public actors: Array<Actor>;
    private actionMap: Map<string, Function>;
    private hitbox: Phaser.Sprite;
    private selectedObject: Phaser.Sprite;
    private selectedAction: Action;
    protected narrator: Narrator;

    constructor(private name: string) {
        this.actors = new Array<Actor>();
        this.roomObjects = new Array<RoomObject>();
        this.actionMap = new Map<string, Function>();
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

        this.narrator = new Narrator();
        this.narrator.initialize(this.game);
        this.narrator.create();

        this.wireUp();
    }

    public setSelectedAction(action: Action): void {
        this.selectedAction = action;
    }

    public executeAction(action: Action): void {

        var key = `${action.displayName}_${action.subjects[0].name}`;

        var handler = this.actionMap.get(key);
        if (handler != null) {
            handler.apply(this);
        }
    }

    public enter(): void {
    }

    protected abstract wireUp(): void;

    protected wireAction(actionVerb: string, subject: RoomObject, handler: Function) : void {

        var key = `${actionVerb}_${subject.name}`;

        this.actionMap.set(key, handler);
    }

    protected addObject(roomObject: RoomObject, x: number, y: number): void {

        roomObject.initialize(x, y, this.game);
        this.roomObjects.push(roomObject);

        roomObject.initialize(x, y, this.game);
    }
}
