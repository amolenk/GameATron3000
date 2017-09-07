/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { Cursor } from './cursor'
import { Settings } from './settings'
import { SecretSettings } from './settings-secrets'

import { UIMediator } from "./ui-mediator"

import { Room } from './room'
// import { UfoRoom } from './rooms/room-ufo'
import { VillageRoom } from './gameplay/room-village'

import { DirectLine } from '../node_modules/botframework-directlinejs/built/directline';

class GameATron {

    private game: Phaser.Game;
    private cursor: Cursor;
    private room: Room;

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

        this.cursor = new Cursor(this.game, () =>
        {
            if (Settings.ENABLE_FULL_SCREEN)
            {
                this.game.scale.startFullScreen(false);
            }
        });    

        var botClient = new DirectLine({
            secret: SecretSettings.BOT_DIRECT_LINE_SECRET,
            //domain: "europe.directline.botframework.com"
        });



        // directLine.postActivity({
        //     from: { id: "player", name: "Player" },
        //     type: "event",
        //     name: "start",
        //     value: true
        // })        
        // .subscribe(
        //   // id => console.log("Posted activity, assigned ID ", id),
        //   // error => console.log("Error posting activity", error)
        // );

        this.uiMediator = new UIMediator(this.game, this.cursor, botClient);

//        this.room = new VillageRoom();
//        this.room.initialize(this.game, this.uiMediator);
    }

    private preload() {

        this.game.load.bitmapFont("onesize", "../fonts/font.png", "../fonts/font.fnt");

        this.game.load.spritesheet("actor-guybrush", "../assets/objects/guybrush_talk.png", 69, 141);
        this.game.load.spritesheet("actor-guybrush-walk", "../assets/objects/guybrush_walk.png", 96, 144);

        this.game.load.image("ufo-room-background", "assets/backgrounds/ufo.png");
        this.game.load.image("village-room-background", "assets/backgrounds/village.png");
        
        this.game.load.image("object-sonic", "../assets/sprites/object-sonic.png");
        this.game.load.image("inventory-sonic", "../assets/sprites/inventory-sonic.png");

        this.uiMediator.preload();


//        this.room.preload();
        this.cursor.preload();
    }

    private create() {

        this.uiMediator.create();

        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.stage.smoothed = true;


        // Center game canvas on page
        // this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // this.game.scale.pageAlignHorizontally = true;
        // this.game.scale.pageAlignVertically = true;

        //this.room.create();
        this.cursor.create();

        // this.room.enter()
        //     .then(() => this.cursor.bringToTop());
    }
}

window.onload = () => {
    let game = new GameATron();
};