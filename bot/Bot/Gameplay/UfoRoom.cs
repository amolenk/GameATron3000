using System;
using GameATron3000.Bot.Engine;
using System.Drawing;
using System.Collections.Generic;

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
            roomDefinition.Add(Actors.Al, 440, 370);
            roomDefinition.Add(Actors.Ian, 530, 390);
            roomDefinition.Add(Actors.Guy, 150, 400);

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

            wireManager.LookAt(RoomObjects.EmptyFridge, _ => new[]
            {
                Actors.Guy.WalkTo(_fridgePosition.X, 400),
                Actors.Guy.TurnAway(),
                Actors.Guy.Say("It's empty!"),
                Actors.Guy.TurnFront(),
                Actors.Guy.Say("I wonder where these guys do their shopping!")
            });

            wireManager.LookAt(RoomObjects.FullFridge, _ => new[]
            {
                Actors.Guy.WalkTo(_fridgePosition.X, 400),
                Actors.Guy.TurnAway(),
                Actors.Guy.Say("All my groceries are now in the fridge!"),
                Actors.Guy.TurnFront()
            });

            wireManager.LookAt(RoomObjects.TodoList, (gameState) =>
            {
                if (!gameState.Contains("listSwitched"))
                {
                    return new[]
                    {
                        Actors.Guy.WalkTo(_todoListPosition.X, 420),
                        Actors.Guy.TurnAway(),
                        Actors.Guy.Say("It's a list with names.\nThe title says: 'Body-snatch list'."),
                        Delay(TimeSpan.FromSeconds(1)),
                        Actors.Guy.TurnFront(),
                        Actors.Guy.Say("YIKES, this can't be good!!"),
                        Actors.Guy.WalkTo(_todoListPosition.X - 30, 420),
                    };
                }
                else
                {
                    return new[]
                    {
                        Actors.Guy.Say("It's the body-snatch list i've replaced with my grocery list!")
                    };
                }
            });

            wireManager.LookAt(RoomObjects.GroceryList, _ => new[]
            {
                Actors.Guy.Say("It's my grocery list!")
            });

            wireManager.LookAt(RoomObjects.Groceries, _ => new[]
            {
                Actors.Guy.Say("It's my bag full of vegan, non-fat, organic groceries!")
            });

            wireManager.LookAt(RoomObjects.Newspaper, _ => new[]
            {
                Actors.Guy.Say("It's the newspaper I picked up in the park!")
            });

            wireManager.LookAt(Actors.Al, _ => new[]
            {
                Actors.Guy.Say("It's an alien looking fellow!")
            });

            wireManager.LookAt(Actors.Ian, _ => new[]
            {
                Actors.Guy.Say("It's an alien looking fellow!\nHe looks a bit more important than the other one!"),
                Actors.Al.Say("Hey!"),
            });

            wireManager.LookAt(Actors.Guy, _ => new[]
            {
                Actors.Narrator.Say("It's Guy Scotthrie, our fearless hero!")
            });

            wireManager.TalkTo(Actors.Al, _ => new[]
            {
                Actors.Guy.WalkTo(430, 420),
                Actors.Al.StartConversation("meet-al", true)
            });

            wireManager.Open(RoomObjects.ClosedFridge, (gameState) =>
            {
                gameState.SetValue("fridgeOpened", true);

                return new[]
                {
                    Actors.Guy.WalkTo(_fridgePosition.X, 400),
                    Actors.Guy.TurnAway(),
                    Delay(TimeSpan.FromSeconds(1)),
                    AddRoomObject(
                        gameState.Contains("fridgeFull") ? RoomObjects.FullFridge : RoomObjects.EmptyFridge,
                        _fridgePosition.X, _fridgePosition.Y),
                    Delay(TimeSpan.FromSeconds(0.5)),
                    Actors.Guy.TurnFront()
                };
            });

            wireManager.Open(Actors.Ian, (gameState) =>
            {
                gameState.SetValue("talkedAboutList", true);
                return new IAction[0];
            });

            wireManager.PickUp(RoomObjects.TodoList, (gameState) =>
            {
                if (!gameState.Contains("listSwitched"))
                {
                    return new[]
                    {
                        Actors.Guy.WalkTo(_todoListPosition.X, 400),
                        Actors.Guy.TurnAway(),
                        Delay(TimeSpan.FromSeconds(1)),
                        RemoveRoomObject(RoomObjects.TodoList),
                        Actors.Guy.TurnFront(),
                        Actors.Guy.Say("Got it!"),
                        Actors.Ian.Say("Hey, put that back!"),
                        Actors.Al.Say("We need that to finish the mission!"),
                        Actors.Guy.TurnAway(),
                        Delay(TimeSpan.FromSeconds(0.5)),
                        AddRoomObject(RoomObjects.TodoList, _todoListPosition.X, _todoListPosition.Y),
                        Actors.Guy.TurnFront(),
                        Actors.Guy.Say("I guess I have to think of something sneakier!"),
                        Actors.Guy.WalkTo(_todoListPosition.X - 30, 420),
                    };
                }

                return new IAction[0];
            });


            wireManager.Close(RoomObjects.EmptyFridge, (gameState) =>
            {
                gameState.RemoveValue("fridgeOpened");

                return new[]
                {
                    Actors.Guy.WalkTo(_fridgePosition.X, 400),
                    Actors.Guy.TurnAway(),
                    Delay(TimeSpan.FromSeconds(1)),
                    RemoveRoomObject(RoomObjects.EmptyFridge),
                    Delay(TimeSpan.FromSeconds(0.5)),
                    Actors.Guy.TurnFront()
                };
            });

            wireManager.Close(RoomObjects.FullFridge, (gameState) =>
            {
                gameState.RemoveValue("fridgeOpened");

                return new[]
                {
                    Actors.Guy.WalkTo(_fridgePosition.X, 400),
                    Actors.Guy.TurnAway(),
                    Delay(TimeSpan.FromSeconds(1)),
                    RemoveRoomObject(RoomObjects.FullFridge),
                    Delay(TimeSpan.FromSeconds(0.5)),
                    Actors.Guy.TurnFront()
                };
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
                if (gameState.Contains("listSwitched"))
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
                    gameState.SetValue("listSwitched", true);

                    return new[]
                    {
                        Actors.Guy.WalkTo(635, 400),
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
                if (gameState.Contains("listSwitched"))
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

            wireManager.Use(RoomObjects.GroceryList, RoomObjects.Groceries, (gameState) =>
            {
                return Actors.Guy.Say("Yep, I've got everything on the list!");
            });

            wireManager.Use(RoomObjects.Groceries, RoomObjects.GroceryList, (gameState) =>
            {
                return Actors.Guy.Say("Yep, I've got everything on the list!");
            });

            wireManager.TalkTo(Actors.Ian, (gameState) =>
            {
                if (gameState.Contains("talkedAboutList"))
                {
                    var actions = new List<IAction>
                    {
                        Actors.Guy.WalkTo(490, 420),
                        Actors.Guy.TurnAway(),
                        Actors.Guy.Say("Shouldn't you check the list?"),
                        Actors.Guy.TurnFront(),
                        Actors.Ian.WalkTo(650, 420),
                        Actors.Ian.TurnAway()
                    };

                    if (!gameState.Contains("listSwitched"))
                    {
                        actions.Add(Actors.Ian.Say("Hmm, we still need to find this Hans Scottleman guy..."));
                        actions.Add(Actors.Ian.TurnFront());
                        actions.Add(Actors.Ian.WalkTo(530, 390));
                    }
                    else
                    {
                        actions.Add(Actors.Ian.Say("Hmm, looks like the mission parameters have changed!\nWe need to collect earthly food products!"));
                        actions.Add(Actors.Ian.TurnFront());
                        actions.Add(Actors.Ian.WalkTo(185, 400));
                        actions.Add(Actors.Ian.TurnAway());

                        if (!gameState.Contains("fridgeOpened"))
                        {
                            actions.Add(AddRoomObject(
                                gameState.Contains("fridgeFull") ? RoomObjects.FullFridge : RoomObjects.EmptyFridge,
                                _fridgePosition.X, _fridgePosition.Y));
                        }
                        else
                        {
                            actions.Add(Actors.Ian.Say("Damnit Al, you left the fridge open again!"));
                            actions.Add(Actors.Al.Say("It wasn't me!"));
                        }

                        if (gameState.Contains("fridgeFull"))
                        {
                            actions.Add(Actors.Ian.Say("Excellent, looks like we're all set!"));
                            actions.Add(Actors.Ian.TurnFront());
                            actions.Add(Actors.Ian.Say("Ehm...\nWhy is that red shirt guy still in my spaceship?"));
                            actions.Add(Delay(TimeSpan.FromSeconds(2)));
                            actions.Add(NextRoom(new BeachRoom()));
                        }
                        else
                        {
                            actions.Add(Actors.Ian.Say("Hmmmm\nWe're not quite there yet!"));
                            actions.Add(RemoveRoomObject(gameState.Contains("fridgeFull") ? RoomObjects.FullFridge : RoomObjects.EmptyFridge));
                            actions.Add(Actors.Ian.TurnFront());
                            actions.Add(Actors.Ian.WalkTo(530, 390));

                            gameState.RemoveValue("fridgeOpened");
                        }
                    }

                    return actions;
                }
                else
                {
                    return new[]
                    {
                        Actors.Ian.Say("Go away, can't you see I'm busy?")
                    };
                }
            });
        }
    }
}