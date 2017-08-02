/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { Cursor } from './cursor'
import { VerbBar } from './verb-bar'

export abstract class RoomObject {

    private sprite: Phaser.Sprite;

    constructor(public name: string) {
    }

    public abstract DisplayName : string;

    public onInputOver(listener: Function, listenerContext?: any) : void {
        this.sprite.events.onInputOver.add(() => {
            listener.apply(listenerContext, [ this ]);
        }, this);
    }

    public onInputOut(listener: Function, listenerContext?: any) : void {
        this.sprite.events.onInputOut.add(() => {
            listener.apply(listenerContext, [ this ]);
        }, this);
    }

    public onInputDown(listener: Function, listenerContext?: any) : void {
        this.sprite.events.onInputDown.add(() => {
            listener.apply(listenerContext, [ this ]);
        }, this);
    }

    public initialize(x: number, y: number, verbBar: VerbBar, game: Phaser.Game) {

        this.sprite = game.add.sprite(x, y, "object-" + this.name);
        this.sprite.anchor.set(0.5);
        this.sprite.inputEnabled = true;
        this.sprite.input.pixelPerfectClick = true;
        this.sprite.input.pixelPerfectOver = true;
    }
}
