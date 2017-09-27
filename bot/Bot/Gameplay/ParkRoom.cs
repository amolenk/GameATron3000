using System;
using System.Collections.Generic;
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

            // Let's keep our hero offscreen for now.
            roomDefinition.Add(Actors.Guy, -50, 430);

            roomDefinition.Add(RoomObjects.Newspaper, 450, 400);

            return roomDefinition;
        }

        protected override void WireRoom(WireManager wireManager)
        {
            // Full Shopping Gag

            wireManager.LookAt(RoomObjects.FullShoppingBag, _ =>
                Actors.Guy.Say("It's my shopping bag with groceries.\nI managed to get some nice discounts!")
            );


            wireManager.LookAt(RoomObjects.Newspaper, (gameState) =>
            {
                if (gameState.ContainsInventoryItem(RoomObjects.Newspaper))
                {
                    return new[]
                    {
                        Actors.Guy.Say("It's the newspaper I just picked up!")
                    };
                }
                else
                {
                    return new[]
                    {
                        Actors.Guy.WalkTo(400, 400),
                        Actors.Guy.Say("It's yesterday's newspaper.")
                    };
                }
            });

            wireManager.TalkTo(Actors.Guy, _ => Actors.Guy.StartConversation("graph"));

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
                        Actors.Guy.Say("Got it!")
                    };
                }
            });
        }
    }
}