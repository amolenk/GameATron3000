using System;

namespace Bot_Application1.Dialogs
{
    [Serializable]
    public class ParkRoom : Room
    {
        public ParkRoom()
            : base("park")
        {
        }

        protected override string IntroductionText => "You are standing in a park."
            + "\nThere's a newspaper on the ground.";

        protected override void PopulateRoom(RoomManager roomManager)
        {
            roomManager.Add(Actors.Guy, 100, 430);

            roomManager.Add(RoomObjects.Newspaper, 450, 400);
        }

        protected override void WireRoom(WireManager wireManager)
        {
            wireManager.LookAt(RoomObjects.Newspaper, (inventory) =>
            {
                return Actors.Narrator.Say("It's yesterday's newspaper.");
            });

            wireManager.TalkTo(Actors.Guy, _ => Actors.Guy.TalkTo("topic"));

            wireManager.PickUp(RoomObjects.Newspaper, (inventory) =>
            {
                if (inventory.Contains(RoomObjects.Newspaper))
                {
                    return new[]
                    {
                        Actors.Guy.Say("I've already got it!")
                    };
                }
                else
                {
                    return new[]
                    {
                        inventory.Add(RoomObjects.Newspaper),
                        Actors.Guy.Say("Foo"),
                        Actors.Guy.WalkTo(250, 500)
                    };
                }
            });
        }
    }
}