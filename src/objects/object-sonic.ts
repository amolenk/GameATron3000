import { RoomObject } from '../room-object'

export class SonicObject extends RoomObject {

    private _isLookedAt: boolean = false;

    constructor() {
        super("sonic");
    }

    get DisplayName() : string {
        return this.isLookedAt ? "non-copyright infringing Sonic" : "Sonic";
    }

    get isLookedAt(): boolean {
        return this._isLookedAt;
    }

    set isLookedAt(value: boolean) {
        this._isLookedAt = value;
    }
}