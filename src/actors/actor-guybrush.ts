import { Actor } from '../actor'

export class GuybrushActor extends Actor {

    constructor() {
        super("guybrush");
    }

    get DisplayName() : string {
        return 'mighty pirate';
    }
}