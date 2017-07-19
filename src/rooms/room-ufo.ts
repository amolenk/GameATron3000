import { Room } from '../room'
import { SonicObject } from '../objects/object-sonic'

export class UfoRoom extends Room {

    private sonic: SonicObject;

    constructor() {
        super("ufo");
    }

    public enter(): void {

        this.sonic = new SonicObject();

        this.addRoomObject(this.sonic, 400, 300);
    }
}