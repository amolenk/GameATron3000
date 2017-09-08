/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
/// <reference path="../node_modules/rx/ts/rx.d.ts" />

import { Action } from "./action"
import { ActionUI } from "./ui-action"
import { Actor } from "./actor"
import { ConversationUI } from "./ui-conversation"
import { Cursor } from "./cursor"
import { Activity, DirectLine } from '../node_modules/botframework-directlinejs/built/directline';
import { InventoryItem } from "./inventory-item"
import { InventoryUI } from "./ui-inventory"
import { Narrator } from "./narrator"
import { Room } from "./room"
import { RoomObject } from "./room-object"
import { VerbsUI } from "./ui-verbs"

// import { Observable } from "../node_modules/rxjs/Observable";
// import { fromPromise } from '../node_modules/rxjs/observable/fromPromise';
// import '../node_modules/rxjs/add/observable/concatAll';
// import '../node_modules/rxjs/add/observable/empty';
// import '../node_modules/rxjs/add/observable/return';


import { AjaxResponse, AjaxRequest } from '../node_modules/rxjs/observable/dom/AjaxObservable';
import { BehaviorSubject } from '../node_modules/rxjs/BehaviorSubject';
import { Observable } from '../node_modules/rxjs/Observable';
import { Subscriber } from '../node_modules/rxjs/Subscriber';
import { Subscription } from '../node_modules/rxjs/Subscription';

import '../node_modules/rxjs/add/operator/catch';
import '../node_modules/rxjs/add/operator/combineLatest';
import '../node_modules/rxjs/add/operator/count';
import '../node_modules/rxjs/add/operator/concat';
import '../node_modules/rxjs/add/operator/concatMap';
import '../node_modules/rxjs/add/operator/delay';
import '../node_modules/rxjs/add/operator/do';
import '../node_modules/rxjs/add/operator/filter';
import '../node_modules/rxjs/add/operator/map';
import '../node_modules/rxjs/add/operator/mergeMap';
import '../node_modules/rxjs/add/operator/retryWhen';
import '../node_modules/rxjs/add/operator/share';
import '../node_modules/rxjs/add/operator/take';

import '../node_modules/rxjs/add/observable/dom/ajax';
import '../node_modules/rxjs/add/observable/empty';
import '../node_modules/rxjs/add/observable/from';
import '../node_modules/rxjs/add/observable/interval';
import '../node_modules/rxjs/add/observable/of';
import '../node_modules/rxjs/add/observable/throw';

import '../node_modules/rxjs/add/observable/defer';

export class UIMediator {

    private actionUI: ActionUI;
    private conversationUI: ConversationUI;
    private inventoryUI: InventoryUI;
    private verbsUI: VerbsUI;

    private selectedAction: Action;
    private focussedObject: RoomObject;

    private conversationId: string;
    private room: Room;

    constructor(game: Phaser.Game, private cursor: Cursor, private botClient: DirectLine) {
        this.actionUI = new ActionUI(game);
        this.conversationUI = new ConversationUI(game);
        this.inventoryUI = new InventoryUI(game, this);
        this.verbsUI = new VerbsUI(game, this);

        botClient.activity$
            .filter(activity => (activity.type === "message" || activity.type === "event") && activity.from.id === "gameatron3000")
            .concatMap(async x => {

                var activity = <any>x;

                console.log(activity);

                if (activity.roomId) {

                    this.conversationId = activity.conversation.id;
                    
                    this.room = new Room(activity.roomId);

                    await this.room.initialize(game, this, activity.objects, activity.actors);

                    this.cursor.bringToTop();
                }
                else if (activity.type == "message")
                {
                    if (activity.actorId) {
                        await this.room.getActor(activity.actorId).say(activity.text);
                    }
                    else {
                        await this.room.narrator.say(activity.text);
                    }
                }
                else if (activity.type == "event")
                {
                    if (activity.name == "WalkTo") {
                        await this.room.getActor(activity.actorId).walkTo(activity.x, activity.y);
                    }
                }

                if (activity.enableUI) {
                    this.setUIVisible(true);                    
                }
            })
            .subscribe();
    }

    private  delay(t) {
        return new Promise(function(resolve) { 
            setTimeout(() => {
                console.log("timer done after " + t);
                resolve();
            }, t)
        });
     }

    public preload() {
        this.verbsUI.preload();
    }

    public create() {
        this.actionUI.create();
        this.verbsUI.create();

        this.setUIVisible(false);        
    }

    public setExecuteActionCallback(executeAction: Function) {
        //this.executeAction = executeAction;
    }

    private async executeAction(action: Action) {

        console.log("Player: " + action.getDisplayText());

        this.botClient.postActivity({
            from: { id: this.conversationId },
            type: "message",
            text: action.getDisplayText()
        })        
        .subscribe(
          // id => console.log("Posted activity, assigned ID ", id),
          // error => console.log("Error posting activity", error)
        );
    }

    public selectAction(action: Action) {
        this.selectedAction = action;
        this.updateText();
    }

    public focusObject(roomObject: RoomObject) {
        this.focussedObject = roomObject;
        this.updateText();
    }

    public selectObject(roomObject: RoomObject) {
        if (this.selectedAction != null) {
            if (this.selectedAction.addSubject(roomObject)) {

                // If the action is complete it can be executed.
                this.setUIVisible(false);
                this.executeAction(this.selectedAction);
//                    .then(() => this.setUIVisible(true));

                // Set the selected action to null now that we've executed it.
                // Also set the object that the mouse is hovering over to null.
                // This will prevent the verb bar from showing the object display name
                // until the mouse has left and re-entered the object. Much less
                // distracting for the player.
                this.selectedAction = null;
                this.focussedObject = null;
            }
        }

        this.updateText();
    }

    public startConversation(topicName: string, actor: Actor) {
        return this.conversationUI.startConversation(topicName, actor);
    }

    public addToInventory(item: InventoryItem) {
        return this.inventoryUI.addToInventory(item);
    }

    public removeFromInventory(item: InventoryItem) {
        return this.inventoryUI.removeFromInventory(item);
    }

    private setUIVisible(visible: boolean) {
        this.actionUI.setVisible(visible);
        this.inventoryUI.setVisible(visible);
        this.verbsUI.setVisible(visible);
    }

    private updateText() {

        var text = "";

        if (this.selectedAction != null) {
            text = this.selectedAction.getDisplayText(this.focussedObject);
        }
        else if (this.focussedObject != null) {
            text = this.focussedObject.displayName;
        }

        this.actionUI.setText(text);
    }
}