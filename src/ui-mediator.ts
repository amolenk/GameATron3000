/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { Action } from "./action"
import { ActionUI } from "./ui-action"
import { RoomObject } from "./room-object"
import { VerbsUI } from "./ui-verbs"

export class UIMediator {

    private actionUI: ActionUI;
    private verbsUI: VerbsUI;

    private selectedAction: Action;
    private focussedObject: RoomObject;

    private executeAction: Function;

    constructor() {
        this.actionUI = new ActionUI();
        this.verbsUI = new VerbsUI(this);
    }

    public preload(game: Phaser.Game) {
        this.verbsUI.preload(game);
    }

    public create(game: Phaser.Game) {
        this.actionUI.create(game);
        this.verbsUI.create(game);
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
                this.setUIEnabled(false);
                this.executeAction(this.selectedAction)
                    .then(() => this.setUIEnabled(true));

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

    private setUIEnabled(enabled: boolean) {
        this.actionUI.setEnabled(enabled);
        this.verbsUI.setEnabled(enabled);
    }

    private updateText(): void {

        var text = "";

        if (this.selectedAction != null) {
            text = this.selectedAction.getDisplayText(this.focussedObject);
        }
        else if (this.focussedObject != null) {
            text = this.focussedObject.DisplayName;
        }

        this.actionUI.setText(text);
    }
}