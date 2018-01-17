using System;
using GameATron3000.Bot.Engine;

namespace GameATron3000.Bot.Gameplay
{
    [Serializable]
    public class ParkRoom : Room
    {
        protected override RoomDefinition GetRoomDefinition()
        {
            var roomDefinition = new RoomDefinition("park");

            roomDefinition.Add(Actors.Guy, 600, 430);

            roomDefinition.Add(RoomObjects.Newspaper, 362, 400);

            return roomDefinition;
        }

        protected override void WireRoom(WireManager wireManager)
        {
            wireManager.LookAt(RoomObjects.Groceries, _ =>
                Actors.Guy.Speak("It's my shopping bag with groceries.\nI managed to get some nice discounts!")
            );

            wireManager.LookAt(RoomObjects.GroceryList, _ =>
                Actors.Guy.Speak("It's my grocery list!\nI've bought everything that's on it!")
            );

            wireManager.LookAt(Actors.Guy, _ => new[]
            {
                Actors.Narrator.Speak("It's Guy Scotthrie, our fearless hero!")
            });

            wireManager.LookAt(RoomObjects.Newspaper, _ =>
                Actors.Guy.Speak("It looks like an old newspaper!")
            );

            wireManager.Use(RoomObjects.GroceryList, RoomObjects.Groceries, _ =>
                Actors.Guy.Speak("Yep, I've got everything on the list!")
            );

            wireManager.Use(RoomObjects.Groceries, RoomObjects.GroceryList, _ =>
                Actors.Guy.Speak("Yep, I've got everything on the list!")
            );

            wireManager.PickUp(RoomObjects.Newspaper, (gameState) =>
            {
                if (!gameState.ContainsInventoryItem(RoomObjects.Newspaper))
                {
                    return new []
                    {
                        Actors.Guy.WalkTo(360, 430),
                        Player.AddToInventory(RoomObjects.Newspaper),
                        Actors.Guy.Speak("It's yesterday's newspaper!"),
                        ShowCloseUp(RoomObjects.Newspaper, new []
                        {
                            Delay(TimeSpan.FromSeconds(4)),
                            Actors.Narrator.Speak("Hmm, there seems to be a LOT of UFO sightings lately!"),
                            Delay(TimeSpan.FromSeconds(0.5)),
                        }),
                        Actors.Guy.Speak("They must have let the crazy people out again!"),
                        Delay(TimeSpan.FromSeconds(1)),
                        AddRoomObject(RoomObjects.TractorBeam, 360, 225, true),
                        Delay(TimeSpan.FromSeconds(1)),
                        Actors.Guy.Speak("Uh oh..."),
                        Delay(TimeSpan.FromSeconds(3)),
                        NextRoom(new UfoRoom())
                    };
                }
                else
                {
                    return new []
                    {
                        Actors.Guy.Speak("I've already picked that up!")
                    };
                }
            });
        }
    }
}