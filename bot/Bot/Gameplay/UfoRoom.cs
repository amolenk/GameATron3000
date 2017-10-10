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
        private static readonly Point _groceryListPosition = new Point(655, 295);

        protected override RoomDefinition GetRoomDefinition()
        {
            var roomDefinition = new RoomDefinition(
                "ufo",
                "You are inside a brightly lit space.\nYou have no way of identifying what kind of object you're in, but it feels like you're flying!\nLet's just call it an Unidentified Flying Object.");

            // Mind the z-order
            roomDefinition.Add(Actors.Al, 460, 390);
            roomDefinition.Add(Actors.Ian, 530, 390);
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
                Actors.Guy.Say("It's a big fridge!\nThe badge on the side reads 'Brrrr-a-tron 9000™'."),
                Actors.Guy.TurnFront(),
                Actors.Guy.Say("Never heard of it!"),
                Actors.Al.Say("It's top of the line!")
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
                Actors.Guy.WalkTo(430, 420),
                Actors.Al.StartConversation("meet-al", true)
            });

            // open fridge
            wireManager.Open(RoomObjects.ClosedFridge, (gameState) => new[]
            {
                Actors.Guy.WalkTo(_fridgePosition.X, 400),
                Actors.Guy.TurnAway(),
                Delay(TimeSpan.FromSeconds(1)),
                AddRoomObject(
                    gameState.Contains("fridgeFull") ? RoomObjects.FullFridge : RoomObjects.EmptyFridge,
                    _fridgePosition.X, _fridgePosition.Y),
                Delay(TimeSpan.FromSeconds(0.5)),
                Actors.Guy.TurnFront()
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

            wireManager.Use(RoomObjects.Groceries, RoomObjects.EmptyFridge, (gameState) =>
            {
                gameState.SetValue("fridgeFull", true);

                return new[]
                {
                    Actors.Guy.WalkTo(_fridgePosition.X, 400),
                    Actors.Guy.TurnAway(),
                    Delay(TimeSpan.FromSeconds(1)),
                    Player.RemoveFromInventory(RoomObjects.Groceries),
                    AddRoomObject(RoomObjects.FullFridge, _fridgePosition.X, _fridgePosition.Y),
                    RemoveRoomObject(RoomObjects.EmptyFridge),
                    Delay(TimeSpan.FromSeconds(1)),
                    Actors.Guy.TurnFront()
                };
            });

            wireManager.Use(RoomObjects.GroceryList, RoomObjects.TodoList, (gameState) =>
            {
                if (gameState.Contains("listSwitch"))
                {
                    return new[]
                    {
                        Actors.Guy.WalkTo(_todoListPosition.X, 400),
                        Actors.Guy.TurnAway(),
                        Delay(TimeSpan.FromSeconds(1)),
                        Actors.Guy.TurnFront(),
                        Actors.Guy.Say("I already did that.\nLet's not undo the magic!")
                    };
                }
                else
                {
                    gameState.SetValue("listSwitch", true);

                    return new[]
                    {
                        Actors.Guy.WalkTo(_todoListPosition.X, 400),
                        Actors.Guy.TurnAway(),
                        Delay(TimeSpan.FromSeconds(1)),
                        Player.RemoveFromInventory(RoomObjects.GroceryList),
                        AddRoomObject(RoomObjects.GroceryList, _groceryListPosition.X, _groceryListPosition.Y),
                        RemoveRoomObject(RoomObjects.TodoList),
                        Player.AddToInventory(RoomObjects.TodoList),
                        Delay(TimeSpan.FromSeconds(1)),
                        Actors.Guy.TurnFront(),
                        Actors.Guy.Say("That should do the trick!")
                    };
                }
            });

            wireManager.Use(RoomObjects.TodoList, RoomObjects.GroceryList, (gameState) =>
            {
                if (gameState.Contains("listSwitch"))
                {
                    return new[]
                    {
                        Actors.Guy.WalkTo(_todoListPosition.X, 400),
                        Actors.Guy.TurnAway(),
                        Delay(TimeSpan.FromSeconds(1)),
                        Actors.Guy.TurnFront(),
                        Actors.Guy.Say("Hmmm, there was I reason I switched these lists.\nI'll just keep it this way.")
                    };
                }
                else
                {
                    return new[]
                    {
                        Actors.Guy.WalkTo(_todoListPosition.X, 400),
                        Actors.Guy.TurnAway(),
                        Delay(TimeSpan.FromSeconds(1)),
                        Actors.Guy.TurnFront(),
                        Actors.Guy.Say("I should probably do it the other way around.")
                    };
                }
            });
        }
    }
}