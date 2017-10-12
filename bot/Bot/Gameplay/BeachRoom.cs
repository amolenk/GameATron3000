using System;
using GameATron3000.Bot.Engine;
using System.Drawing;
using System.Collections.Generic;

namespace GameATron3000.Bot.Gameplay
{
    [Serializable]
    public class BeachRoom : Room
    {
        protected override RoomDefinition GetRoomDefinition()
        {
            var roomDefinition = new RoomDefinition("beach", "");

            roomDefinition.Add(Actors.Guy, 490, 420);

            roomDefinition.Add(RoomObjects.TractorBeam, 490, 225);

            return roomDefinition;
        }

        protected override IEnumerable<IAction> OnEnterRoom()
        {
            yield return Delay(TimeSpan.FromSeconds(1.5));
            yield return RemoveRoomObject(RoomObjects.TractorBeam);
            yield return Delay(TimeSpan.FromSeconds(1));
            yield return Actors.Guy.Say("That's just great!\nI hope there's a supermarket around here...");
            yield return Delay(TimeSpan.FromSeconds(1));
            yield return Actors.Guy.WalkTo(850, 430);
        }

        protected override void WireRoom(WireManager wireManager)
        {
        }
    }
}