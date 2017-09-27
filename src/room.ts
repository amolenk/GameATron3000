/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
/// <reference path="../node_modules/typescript/lib/lib.es6.d.ts" />

import { Action } from './action'
import { Actor } from './actor'
import { Narrator } from './narrator'
import { RoomObject } from './room-object'
import { InventoryItem } from './inventory-item'
import { UIMediator } from "./ui-mediator"

export class Room {

    public narrator: Narrator;

    private game: Phaser.Game;
    private roomObjects: Array<RoomObject>;
    private actionMap: Map<string, Function>;
    private uiMediator: UIMediator;

    constructor(private name: string) {
        this.roomObjects = new Array<RoomObject>();
        this.actionMap = new Map<string, Function>();
    }

    public initialize(game: Phaser.Game, uiMediator: UIMediator, objects?: any, actors?: any) : Promise<void> {
        this.game = game;
        this.uiMediator = uiMediator;
//        this.uiMediator.setExecuteActionCallback((action) => this.executeAction(action));

        this.game.add.sprite(0, 0, this.name + "-room-background");

        if (objects) {
            for (var objectData of objects) {
                var object = new RoomObject("object-" + objectData.id, objectData.description);
                this.add(object, objectData.x, objectData.y);
            }
        }

        if (actors) {
            for (var actorData of actors) {
                var actor = new Actor("actor-" + actorData.id, actorData.description);
                this.add(actor, actorData.x, actorData.y);
            }
        }

        this.narrator = new Narrator(game);
        this.narrator.create();

        return Promise.resolve();
    }

    public preload() {


        // TODO Load other sprites.
    }

    public create() {

        this.game.add.sprite(0, 0, this.name + "-room-background");

        this.narrator.create();
    }

//    public enter() {
//        return this.wireUp();
//    }

//    protected abstract wireUp();

    protected wireAction(actionVerb: string, subject: RoomObject, handler: Function) {

        var key = `${actionVerb}_${subject.name}`;

        this.actionMap.set(key, handler);
    }

    protected wireComplexAction(actionVerb: string, subject1: RoomObject, subject2: RoomObject, handler: Function) {

        var key = `${actionVerb}_${subject1.name}_${subject2.name}`;

        this.actionMap.set(key, handler);
    }

    public getObject(objectId: string) {
        for (var object of this.roomObjects) {
            if (object.name == "object-" + objectId) {
                return object;
            }
        }
        return null;
    }

    public getActor(actorId: string) : Actor {
        for (var object of this.roomObjects) {
            if (object.name == "actor-" + actorId) {
                return <Actor>object;
            }
        }
        return null;
    }

    public add(object: RoomObject, x: number, y: number) {

        object.init(this.game, this.uiMediator, x, y);

        this.roomObjects.push(object);
    }

    public remove(object: RoomObject) {

        // The object no longer needs a visual representation in the room.
        object.kill();

        return Promise.resolve();
    }

    // protected addToInventory(item: InventoryItem) {

    //     return this.uiMediator.addToInventory(item);
    // }

    // protected removeFromInventory(item: InventoryItem) {

    //     return this.uiMediator.removeFromInventory(item);
    // }

    // protected startConversation(topicName: string, actor: Actor) {

    //     return this.uiMediator.startConversation(topicName, actor);
    // }

    // Obsolete
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
