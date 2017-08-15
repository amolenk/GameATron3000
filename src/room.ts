/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
/// <reference path="../node_modules/typescript/lib/lib.es6.d.ts" />

import { Action } from './action'
import { Actor } from './actor'
import { Narrator } from './narrator'
import { RoomObject } from './room-object'
import { InventoryItem } from './inventory-item'
import { UIMediator } from "./ui-mediator"

export abstract class Room {

    private game: Phaser.Game;
    private roomObjects: Array<RoomObject>;
    private actionMap: Map<string, Function>;
    private uiMediator: UIMediator;
    protected narrator: Narrator;

    constructor(private name: string) {
        this.roomObjects = new Array<RoomObject>();
        this.actionMap = new Map<string, Function>();
    }

    public initialize(game: Phaser.Game, uiMediator: UIMediator) {
        this.game = game;
        this.uiMediator = uiMediator;
        this.uiMediator.setExecuteActionCallback((action) => this.executeAction(action));
        this.narrator = new Narrator(game);
    }

    public preload() {

        this.game.load.image(this.name + "-room-background", "assets/backgrounds/" + this.name + ".png");

        // TODO Load other sprites.
    }

    public create() {

        this.game.add.sprite(0, 0, this.name + "-room-background");

        this.narrator.create();
    }

    public enter() {
        return this.wireUp();
    }

    protected abstract wireUp();

    protected wireAction(actionVerb: string, subject: RoomObject, handler: Function) {

        var key = `${actionVerb}_${subject.name}`;

        this.actionMap.set(key, handler);
    }

    protected wireComplexAction(actionVerb: string, subject1: RoomObject, subject2: RoomObject, handler: Function) {

        var key = `${actionVerb}_${subject1.name}_${subject2.name}`;

        this.actionMap.set(key, handler);
    }

    protected add(object: RoomObject, x: number, y: number) {

        object.init(this.game, this.uiMediator, x, y);

        this.roomObjects.push(object);

        return Promise.resolve();
    }

    protected remove(object: RoomObject) {

        // The object no longer needs a visual representation in the room.
        object.kill();

        return Promise.resolve();
    }

    protected addToInventory(item: InventoryItem) {

        return this.uiMediator.addToInventory(item);
    }

    protected removeFromInventory(item: InventoryItem) {

        return this.uiMediator.removeFromInventory(item);
    }

    protected startConversation(topicName: string, actor: Actor) {

        return this.uiMediator.startConversation(topicName, actor);
    }

    private async executeAction(action: Action) {

        var key = action.displayName;
        for (var subject of action.subjects) {
            key += `_${subject.name}`;
        }

        var handler = this.actionMap.get(key);
        if (handler != null) {
            await handler.apply(this);
        }
    }
}
