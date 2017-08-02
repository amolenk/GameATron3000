import { Actor } from '../actor'

export class SonicActor extends Actor {

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