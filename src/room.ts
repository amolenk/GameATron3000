/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
/// <reference path="../node_modules/typescript/lib/lib.es6.d.ts" />

import { Action } from './action'
import { Actor } from './actor'
import { ConversationUI } from "./ui-conversation"
import { Narrator } from './narrator'
import { RoomObject } from './room-object'

import { UIMediator } from "./ui-mediator"

export abstract class Room {

    private game: Phaser.Game;
    public roomObjects: Array<RoomObject>;
    private actionMap: Map<string, Function>;
    protected narrator: Narrator;

    private conversationUI: ConversationUI;
    private uiMediator: UIMediator;

    constructor(private name: string) {
        this.roomObjects = new Array<RoomObject>();
        this.actionMap = new Map<string, Function>();
    }

    public initialize(game: Phaser.Game, conversationUI: ConversationUI, uiMediator: UIMediator): void {
        this.game = game;
        this.conversationUI = conversationUI;
        this.uiMediator = uiMediator;
        this.uiMediator.setExecuteActionCallback((action) => this.executeAction(action));
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

    public async executeAction(action: Action) {

        var key = `${action.displayName}_${action.subjects[0].name}`;

        var handler = this.actionMap.get(key);
        if (handler != null) {
            await handler.apply(this);
        }
    }

    public enter(): void {
    }

    protected abstract wireUp(): void;

    protected wireAction(actionVerb: string, subject: RoomObject, handler: Function) : void {

        var key = `${actionVerb}_${subject.name}`;

        this.actionMap.set(key, handler);
    }

    // TODO Rename to PlaceObject
    protected addObject(roomObject: RoomObject, x: number, y: number): void {

        roomObject.initialize(x, y, this.game);


        roomObject.onInputOver((roomObject) => this.uiMediator.focusObject(roomObject));
        roomObject.onInputOut((roomObject) => this.uiMediator.focusObject(null));
        roomObject.onInputDown((roomObject) => this.uiMediator.selectObject(roomObject));


        this.roomObjects.push(roomObject);
    }

    protected async startConversation(topicName: string, actor: Actor) {

        await this.conversationUI.startConversation(topicName, actor);
    }
}
