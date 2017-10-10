using System;
using GameATron3000.Bot.Engine;

namespace GameATron3000.Bot.Gameplay
{
    [Serializable]
    public class ParkRoom : Room
    {
        protected override RoomDefinition GetRoomDefinition()
        {
            var roomDefinition = new RoomDefinition(
                "park",
                "You've just done your grocery shopping and decided to take a detour through the park.\nIt's a nice day!");

            roomDefinition.Add(Actors.Guy, 600, 430);

            roomDefinition.Add(RoomObjects.Newspaper, 362, 400);
            Player.AddToInventory(RoomObjects.GroceryList);

            return roomDefinition;
        }

        protected override void WireRoom(WireManager wireManager)
        {
            wireManager.LookAt(RoomObjects.Groceries, _ =>
                Actors.Guy.Say("It's my shopping bag with groceries.\nI managed to get some nice discounts!")
            );

            wireManager.PickUp(RoomObjects.Newspaper, (gameState) =>
            {
                if (!gameState.ContainsInventoryItem(RoomObjects.Newspaper))
                {
                    return new []
                    {
                        Actors.Guy.WalkTo(360, 430),
                        Player.AddToInventory(RoomObjects.Newspaper),
                        Actors.Guy.Say("It's yesterday's newspaper!"),
                        ShowCloseUp(RoomObjects.Newspaper, new []
                        {
                            Delay(TimeSpan.FromSeconds(4)),
                            Actors.Narrator.Say("Hmm, there seems to be a LOT of UFO sightings lately!"),
                            Delay(TimeSpan.FromSeconds(0.5)),
                        }),
                        Actors.Guy.Say("They must have let the crazy people out again!"),
                        Delay(TimeSpan.FromSeconds(1)),
                        AddRoomObject(RoomObjects.TractorBeam, 360, 225, true),
                        Delay(TimeSpan.FromSeconds(1)),
                        Actors.Guy.Say("Uh oh...")
                    };
                }
                else
                {
                    return new []
                    {
                        Actors.Guy.Say("I've already picked that up!")
                    };
                }
            });
        }
    }
}