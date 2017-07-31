import { Action } from '../action'
import { Room } from '../room'
import { SonicObject } from '../objects/object-sonic'

export class UfoRoom extends Room {

    private sonic: SonicObject;

    constructor() {
        super("ufo");
    }

    public wireUp(): void {

        this.sonic = new SonicObject();

        this.addRoomObject(this.sonic, 440, 375);

        // Sonic

        this.wireAction(Action.LookAtVerb, this.sonic, () => {

            if (!this.sonic.isLookedAt) {
                this.narrator.say([
                    "It's Sonic the Hodgehog!",
                    "(No relation to the copyrighted Sonic the Hedgehog)" ]);

                this.sonic.isLookedAt = true; 
            } else {
                this.narrator.say([
                    "It's Sonic the Hodgehog!",
                    "What a swell guy! Showing up in a freeware game!" ]);
            }
        });

        this.wireAction(Action.PushVerb, this.sonic, () => {
            this.narrator.say(["No no no, you don't push Sonic. Sonic pushes you." ]);
        });
    }
}