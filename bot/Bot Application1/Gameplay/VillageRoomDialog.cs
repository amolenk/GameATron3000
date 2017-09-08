using System;

namespace Bot_Application1.Dialogs
{
    [Serializable]
    public class VillageRoomDialog : RoomDialog
    {
        public VillageRoomDialog()
            : base("village")
        {
        }

        protected override string IntroductionText => "You are standing in a remote village."
            + "\nThere's a sonic action figure lying on the ground.";

        protected override void PopulateRoom(RoomManager roomManager)
        {
            roomManager.Add(Actors.Guybrush, -50, 430);

            roomManager.Add(RoomObjects.SonicActionFigure, 450, 400);
        }

        protected override void WireRoom(WireManager wireManager)
        {
            //this.wireAction(Action.TalkToVerb, Actors.Guybrush, () =>
            //    this.startConversation("sonicTopic", Actors.Guybrush));

            wireManager.LookAt(RoomObjects.SonicActionFigure, () =>
            {
                //if (Objects.Sonic.getState("pickedUp"))
                //{
                //    this.narrator.say("It's Guybrush's mint condition Sonic the Hedgehog action figure!"
                //        + "\nHe should really find a better place to hide his treasure.");
                //}
                //else
                //{
                return Actors.Narrator.Say("It's a blue plastic hedgehog.");
             });

            wireManager.PickUp(RoomObjects.SonicActionFigure, () =>
            {
                //if (!Objects.Sonic.getState("pickedUp"))
                //{
                return new[]
                {
                    Actors.Narrator.Say("Nice! It's a Sonic the Hedgehog action figure!\nOooh! Collector's edition!"),
                    //Player.AddToInventory(RoomObjects.SonicActionFigure),
                    // Set object state to pickedUp
                    Actors.Guybrush.WalkTo(150, 430),
                    Actors.Guybrush.Say("Hey!\nWhere did my Sonic action figure go?")
                };
                //else
                //{
                //    return this.remove(Objects.Sonic)
                //    .then(() => this.addToInventory(InventoryItems.Sonic))
                //    .then(() => Actors.Guybrush.walkTo(85, 430))
                //    .then(() => Actors.Guybrush.say("Not again!"))
                //    .then(() => Actors.Guybrush.walkTo(150, 430))
                //    .then(() => Actors.Guybrush.say("There are too many pirates on this island!"));
                //}
            });

            //this.wireAction(Action.LookAtVerb, InventoryItems.Sonic, () =>
            //    this.narrator.say("It's a mint condition Sonic the Hedgehog action figure!"));

            //this.wireComplexAction(Action.GiveVerb, InventoryItems.Sonic, Actors.Guybrush, () =>
            //    this.removeFromInventory(InventoryItems.Sonic)
            //    .then(() => Actors.Guybrush.say("Thanks!\nNow I can sell this on BootyBay™!"))
            //    .then(() => Actors.Guybrush.walkTo(450, 400))
            //    .then(() => this.add(Objects.Sonic, 450, 400))
            //    .then(() => Actors.Guybrush.say("I'll leave it here for now for safekeeping."))
            //    .then(() => Actors.Guybrush.walkTo(-150, 400)));
        }
    }
}