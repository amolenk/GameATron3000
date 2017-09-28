using System;
using GameATron3000.Bot.Engine;
using System.Drawing;

namespace GameATron3000.Bot.Gameplay
{
    [Serializable]
    public class UfoRoom : Room
    {
        private static readonly Point _fridgePosition = new Point(185, 242);
        private static readonly Point _todoListPosition = new Point(650, 300);

        protected override RoomDefinition GetRoomDefinition()
        {
            var roomDefinition = new RoomDefinition(
                "ufo",
                "You are inside a brightly lit space.\nYou have no way of identifying what kind of object you're in, but it feels like you're flying!\nLet's just call it an Unidentified Flying Object.");

            // Mind the z-order
            roomDefinition.Add(Actors.Al, 500, 390);
            roomDefinition.Add(Actors.Guy, 100, 400);

            roomDefinition.Add(RoomObjects.TodoList, _todoListPosition.X, _todoListPosition.Y);
            roomDefinition.Add(RoomObjects.ClosedFridge, _fridgePosition.X, _fridgePosition.Y);

            return roomDefinition;
        }

        protected override void WireRoom(WireManager wireManager)
        {
            wireManager.LookAt(RoomObjects.ClosedFridge, _ => new[]
            {
                Actors.Guy.WalkTo(_fridgePosition.X, 400),
                Actors.Guy.TurnAway(),
                Actors.Guy.Say("It's a big fridge!\nThe badge on the side reads 'Brrrr-a-tron 9000(TM)'."),
                Actors.Guy.TurnFront(),
                Actors.Guy.Say("Never heard of it!")
            });

            wireManager.LookAt(RoomObjects.TodoList, _ => new[]
            {
                Actors.Guy.WalkTo(_todoListPosition.X, 420),
                Actors.Guy.TurnAway(),
                Actors.Guy.Say("It's a list with names.\nThe title says: 'Body-snatch list'."),
                Delay(TimeSpan.FromSeconds(1)),
                Actors.Guy.TurnFront(),
                Actors.Guy.Say("YIKES, this can't be good!!")
            });

            wireManager.TalkTo(Actors.Al, _ => new[]
            {
                Actors.Guy.WalkTo(400, 420),
                Actors.Al.StartConversation("meet-al")
            });

            // open fridge
            wireManager.Open(RoomObjects.ClosedFridge, (gameState) =>
            {
                if (gameState.Contains("fridgeFull"))
                {
                    return new[]
                    {
                        Actors.Guy.WalkTo(_fridgePosition.X, 400),
                        Actors.Guy.TurnAway(),
                        Delay(TimeSpan.FromSeconds(1)),
                        AddRoomObject(RoomObjects.EmptyFridge, _fridgePosition.X, _fridgePosition.Y),
                        Delay(TimeSpan.FromSeconds(0.5)),
                        Actors.Guy.Say("WTF?!\nWhere are my organic, vegan, gluten-free, non-fat groceries?"),
                        Actors.Guy.TurnFront(),
                        Actors.Guy.Say("This must be a bug!\nI don't think this game is finished at all!!"),
                        Actors.Al.Say("Yep, I don't have anything to do as well...\nHope they get this fixed before TechDays!")
                    };
                }
                else
                {
                    return new[]
                    {
                        Actors.Guy.WalkTo(_fridgePosition.X, 400),
                        Actors.Guy.TurnAway(),
                        Delay(TimeSpan.FromSeconds(1)),
                        AddRoomObject(RoomObjects.EmptyFridge, _fridgePosition.X, _fridgePosition.Y),
                        Delay(TimeSpan.FromSeconds(0.5)),
                        Actors.Guy.TurnFront()
                    };
                }
            });

            // close empty fridge
            wireManager.Close(RoomObjects.EmptyFridge, _ => new[]
            {
                Actors.Guy.WalkTo(_fridgePosition.X, 400),
                Actors.Guy.TurnAway(),
                Delay(TimeSpan.FromSeconds(1)),
                RemoveRoomObject(RoomObjects.EmptyFridge),
                Delay(TimeSpan.FromSeconds(0.5)),
                Actors.Guy.TurnFront()
            });

            // close full fridge
            wireManager.Close(RoomObjects.FullFridge, _ => new[]
            {
                Actors.Guy.WalkTo(_fridgePosition.X, 400),
                Actors.Guy.TurnAway(),
                Delay(TimeSpan.FromSeconds(1)),
                RemoveRoomObject(RoomObjects.FullFridge),
                Delay(TimeSpan.FromSeconds(0.5)),
                Actors.Guy.TurnFront()
            });

            wireManager.Use(RoomObjects.FullShoppingBag, RoomObjects.EmptyFridge, (gameState) =>
            {
                gameState.SetValue("fridgeFull", true);

                return new[]
                {
                    Actors.Guy.WalkTo(_fridgePosition.X, 400),
                    Actors.Guy.TurnAway(),
                    Delay(TimeSpan.FromSeconds(1)),
                    AddRoomObject(RoomObjects.FullFridge, _fridgePosition.X, _fridgePosition.Y),
                    RemoveRoomObject(RoomObjects.EmptyFridge),
                    Delay(TimeSpan.FromSeconds(1)),
                    Actors.Guy.TurnFront()
                };
            });
        }
    }
}