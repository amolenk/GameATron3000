/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { Action } from "./action"
import { UIMediator } from "./ui-mediator"

export class VerbsUI {

    private verbSprites: Array<Phaser.Sprite>;

    constructor(private game: Phaser.Game, private uiMediator: UIMediator) {
        this.verbSprites = new Array<Phaser.Sprite>();
    }

    public preload() {

        this.game.load.atlas("verbs", "../assets/sprites/verbs.png", "../assets/sprites/verbs.json");
    }

    public create(group: Phaser.Group) {
        
        this.addVerb("01_give", 0, 0, () => new Action(Action.GiveVerb, "to"), this.game, group);
        this.addVerb("02_pickup", 1, 0, () => new Action(Action.PickUpVerb), this.game, group);
        this.addVerb("03_use", 2, 0, () => new Action(Action.UseVerb, "with"), this.game, group);
        this.addVerb("04_open", 0, 1, () => new Action(Action.OpenVerb), this.game, group);
        this.addVerb("05_lookat", 1, 1, () => new Action(Action.LookAtVerb), this.game, group);
        this.addVerb("06_push", 2, 1, () => new Action(Action.PushVerb), this.game, group);
        this.addVerb("07_close", 0, 2, () => new Action(Action.CloseVerb), this.game, group);
        this.addVerb("08_talkto", 1, 2, () => new Action(Action.TalkToVerb), this.game, group);
        this.addVerb("09_pull", 2, 2, () => new Action(Action.PullVerb), this.game, group);
    }

    public setVisible(visible: boolean) : void {
        for (var sprite of this.verbSprites) {
            sprite.visible = visible;
        }
    }

    private addVerb(
        id: string,
        posX: number,
        posY: number,
        actionFactory: Function,
        game: Phaser.Game,
        group: Phaser.Group) {

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

        group.add(sprite);

        this.verbSprites.push(sprite);
    }
}