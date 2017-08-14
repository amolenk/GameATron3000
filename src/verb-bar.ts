/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { Action } from './action'
import { Cursor } from './cursor'
import { Narrator } from './narrator'
import { Room } from './room'
import { RoomObject } from './room-object'

export class VerbBar {

    private textBox: Phaser.BitmapText;
    private verbSprites: Array<Phaser.Sprite>;
    private room: Room;
    private selectedAction: Action;
    private overObject: RoomObject;

    public preload(game: Phaser.Game) {

        game.load.atlas("verbs", "../assets/sprites/verbs.png", "../assets/sprites/verbs.json");
    }

    public create(game: Phaser.Game): void {

        this.textBox = game.add.bitmapText(game.world.centerX, 470, "onesize", "", 20);
        this.textBox.anchor.setTo(0.5, 0.5);

        this.verbSprites = new Array<Phaser.Sprite>();

        this.addVerb("01_give", 0, 0, () => new Action(Action.GiveVerb, "to"), game);
        this.addVerb("02_pickup", 1, 0, () => new Action(Action.PickUpVerb), game);
        this.addVerb("03_use", 2, 0, () => new Action(Action.UseVerb, "with"), game);
        this.addVerb("04_open", 0, 1, () => new Action(Action.OpenVerb), game);
        this.addVerb("05_lookat", 1, 1, () => new Action(Action.LookAtVerb), game);
        this.addVerb("06_push", 2, 1, () => new Action(Action.PushVerb), game);
        this.addVerb("07_close", 0, 2, () => new Action(Action.CloseVerb), game);
        this.addVerb("08_talkto", 1, 2, () => new Action(Action.TalkToVerb), game);
        this.addVerb("09_pull", 2, 2, () => new Action(Action.PullVerb), game);
    }

    public setRoom(room: Room) : void {
        this.room = room;

        for (let roomObject of room.roomObjects) {

            roomObject.onInputOver((roomObject) => this.onRoomObjectInputOver(roomObject));
            roomObject.onInputOut((roomObject) => this.onRoomObjectInputOut(roomObject));
            roomObject.onInputDown((roomObject) => this.onRoomObjectInputDown(roomObject));
        }
    }

    public setEnabled(enabled: boolean) : void {

        console.log("enabled: " + enabled);

        // TODO Enable/disable textbox

        for (var sprite of this.verbSprites) {
            sprite.visible = enabled;
        }
    }

    private onRoomObjectInputOver(roomObject: RoomObject): void {
        this.overObject = roomObject;
        this.updateText();
    }

    private onRoomObjectInputOut(roomObject: RoomObject): void {
        this.overObject = null;
        this.updateText();
    }

    private onRoomObjectInputDown(roomObject: RoomObject): void {

        if (this.selectedAction != null) {

            if (this.selectedAction.addSubject(roomObject)) {
                this.textBox.setText("");
                this.room.executeAction(this.selectedAction);

                // Set the selected action to null now that we've execute it.
                // Also set the object that the mouse is hovering over to null.
                // This will prevent the verb bar from showing the object display name
                // until the mouse has left and re-entered the object. Much less
                // distracting for the player.
                this.selectedAction = null;
                this.overObject = null;
            }
        }

        this.updateText();
    }

    private addVerb(
        id: string,
        posX: number,
        posY: number,
        actionFactory: Function,
        game: Phaser.Game
    ): void {

        var x = 4;
        if (posX > 0) x += (posX == 1 ? 100 : 260);

        var y = 476 + (posY * 40);

        var sprite = game.add.sprite(x, y, "verbs");
        sprite.frameName = id + ".png";
        sprite.inputEnabled = true;

        sprite.events.onInputOver.add(() => {
            sprite.frameName = id + "_sel.png";
        }, this);

        sprite.events.onInputOut.add(() => {
            sprite.frameName = id + ".png";
        }, this);

        sprite.events.onInputDown.add(() => {
            this.selectedAction = actionFactory();
            this.updateText();
        }, this);

        this.verbSprites.push(sprite);
    }

    private updateText(): void {

        var text = "";

        if (this.selectedAction != null) {
            text = this.selectedAction.getDisplayText(this.overObject);// + " ";
        }
        else if (this.overObject != null) {
            text = this.overObject.DisplayName;
        }

        this.textBox.setText(text);
    }
}