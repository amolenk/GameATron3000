import { Action } from "../action"
import { Room } from "../room"

import { Actors } from "./actors"
import { InventoryItems } from "./inventory-items"
import { Objects } from "./objects"

export class VillageRoom extends Room {

    constructor() {
        super("village");
    }

    public async wireUp() {

        await this.add(Objects.Sonic, 450, 400);

        // Let's keep Guybrush off-screen for now.
        await this.add(Actors.Guybrush, -150, 430);

        // this.wireAction(Action.TalkToVerb, Actors.Guybrush, () =>
        //     this.startConversation("sonicTopic", Actors.Guybrush));

        this.wireAction(Action.LookAtVerb, Objects.Sonic, () =>
        {
            if (Objects.Sonic.getState("pickedUp")) {
                this.narrator.say("It's Guybrush's mint condition Sonic the Hedgehog action figure!"
                    + "\nHe should really find a better place to hide his treasure.");
            } else {
                this.narrator.say("It's a blue plastic hedgehog.");
            }
        });

        this.wireAction(Action.PickUpVerb, Objects.Sonic, () => {
            if (!Objects.Sonic.getState("pickedUp")) {
                return this.narrator.say("Nice! It's a Sonic the Hedgehog action figure!")
                .then(() => this.remove(Objects.Sonic))
                .then(() => Objects.Sonic.setState("pickedUp", true))
                .then(() => Objects.Sonic.displayName = "Sonic the Hedgehog action figure")
//                .then(() => this.addToInventory(InventoryItems.Sonic))
                .then(() => this.narrator.say("Oooh! Collector's edition!"))
                .then(() => Actors.Guybrush.walkTo(150, 430))
                .then(() => Actors.Guybrush.say("Hey!\nWhere did my Sonic action figure go?"));
            } else {
                return this.remove(Objects.Sonic)
//                .then(() => this.addToInventory(InventoryItems.Sonic))
                .then(() => Actors.Guybrush.walkTo(85, 430))
                .then(() => Actors.Guybrush.say("Not again!"))                
                .then(() => Actors.Guybrush.walkTo(150, 430))
                .then(() => Actors.Guybrush.say("There are too many pirates on this island!"));                
            }
        });

        this.wireAction(Action.LookAtVerb, InventoryItems.Sonic, () =>
            this.narrator.say("It's a mint condition Sonic the Hedgehog action figure!"));

//         this.wireComplexAction(Action.GiveVerb, InventoryItems.Sonic, Actors.Guybrush, () =>
// //            this.removeFromInventory(InventoryItems.Sonic)
//             .then(() => Actors.Guybrush.say("Thanks!\nNow I can sell this on BootyBay™!"))
//             .then(() => Actors.Guybrush.walkTo(450, 400))
//             .then(() => this.add(Objects.Sonic, 450, 400))
//             .then(() => Actors.Guybrush.say("I'll leave it here for now for safekeeping."))
//             .then(() => Actors.Guybrush.walkTo(-150, 400)));
    }
}