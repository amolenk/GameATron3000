/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { Cursor } from './cursor'
import { Narrator } from './narrator'
import { VerbBar } from './verb-bar'

import { Room } from './room'
import { UfoRoom } from './rooms/room-ufo'

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

        this.cursor = new Cursor();

        this.narrator = new Narrator();
        this.narrator.initialize(this.game);

        this.verbBar = new VerbBar(this.game);

        this.room = new UfoRoom();
        this.room.initialize(this.game, this.cursor, this.verbBar);
    }

    private preload() {

        this.game.load.image("object-sonic", "../assets/objects/sonic.png");

        this.game.load.bitmapFont("onesize", "../fonts/font.png", "../fonts/font.fnt");

        this.room.preload();
        this.cursor.preload(this.game);
    }

    private create() {

        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.stage.smoothed = false;


        // Center game canvas on page
        // this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // this.game.scale.pageAlignHorizontally = true;
        // this.game.scale.pageAlignVertically = true;

        this.verbBar.create();
        this.room.create();
        this.cursor.create(this.game);
        this.narrator.create();

        this.narrator.say('You are in some kind of awesome pixelated spaceship');
    }

    private update() {
        this.room.update();
    }

    private render() {

//        this.game.debug.text(this.game.input.mouse.locked.toString(), 320, 32);
    }
}

window.onload = () => {
    let game = new GameATron();
};