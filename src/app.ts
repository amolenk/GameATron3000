/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { Cursor } from './cursor'
import { Narrator } from './narrator'
import { Settings } from './settings'
import { VerbBar } from './verb-bar'

import { Room } from './room'
import { UfoRoom } from './rooms/room-ufo'
import { VillageRoom } from './rooms/room-village'

class GameATron {

    private game: Phaser.Game;
    private cursor: Cursor;
    private narrator: Narrator;
    private verbBar: VerbBar;
    private room: Room;

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

        this.verbBar = new VerbBar();

        this.room = new VillageRoom();
        this.room.initialize(this.game, this.cursor, this.verbBar);
    }

    private preload() {

        this.game.load.bitmapFont("onesize", "../fonts/font.png", "../fonts/font.fnt");

        this.game.load.spritesheet("object-guybrush", "../assets/objects/guybrush_talk.png", 69, 141);
        this.game.load.spritesheet("object-guybrush-walk", "../assets/objects/guybrush_walk.png", 96, 144);


//        this.game.load.image("object-guybrush", "../assets/objects/guybrush.png");
//        this.game.load.image("object-guybrush-talk", "../assets/objects/guybrush_talk.png");
        this.game.load.image("object-sonic", "../assets/objects/sonic.png");

        this.verbBar.preload(this.game);


        this.room.preload();
        this.cursor.preload(this.game);
    }

    private create() {

        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.stage.smoothed = true;


        // Center game canvas on page
        // this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // this.game.scale.pageAlignHorizontally = true;
        // this.game.scale.pageAlignVertically = true;

        this.verbBar.create(this.game);
        this.room.create();
        this.cursor.create(this.game);
        this.narrator.create();

        this.verbBar.setRoom(this.room);

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