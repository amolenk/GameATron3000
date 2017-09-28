using System;
using GameATron3000.Bot.Engine;
using System.Drawing;

namespace GameATron3000.Bot.Gameplay
{
    [Serializable]
    public class BeachRoom : Room
    {
        protected override RoomDefinition GetRoomDefinition()
        {
            var roomDefinition = new RoomDefinition(
                "beach",
                "");

            // Mind the z-order
            roomDefinition.Add(Actors.Al, 500, 390);

            roomDefinition.Add(RoomObjects.Newspaper, 150, 380);

            return roomDefinition;
        }

        protected override void WireRoom(WireManager wireManager)
        {
            wireManager.LookAt(RoomObjects.Newspaper, _ => new[]
            {
                Actors.Al.WalkTo(170, 390),
                Actors.Al.Say("I can't read that...\nIt's not in Snork!!!")
            });
        }
    }
}