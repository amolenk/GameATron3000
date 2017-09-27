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
                "You are standing in a park.\nThere's a newspaper on the ground.");

            roomDefinition.Add(Actors.Guy, 100, 430);

            roomDefinition.Add(RoomObjects.Newspaper, 450, 400);

            return roomDefinition;
        }

        protected override void WireRoom(WireManager wireManager)
        {
            wireManager.LookAt(RoomObjects.Newspaper, _ =>
            {
                return Actors.Narrator.Say("It's yesterday's newspaper.");
            });

            wireManager.TalkTo(Actors.Guy, _ => StartConversation("graph"));

            wireManager.PickUp(RoomObjects.Newspaper, (gameState) =>
            {
                if (gameState.ContainsInventoryItem(RoomObjects.Newspaper))
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
                        Player.AddToInventory(RoomObjects.Newspaper),
                        Actors.Guy.Say("Foo"),
                        Actors.Guy.WalkTo(250, 500)
                    };
                }
            });
        }
    }
}