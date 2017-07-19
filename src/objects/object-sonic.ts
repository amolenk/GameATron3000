import { RoomObject } from '../room-object'

export class SonicObject extends RoomObject {

    constructor() {
        super("sonic");
    }

    get DisplayName() : string {
        return "Sonic the Hedgehog";
    }
}