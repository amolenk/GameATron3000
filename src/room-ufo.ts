/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { Room } from './room'

export class UfoRoom extends Room {

    constructor() {
        super("ufo");
    }

    public enter(): void {

        this.addObject();
    }
}