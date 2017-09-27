/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
/// <reference path="../node_modules/rx/ts/rx.d.ts" />

import { Action } from "./action"
import { ActionUI } from "./ui-action"
import { Actor } from "./actor"
import { BotClient } from "./botclient"
import { ConversationUI } from "./ui-conversation"
import { Cursor } from "./cursor"
import { InventoryItem } from "./inventory-item"
import { InventoryUI } from "./ui-inventory"
import { Narrator } from "./narrator"
import { Room } from "./room"
import { RoomObject } from "./room-object"
import { Settings } from "./settings"
import { VerbsUI } from "./ui-verbs"

export class UIMediator {

    private actionUI: ActionUI;
    private conversationUI: ConversationUI;
    private inventoryUI: InventoryUI;
    private verbsUI: VerbsUI;

    private selectedAction: Action;
    private focussedObject: RoomObject;

    private room: Room;

    constructor(private game: Phaser.Game, private cursor: Cursor, private botClient: BotClient) {
        this.actionUI = new ActionUI(game);
        this.conversationUI = new ConversationUI(game, botClient);
        this.inventoryUI = new InventoryUI(game, this);
        this.verbsUI = new VerbsUI(game, this);

        botClient.connect(
            async message => {

                if (message.actorId) {
                    var actor = this.room.getActor(message.actorId);
                    await actor.say(message.text);

                    if (message.suggestedActions) {
                        this.conversationUI.displaySuggestedActions(message.suggestedActions.actions);
                    }
                }
                else {
                    await this.room.narrator.say(message.text);
                }
            },
            async event => {
                
                switch (event.name) {
                    
                    case "ActorMoved": {
                        var actor = this.room.getActor(event.actorId);
                        await actor.walkTo(event.x, event.y);
                        break;
                    }

                    case "InventoryItemAdded": {
                        var roomObject = this.room.getObject(event.objectId);
                        await this.room.remove(roomObject);
                        await this.inventoryUI.addToInventory(event.objectId, roomObject.displayName);
                        break;
                    }

                    case "RoomEntered": {
                        this.room = new Room(event.roomId);
                        await this.room.initialize(game, this, event.objects, event.actors);

                        // TODO Use layering from other branch.
                        this.cursor.bringToTop();
                        break;
                    }

                    case "Idle": {
                        this.setUIVisible(true);
                        break;
                    }
                }    
            }
        )
    }

    public preload() {
        this.verbsUI.preload();
    }

    public create() {
        this.actionUI.create();
        this.verbsUI.create();

        this.setUIVisible(false);        
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
                this.botClient.sendActionToBot(this.selectedAction);
                
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

    // public addToInventory(item: InventoryItem) {
    //     return this.inventoryUI.addToInventory(item);
    // }

    // public removeFromInventory(item: InventoryItem) {
    //     return this.inventoryUI.removeFromInventory(item);
    // }

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