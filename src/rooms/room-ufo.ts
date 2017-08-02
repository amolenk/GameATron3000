import { Action } from '../action'
import { Room } from '../room'
import { SonicActor } from '../actors/actor-sonic'
import { SonicObject } from '../objects/object-sonic'

export class UfoRoom extends Room {

    private sonic: SonicActor;

    constructor() {
        super("ufo");
    }

    public wireUp(): void {

        this.sonic = new SonicActor();

        // Let's keep Sonic off-screen for now.
        // TODO Expose width property.
        this.addObject(this.sonic, -50, 430);

        // Sonic

        this.wireAction(Action.LookAtVerb, this.sonic, async () => {

            if (!this.sonic.isLookedAt) {
                await this.narrator.say('It\'s Sonic the Hodgehog!')
                    .then(() => this.narrator.say('(No relation to the copyrighted Sonic the Hedgehog)'));

                this.sonic.isLookedAt = true; 
            } else {
                await this.narrator.say('It\'s Sonic the Hodgehog!')
                    .then(() => this.narrator.say('What a swell guy! Showing up in a freeware game!'));
            }
        });

        this.wireAction(Action.PushVerb, this.sonic, async () => {
            await this.narrator.say('No no no, you don\'t push Sonic. Sonic pushes you.');
        });
    }

    public async enter() {

        await Promise.all([
                this.narrator.say('Come on out here, Sonic!'),
                this.sonic.walk(500, 10)
            ])
            .then(() => this.sonic.say('Hi! I\'m Sonic!'))
            .then(() => Promise.all([
                this.sonic.say('I\'m awesome!'),
                this.sonic.walk(400)
            ]));
    }
}