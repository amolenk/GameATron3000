/// <reference path="../node_modules/typescript/lib/lib.es6.d.ts" />

import { InventoryItem } from "./inventory-item"
import { UIMediator } from "./ui-mediator"

export class InventoryUI {

    private items: Map<string, InventoryItem>;
    private visible: boolean;

    constructor(private game: Phaser.Game, private uiMediator: UIMediator) {
        this.items = new Map<string, InventoryItem>();
        this.visible = true;
    }

    public addToInventory(item: InventoryItem) {

        item.init(this.game, this.uiMediator, 400, 476);
        item.setVisible(this.visible);

        this.items.set(item.name, item);

        return Promise.resolve();
    }

    public removeFromInventory(item: InventoryItem) {

        item.kill();
        this.items.delete(item.name);

        return Promise.resolve();
    }

    public setVisible(visible: boolean) {
        this.visible = visible;
        for (var item of this.items.values()) {
            item.setVisible(visible);
        }
    }
}