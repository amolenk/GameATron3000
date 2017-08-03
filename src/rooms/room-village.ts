import { Action } from '../action'
import { Room } from '../room'
import { GuybrushActor } from '../actors/actor-guybrush'

export class VillageRoom extends Room {

    private guybrush: GuybrushActor;

    constructor() {
        super("village");
    }

    public wireUp(): void {

        this.guybrush = new GuybrushActor();

        // Let's keep Guybrush off-screen for now.
        // TODO Expose width property.
        this.addObject(this.guybrush, 300, 430);

        

        this.wireAction(Action.TalkToVerb, this.guybrush, async () => {
            await this.guybrush.say('I\'m Guybrush Threepwood, mighty pirate!');
        });

        this.wireAction(Action.LookAtVerb, this.guybrush, async () => {
            await this.narrator.say('It seems to be some kind of fisherman.');
        });
    }

    public async enter() {

        //this.narrator.say('Welcome to the Game-a-tron 3000TM engine!');

        /*
        await this.guybrush.walk(500)
            .then(() => this.guybrush.say('Hallo, Lisa!'))
            .then(() => this.guybrush.walk(300));
            */
    }
}