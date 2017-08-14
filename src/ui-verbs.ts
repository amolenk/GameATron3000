/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { Action } from "./action"
import { UIMediator } from "./ui-mediator"

export class VerbsUI {

    private textBox: Phaser.BitmapText;
    private verbSprites: Array<Phaser.Sprite>;
    private uiMediator: UIMediator;

    constructor(uiMediator: UIMediator) {
        this.uiMediator = uiMediator;
    }

    public preload(game: Phaser.Game) {

        game.load.atlas("verbs", "../assets/sprites/verbs.png", "../assets/sprites/verbs.json");
    }

    public create(game: Phaser.Game) {

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

    public setEnabled(enabled: boolean) : void {
        for (var sprite of this.verbSprites) {
            sprite.visible = enabled;
        }
    }

    private addVerb(
        id: string,
        posX: number,
        posY: number,
        actionFactory: Function,
        game: Phaser.Game) {

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
            this.uiMediator.selectAction(actionFactory());
        }, this);

        this.verbSprites.push(sprite);
    }
}