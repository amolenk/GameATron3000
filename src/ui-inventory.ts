/// <reference path="../node_modules/typescript/lib/lib.es6.d.ts" />

import { InventoryItem } from "./inventory-item"
import { UIMediator } from "./ui-mediator"

export class InventoryUI {

    private items: Map<string, InventoryItem>;
    private visible: boolean;
    private uiGroup: Phaser.Group;    

    constructor(private game: Phaser.Game, private uiMediator: UIMediator) {
        this.items = new Map<string, InventoryItem>();
        this.visible = true;
    }

    public addToInventory(objectId: string, description: string) {

        var item = new InventoryItem("inventory-" + objectId, description);

        item.init(this.game, this.uiMediator, 400 + (42 * this.items.size), 476, this.uiGroup);
        item.setVisible(this.visible);

        this.items.set(item.name, item);

        return Promise.resolve();
    }

    public removeFromInventory(objectId: string) {
        
        var item = this.items.get("inventory-" + objectId);
        if (item)
        {
            item.kill();
            this.items.delete(item.name);
        }

        return Promise.resolve();
    }

    public create(uiGroup: Phaser.Group) {
        this.uiGroup = uiGroup;
    }

    public setVisible(visible: boolean) {
        this.visible = visible;
        for (var item of this.items.values()) {
            item.setVisible(visible);
        }
    }
}