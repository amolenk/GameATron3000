using System;
using GameATron3000.Bot.Engine;
using System.Drawing;

namespace GameATron3000.Bot.Gameplay
{
    [Serializable]
    public class UfoRoom : Room
    {
        private static readonly Point _refigeratorPosition = new Point(450, 400);
        private static readonly Point _snatchlistPosition = new Point(750, 400);

        protected override RoomDefinition GetRoomDefinition()
        {
            var roomDefinition = new RoomDefinition(
                "ufo",
                "You are inside a brightly lit space.\nYou have no way of identifying what kind of object you're in, but it feels like you're flying!\nLet's just call it an Unidentified Flying Object.");

            roomDefinition.Add(Actors.Al, 100, 430);

            roomDefinition.Add(RoomObjects.SnatchList, _refigeratorPosition.X, _refigeratorPosition.Y);
            roomDefinition.Add(RoomObjects.Refrigerator, _snatchlistPosition.X, _snatchlistPosition.Y);

            return roomDefinition;
        }

        protected override void WireRoom(WireManager wireManager)
        {
            wireManager.LookAt(RoomObjects.Refrigerator, _ => new[]
            {
                Actors.Guy.WalkTo(_refigeratorPosition.X, _refigeratorPosition.Y),
                Actors.Guy.Say("It's a big fridge!\nThe badge on the side reads 'Brrrr-a-tron 9000(TM)'.\n Never heard of it!")
            });
        }
    }
}