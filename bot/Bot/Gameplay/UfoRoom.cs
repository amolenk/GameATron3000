using System;
using GameATron3000.Bot.Engine;
using System.Drawing;

namespace GameATron3000.Bot.Gameplay
{
    [Serializable]
    public class UfoRoom : Room
    {
        private static readonly Point _refigeratorPosition = new Point(200, 200);
        private static readonly Point _snatchlistPosition = new Point(640, 275);

        protected override RoomDefinition GetRoomDefinition()
        {
            var roomDefinition = new RoomDefinition(
                "ufo",
                "You are inside a brightly lit space.\nYou have no way of identifying what kind of object you're in, but it feels like you're flying!\nLet's just call it an Unidentified Flying Object.");

            roomDefinition.Add(Actors.Guy, 100, 400);

            roomDefinition.Add(Actors.Al, 500, 390);
            roomDefinition.Add(Actors.Ian, 600, 395);

            roomDefinition.Add(RoomObjects.SnatchList, _refigeratorPosition.X, _refigeratorPosition.Y);
            roomDefinition.Add(RoomObjects.Refrigerator, _snatchlistPosition.X, _snatchlistPosition.Y);

            return roomDefinition;
        }

        protected override void WireRoom(WireManager wireManager)
        {
            wireManager.LookAt(RoomObjects.Refrigerator, _ => new[]
            {
                Actors.Guy.WalkTo(_refigeratorPosition.X, 400),
                Actors.Guy.Say("It's a big fridge!\nThe badge on the side reads 'Brrrr-a-tron 9000(TM)'.\n Never heard of it!")
            });

            wireManager.LookAt(RoomObjects.SnatchList, _ => new[]
            {
                Actors.Guy.WalkTo(_snatchlistPosition.X, 400),
                Actors.Guy.Say("It's a list with names.\nThe title says: 'Body-snatch list'."),
                Delay(TimeSpan.FromSeconds(1)),
                Actors.Guy.Say("YIKES, this can't be good!!\n")
            });

            wireManager.TalkTo(Actors.Al, _ => Actors.Al.StartConversation("meet-al"));

            wireManager.TalkTo(Actors.Ian, _ => Actors.Al.StartConversation("meet-ian"));

            // open fridge
            wireManager.Open(RoomObjects.Refrigerator, _ => new[]
            {
                RemoveRoomObject(RoomObjects.Refrigerator),
                AddRoomObject(RoomObjects.RefrigeratorOpenEmpty, _refigeratorPosition.X, _refigeratorPosition.Y)
            });

            // close open fridge
            wireManager.Open(RoomObjects.RefrigeratorOpenEmpty, _ => new[]
{
                RemoveRoomObject(RoomObjects.RefrigeratorOpenEmpty),
                AddRoomObject(RoomObjects.Refrigerator, _refigeratorPosition.X, _refigeratorPosition.Y)
            });
        }
    }
}