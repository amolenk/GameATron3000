import { RoomObject } from "./room-object"
import { UIMediator } from "./ui-mediator"

export class InventoryItem extends RoomObject {

    public init(game: Phaser.Game, uiMediator: UIMediator, x: number, y: number, group: Phaser.Group) {

        super.init(game, uiMediator, x, y, group);
        this.sprite.anchor.set(0);

        // Keep cursor on top.
        this.sprite.sendToBack();
    }

    public setposition(x: number, y: number) {
        this.sprite.x = x;
        this.sprite.y = y;
    }       
}
