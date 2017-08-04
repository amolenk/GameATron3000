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
        this.addObject(this.guybrush, 150, 430);

        

        this.wireAction(Action.TalkToVerb, this.guybrush, async () => {
            await this.guybrush.say('Game-a-tron 3000 rules!');
        });

        this.wireAction(Action.PushVerb, this.guybrush, async () => {
            await this.guybrush.walkTo(450, 430);
        });

        this.wireAction(Action.LookAtVerb, this.guybrush, async () => {
            await this.narrator.say("It seems to be some kind of fisherman.")
                .then(() => this.guybrush.say("Hey!"))
                .then(() => this.guybrush.walkTo(300, 430))
                .then(() => this.guybrush.say("I'm a mighty PIRATE!"));
        });
    }

    public async enter() {

        //this.narrator.say('Welcome to the Game-a-tron 3000TM engine!');

        //await this.guybrush.walk(550);
//            .then(() => this.guybrush.walk(550))
//            .then(() => this.guybrush.say("Now I'm over here!"));
    }
}