/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { Cursor } from './cursor'
import { Narrator } from './narrator'
import { Settings } from './settings'

import { ConversationUI } from "./ui-conversation"
import { UIMediator } from "./ui-mediator"

import { ConversationService } from "./services/service-conversation"

import { Room } from './room'
import { UfoRoom } from './rooms/room-ufo'
import { VillageRoom } from './rooms/room-village'

class GameATron {

    private game: Phaser.Game;
    private cursor: Cursor;
    private narrator: Narrator;
    private room: Room;

    private conversationUI: ConversationUI;
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

        this.cursor = new Cursor(() =>
        {
            if (Settings.ENABLE_FULL_SCREEN)
            {
                this.game.scale.startFullScreen(false);
            }
        });    

        this.narrator = new Narrator();
        this.narrator.initialize(this.game);

        this.conversationUI = new ConversationUI();
        this.uiMediator = new UIMediator();

        this.room = new VillageRoom();
        this.room.initialize(this.game, this.conversationUI, this.uiMediator);
    }

    private preload() {

        this.game.load.bitmapFont("onesize", "../fonts/font.png", "../fonts/font.fnt");

        this.game.load.spritesheet("object-guybrush", "../assets/objects/guybrush_talk.png", 69, 141);
        this.game.load.spritesheet("object-guybrush-walk", "../assets/objects/guybrush_walk.png", 96, 144);


//        this.game.load.image("object-guybrush", "../assets/objects/guybrush.png");
//        this.game.load.image("object-guybrush-talk", "../assets/objects/guybrush_talk.png");
        this.game.load.image("object-sonic", "../assets/objects/sonic.png");

        this.conversationUI.preload(this.game);

        this.uiMediator.preload(this.game);


        this.room.preload();
        this.cursor.preload(this.game);
    }

    private create() {

        this.uiMediator.create(this.game);

        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.stage.smoothed = true;


        // Center game canvas on page
        // this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // this.game.scale.pageAlignHorizontally = true;
        // this.game.scale.pageAlignVertically = true;

        this.room.create();
        this.cursor.create(this.game);
        this.narrator.create();


        this.room.enter();
    }

    private update() {
        this.cursor.update(this.game);
    }

    private render() {

//        this.game.debug.text(this.game.input.mouse.locked.toString(), 320, 32);
    }
}

window.onload = () => {
    let game = new GameATron();
};