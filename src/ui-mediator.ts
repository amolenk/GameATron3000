/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { Action } from "./action"
import { ActionUI } from "./ui-action"
import { Actor } from "./actor"
import { ConversationUI } from "./ui-conversation"
import { Cursor } from "./cursor"
import { DirectLine } from '../node_modules/botframework-directlinejs/built/directline';
import { InventoryItem } from "./inventory-item"
import { InventoryUI } from "./ui-inventory"
import { Narrator } from "./narrator"
import { Room } from "./room"
import { RoomObject } from "./room-object"
import { VerbsUI } from "./ui-verbs"

export class UIMediator {

    private actionUI: ActionUI;
    private conversationUI: ConversationUI;
    private inventoryUI: InventoryUI;
    private verbsUI: VerbsUI;

    private selectedAction: Action;
    private focussedObject: RoomObject;

    private conversationId: string;
    private room: Room;

//    private executeAction: Function;

    constructor(game: Phaser.Game, private cursor: Cursor, private botClient: DirectLine) {
        this.actionUI = new ActionUI(game);
        this.conversationUI = new ConversationUI(game);
        this.inventoryUI = new InventoryUI(game, this);
        this.verbsUI = new VerbsUI(game, this);

        botClient.activity$
            .filter(activity => activity.type === "message" && activity.from.id === "gameatron3000")
            .flatMap(a => {
                var activity = <any>a;
                
                console.log(activity.from.name + ": " + (<any>activity).text);

                if (activity.roomId) {

                    this.conversationId = activity.conversation.id;
                    
                    this.room = new Room(activity.roomId);
                    this.room.initialize(game, this);
                    this.room.create();

                    if (activity.objects) {
                        for (var objectData of activity.objects) {
                            var object = new RoomObject("object-" + objectData.id, objectData.text);
                            this.room.add(object, objectData.x, objectData.y);
                        }
                    }

                    this.cursor.bringToTop();

                    if (activity.complete) {
                        this.setUIVisible(true);
                    }

                    
                    return Promise.resolve();
                }
                else if (activity.type == "message")
                {
                    return this.room.narrator.say(activity.text)
                        .then(() => this.room.narrator.say("continuation"));
                }

                if (activity.complete) {
                    this.setUIVisible(true);
                }

//                    console.log(activity);

                console.log("done");

                return Promise.resolve();
            })
            .subscribe(_ => console.log("done"));
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