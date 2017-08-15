/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { Action } from "./action"
import { ActionUI } from "./ui-action"
import { Actor } from "./actor"
import { ConversationUI } from "./ui-conversation"
import { InventoryItem } from "./inventory-item"
import { InventoryUI } from "./ui-inventory"
import { RoomObject } from "./room-object"
import { VerbsUI } from "./ui-verbs"

export class UIMediator {

    private actionUI: ActionUI;
    private conversationUI: ConversationUI;
    private inventoryUI: InventoryUI;
    private verbsUI: VerbsUI;

    private selectedAction: Action;
    private focussedObject: RoomObject;

    private executeAction: Function;

    constructor(game: Phaser.Game) {
        this.actionUI = new ActionUI(game);
        this.conversationUI = new ConversationUI(game);
        this.inventoryUI = new InventoryUI(game, this);
        this.verbsUI = new VerbsUI(game, this);
    }

    public preload() {
        this.verbsUI.preload();
    }

    public create() {
        this.actionUI.create();
        this.verbsUI.create();
    }

    public setExecuteActionCallback(executeAction: Function) {
        this.executeAction = executeAction;
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
                this.executeAction(this.selectedAction)
                    .then(() => this.setUIVisible(true));

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