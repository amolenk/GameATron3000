/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { BotClient } from './botclient'
import { Cursor } from './cursor'
import { Room } from './room'
import { Settings } from './settings'
import { SecretSettings } from './settings-secrets'
import { UIMediator } from "./ui-mediator"


//import { DirectLine } from '../node_modules/botframework-directlinejs/built/directline';

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

        var botClient = new BotClient();

        this.uiMediator = new UIMediator(this.game, this.cursor, botClient);
    }

    private preload() {

        this.game.load.bitmapFont("onesize", "../fonts/font.png", "../fonts/font.fnt");

        // Room backgrounds
        this.game.load.image("room-park", "assets/backgrounds/park.png");
        this.game.load.image("room-ufo", "assets/backgrounds/ufo.png");
        
        // Room objects
        this.game.load.image("object-newspaper", "../assets/objects/newspaper.png");
        this.game.load.image("object-tractorbeam", "../assets/objects/tractorbeam.png");
        
        // Inventory items
        this.game.load.image("inventory-newspaper", "../assets/inventory/newspaper.png");
        this.game.load.image("inventory-fullshoppingbag", "../assets/inventory/fullshoppingbag.png");

        // Closeups
        this.game.load.image("closeup-newspaper", "../assets/closeups/newspaper.png");
        
        // Actors
        this.game.load.spritesheet("actor-guy", "../assets/objects/guybrush_talk.png", 69, 141);
        this.game.load.spritesheet("actor-guy-walk", "../assets/objects/guybrush_walk.png", 96, 144);
        

        this.uiMediator.preload();

        this.cursor.preload();
    }

    private create() {

        var backgroundGroup = this.game.add.group();
        var objectGroup = this.game.add.group();
        var textGroup = this.game.add.group();
        var uiGroup = this.game.add.group();
        var cursorGroup = this.game.add.group();

        this.uiMediator.create(backgroundGroup, objectGroup, textGroup, uiGroup);
        this.cursor.create(cursorGroup);

        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.stage.smoothed = true;


        // Center game canvas on page
        // this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // this.game.scale.pageAlignHorizontally = true;
        // this.game.scale.pageAlignVertically = true;

        //this.room.create();
        //this.cursor.create();

        // this.room.enter()
        //     .then(() => this.cursor.bringToTop());
    }
}

window.onload = () => {
    let game = new GameATron();
};