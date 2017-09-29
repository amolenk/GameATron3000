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

    private backgroundGroup: Phaser.Group;
    private objectGroup: Phaser.Group;
    private actorGroup: Phaser.Group;
    private textGroup: Phaser.Group;

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
                        this.conversationUI.displaySuggestedActions(
                            this.room.getActor("player"),
                            message.suggestedActions.actions);
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

                    case "ActorTurnedAway": {
                        var actor = this.room.getActor(event.actorId);
                        await actor.turnAway();
                        break;
                    }

                    case "ActorTurnedFront": {
                        var actor = this.room.getActor(event.actorId);
                        await actor.turnFront();
                        break;
                    }

                    case "CloseUpOpened": {
                        var roomObject = new RoomObject("closeup-" + event.objectId, "");
                        await this.room.addActor(roomObject, 400, 300);
                        break;
                    }

                    case "CloseUpClosed": {
                        var roomObject = this.room.getObject("closeup-" + event.objectId);
                        if (roomObject) {
                            await this.room.remove(roomObject);
                        }
                        break;
                    }

                    case "Delayed": {
                        await new Promise(resolve => setTimeout(resolve, event.time));
                        break;
                    }

                    case "InventoryItemAdded": {
                        // Remove the object from the room (if it currently exists in a room).
                        if (this.room) {
                            var roomObject = this.room.getObject("object-" + event.objectId);
                            if (roomObject) {
                                await this.room.remove(roomObject);
                            }
                        }
                        await this.inventoryUI.addToInventory(event.objectId, event.description);
                        break;
                    }

                    case "InventoryItemRemoved": {
                        await this.inventoryUI.removeFromInventory(event.objectId);
                        break;
                    }

                    case "RoomObjectAdded": {
                        var roomObject = new RoomObject("object-" + event.objectId, event.description);
                        if (event.foreground) {
                            await this.room.addActor(roomObject, event.x, event.y);                            
                        } else {
                            await this.room.add(roomObject, event.x, event.y);
                        }
                        break;
                    }

                    case "RoomObjectRemoved": {
                        var roomObject = this.room.getObject("object-" + event.objectId);
                        if (roomObject) {
                            await this.room.remove(roomObject);
                        }
                        break;
                    }

                    case "RoomEntered": {
                        this.room = new Room(event.roomId);
                        await this.room.initialize(game, this, this.backgroundGroup, this.objectGroup, this.actorGroup, this.textGroup, event.objects, event.actors);
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

    public create(backgroundGroup: Phaser.Group, objectGroup: Phaser.Group, actorGroup: Phaser.Group, textGroup: Phaser.Group, uiGroup: Phaser.Group) {

        this.backgroundGroup = backgroundGroup;
        this.objectGroup = objectGroup;
        this.actorGroup = actorGroup;
        this.textGroup = textGroup;

        this.actionUI.create(uiGroup);
        this.inventoryUI.create(uiGroup);
        this.verbsUI.create(uiGroup);

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