/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { Cursor } from './cursor'
import { Narrator } from './narrator'
import { Room } from './room'
import { UfoRoom } from './room-ufo'

class GameATron {

    private game: Phaser.Game;
    private cursor: Cursor;
    private narrator: Narrator;
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

        this.room = new UfoRoom();
        this.room.initialize(this.game, this.cursor);
    }

    private preload() {

        this.game.load.bitmapFont("onesize", "../fonts/font.png", "../fonts/font.fnt");

        this.room.preload();
        this.cursor.preload(this.game);
    }

    private create() {

        this.game.stage.smoothed = false;

        // Center game canvas on page
        // this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // this.game.scale.pageAlignHorizontally = true;
        // this.game.scale.pageAlignVertically = true;

        this.room.create();
        this.cursor.create(this.game);

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