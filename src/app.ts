/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { Assets } from "./assets"
import { BotClient } from "./botclient"
import { Cursor } from "./cursor"
import { Layers } from "./layers"
import { Room } from "./room"
import { UIMediator } from "./ui-mediator"

class GameATron {

    private game: Phaser.Game;
    private cursor: Cursor;
    private room: Room;

    private layers: Layers;
    private uiMediator: UIMediator;

    constructor() {
        this.game = new Phaser.Game(
            800,
            600,
            Phaser.AUTO, // Default renderer
            "content", // DOM element
            this,
            false, // transparent
            false); // anti-aliasing

        this.layers = new Layers(this.game);
        this.cursor = new Cursor(this.game, this.layers);
        this.uiMediator = new UIMediator(this.game, this.cursor, new BotClient(), this.layers);
    }

    private preload() {

        Assets.preload(this.game);
    }

    private create() {

        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.stage.smoothed = true;

        this.layers.create();
        this.cursor.create();
        this.uiMediator.create();
    }
}

window.onload = () => {
    let game = new GameATron();
};