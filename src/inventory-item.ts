import { RoomObject } from "./room-object"
import { UIMediator } from "./ui-mediator"

export class InventoryItem extends RoomObject {

    public init(game: Phaser.Game, uiMediator: UIMediator, x: number, y: number) {

        super.init(game, uiMediator, x, y);

        this.sprite.anchor.set(0);

        // Keep cursor on top.
        this.sprite.sendToBack();
    }
}
