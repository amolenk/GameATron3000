/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { BotClient } from './botclient'
import { Cursor } from './cursor'
import { Room } from './room'
import { Settings } from './settings'
import { SecretSettings } from './settings-secrets'
import { UIMediator } from "./ui-mediator"

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
        this.game.load.image("room-beach", "assets/backgrounds/beach.png");
        
        // Room objects
        this.game.load.image("object-fridge-closed", "../assets/objects/fridge-closed.png");
        this.game.load.image("object-fridge-open-empty", "../assets/objects/fridge-open-empty.png");
        this.game.load.image("object-fridge-open-full", "../assets/objects/fridge-open-full.png");
        this.game.load.image("object-newspaper", "../assets/objects/newspaper.png");
        this.game.load.image("object-todolist", "../assets/objects/todolist.png");
        this.game.load.image("object-grocerylist", "../assets/objects/grocerylist.png");
        this.game.load.image("object-tractorbeam", "../assets/objects/tractorbeam.png");
        
        // Inventory items
        this.game.load.image("inventory-newspaper", "../assets/inventory/newspaper.png");
        this.game.load.image("inventory-groceries", "../assets/inventory/groceries.png");
        this.game.load.image("inventory-todolist", "../assets/inventory/todolist.png");
        this.game.load.image("inventory-grocerylist", "../assets/inventory/grocerylist.png");
        
        // Closeups
        this.game.load.image("closeup-newspaper", "../assets/closeups/newspaper.png");
        
        // Actors
        this.game.load.spritesheet("actor-player", "../assets/actors/guyscotthrie-talk.png", 69, 141);
        this.game.load.spritesheet("actor-player-walk", "../assets/actors/guyscotthrie-walk.png", 96, 144);
        this.game.load.image("actor-player-back", "../assets/actors/guyscotthrie-back.png");

        this.game.load.spritesheet("actor-al", "../assets/actors/al-talk.png", 66, 147);
        this.game.load.spritesheet("actor-al-walk", "../assets/actors/al-walk.png", 96, 150);
        this.game.load.image("actor-al-back", "../assets/actors/al-back.png");
        
        this.game.load.spritesheet("actor-ian", "../assets/actors/ian-talk.png", 66, 147);
        this.game.load.spritesheet("actor-ian-walk", "../assets/actors/ian-walk.png", 96, 150);
        this.game.load.image("actor-ian-back", "../assets/actors/ian-back.png");


        this.uiMediator.preload();

        this.cursor.preload();
    }

    private create() {

        var backgroundGroup = this.game.add.group();
        var objectGroup = this.game.add.group();
        var actorGroup = this.game.add.group();
        var textGroup = this.game.add.group();
        var uiGroup = this.game.add.group();
        var cursorGroup = this.game.add.group();

        this.uiMediator.create(backgroundGroup, objectGroup, actorGroup, textGroup, uiGroup);
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