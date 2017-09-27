/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
/// <reference path="../node_modules/typescript/lib/lib.es6.d.ts" />

import { Actor } from './actor'
import { Narrator } from './narrator'
import { RoomObject } from './room-object'
import { UIMediator } from "./ui-mediator"

export class Room {

    public narrator: Narrator;

    private game: Phaser.Game;
    private roomObjects: Array<RoomObject>;
    private actionMap: Map<string, Function>;
    private uiMediator: UIMediator;
    private backgroundGroup: Phaser.Group;
    private objectGroup: Phaser.Group;
    private textGroup: Phaser.Group;

    constructor(private name: string) {
        this.roomObjects = new Array<RoomObject>();
        this.actionMap = new Map<string, Function>();
    }

    public initialize(
        game: Phaser.Game,
        uiMediator: UIMediator,
        backgroundGroup: Phaser.Group,
        objectGroup: Phaser.Group,
        textGroup: Phaser.Group,
        objects?: any,
        actors?: any) : Promise<void> {
        
        this.game = game;
        this.uiMediator = uiMediator;
        this.backgroundGroup = backgroundGroup;
        this.objectGroup = objectGroup;
        this.textGroup = textGroup;

        var background = this.game.add.sprite(0, 0, "room-" + this.name);
        this.backgroundGroup.add(background);

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
        this.narrator.create(this.textGroup);

        return Promise.resolve();
    }

    public getObject(objectId: string) {
        for (var object of this.roomObjects) {
            if (object.name == objectId) {
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

        object.init(this.game, this.uiMediator, x, y, this.objectGroup);

        this.roomObjects.push(object);
    }

    public remove(object: RoomObject) {

        // The object no longer needs a visual representation in the room.
        object.kill();

        return Promise.resolve();
    }
}
