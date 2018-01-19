using System;
using GameATron3000.Bot.Engine;
using System.Drawing;
using System.Collections.Generic;

namespace GameATron3000.Bot.Gameplay
{
    [Serializable]
    public class UfoRoom : Room
    {
        private static readonly Point AlPosition = new Point(440, 370);
        private static readonly Point IanPosition = new Point(530, 390);
        private static readonly Point FridgePosition = new Point(185, 242);
        private static readonly Point TodoListPosition = new Point(650, 300);
        private static readonly Point GroceryListPosition = new Point(655, 295);

        protected override RoomDefinition GetRoomDefinition()
        {
            var roomDefinition = new RoomDefinition("ufo");

            // Mind the z-order
            roomDefinition.Add(Actors.Al, AlPosition.X, AlPosition.Y);
            roomDefinition.Add(Actors.Ian, IanPosition.X, IanPosition.Y);
            roomDefinition.Add(Actors.Guy, 150, 400);

            roomDefinition.Add(RoomObjects.TodoList, TodoListPosition.X, TodoListPosition.Y);
            roomDefinition.Add(RoomObjects.ClosedFridge, FridgePosition.X, FridgePosition.Y);

            return roomDefinition;
        }

        protected override void WireRoom(WireManager wireManager)
        {
            wireManager.LookAt(RoomObjects.ClosedFridge, _ => new[]
            {
                Actors.Guy.WalkTo(FridgePosition.X, 400),
                Actors.Guy.FaceAway(),
                Actors.Guy.Speak("It's a big fridge!\nThe badge on the side reads 'Brrrr-a-tron 9000™'."),
                Actors.Guy.FaceFront(),
                Actors.Guy.Speak("Never heard of it!"),
                Actors.Al.Speak("It's top of the line!")
            });

            wireManager.LookAt(RoomObjects.EmptyFridge, _ => new[]
            {
                Actors.Guy.WalkTo(FridgePosition.X, 400),
                Actors.Guy.FaceAway(),
                Actors.Guy.Speak("It's empty!"),
                Actors.Guy.FaceFront(),
                Actors.Guy.Speak("I wonder where these guys do their shopping!")
            });

            wireManager.LookAt(RoomObjects.FullFridge, _ => new[]
            {
                Actors.Guy.WalkTo(FridgePosition.X, 400),
                Actors.Guy.FaceAway(),
                Actors.Guy.Speak("All my groceries are now in the fridge!"),
                Actors.Guy.FaceFront()
            });

            wireManager.LookAt(RoomObjects.TodoList, (gameState) =>
            {
                if (!gameState.Contains("listSwitched"))
                {
                    return new[]
                    {
                        Actors.Guy.WalkTo(TodoListPosition.X, 420),
                        Actors.Guy.FaceAway(),
                        Actors.Guy.Speak("It's a list with names.\nThe title says: 'Body-snatch list'."),
                        Delay(TimeSpan.FromSeconds(1)),
                        Actors.Guy.FaceFront(),
                        Actors.Guy.Speak("YIKES, this can't be good!!"),
                        Actors.Guy.WalkTo(TodoListPosition.X - 30, 420),
                    };
                }
                else
                {
                    return new[]
                    {
                        Actors.Guy.Speak("It's the body-snatch list i've replaced with my grocery list!")
                    };
                }
            });

            wireManager.LookAt(RoomObjects.GroceryList, _ => new[]
            {
                Actors.Guy.Speak("It's my grocery list!")
            });

            wireManager.LookAt(RoomObjects.Groceries, _ => new[]
            {
                Actors.Guy.Speak("It's my bag full of vegan, non-fat, organic groceries!")
            });

            wireManager.LookAt(RoomObjects.Newspaper, _ => new[]
            {
                Actors.Guy.Speak("It's the newspaper I picked up in the park!")
            });

            wireManager.LookAt(Actors.Al, _ => new[]
            {
                Actors.Guy.Speak("It's an alien looking fellow!")
            });

            wireManager.LookAt(Actors.Ian, _ => new[]
            {
                Actors.Guy.Speak("It's an alien looking fellow!\nHe looks a bit more important than the other one!"),
                Actors.Al.Speak("Hey!"),
            });

            wireManager.LookAt(Actors.Guy, _ => new[]
            {
                Actors.Narrator.Speak("It's Guy Scotthrie, our fearless hero!")
            });

            wireManager.TalkTo(Actors.Al, _ => new[]
            {
                Actors.Guy.WalkTo(AlPosition.X - 10, AlPosition.Y + 50),
                Actors.Al.TalkTo("meet-al", true)
            });

            wireManager.Open(RoomObjects.ClosedFridge, (gameState) =>
            {
                gameState.SetValue("fridgeOpened", true);

                return new[]
                {
                    Actors.Guy.WalkTo(FridgePosition.X, 400),
                    Actors.Guy.FaceAway(),
                    Delay(TimeSpan.FromSeconds(1)),
                    AddRoomObject(
                        gameState.Contains("fridgeFull") ? RoomObjects.FullFridge : RoomObjects.EmptyFridge,
                        FridgePosition.X, FridgePosition.Y),
                    Delay(TimeSpan.FromSeconds(0.5)),
                    Actors.Guy.FaceFront()
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
                        Actors.Guy.WalkTo(TodoListPosition.X, 400),
                        Actors.Guy.FaceAway(),
                        Delay(TimeSpan.FromSeconds(1)),
                        RemoveRoomObject(RoomObjects.TodoList),
                        Actors.Guy.FaceFront(),
                        Actors.Guy.Speak("Got it!"),
                        Actors.Ian.Speak("Hey, put that back!"),
                        Actors.Al.Speak("We need that to finish the mission!"),
                        Actors.Guy.FaceAway(),
                        Delay(TimeSpan.FromSeconds(0.5)),
                        AddRoomObject(RoomObjects.TodoList, TodoListPosition.X, TodoListPosition.Y),
                        Actors.Guy.FaceFront(),
                        Actors.Guy.Speak("I guess I have to think of something sneakier!"),
                        Actors.Guy.WalkTo(TodoListPosition.X - 30, 420),
                    };
                }

                return new IAction[0];
            });


            wireManager.Close(RoomObjects.EmptyFridge, (gameState) =>
            {
                gameState.RemoveValue("fridgeOpened");

                return new[]
                {
                    Actors.Guy.WalkTo(FridgePosition.X, 400),
                    Actors.Guy.FaceAway(),
                    Delay(TimeSpan.FromSeconds(1)),
                    RemoveRoomObject(RoomObjects.EmptyFridge),
                    Delay(TimeSpan.FromSeconds(0.5)),
                    Actors.Guy.FaceFront()
                };
            });

            wireManager.Close(RoomObjects.FullFridge, (gameState) =>
            {
                gameState.RemoveValue("fridgeOpened");

                return new[]
                {
                    Actors.Guy.WalkTo(FridgePosition.X, 400),
                    Actors.Guy.FaceAway(),
                    Delay(TimeSpan.FromSeconds(1)),
                    RemoveRoomObject(RoomObjects.FullFridge),
                    Delay(TimeSpan.FromSeconds(0.5)),
                    Actors.Guy.FaceFront()
                };
            });

            wireManager.Use(RoomObjects.Groceries, RoomObjects.ClosedFridge, (gameState) =>
            {
                return new[]
                {
                    Actors.Guy.Speak("What do you expect me to do? Throw them at the fridge door?")
                };
            });

            wireManager.Use(RoomObjects.Groceries, RoomObjects.EmptyFridge, (gameState) =>
            {
                gameState.SetValue("fridgeFull", true);

                return new[]
                {
                    Actors.Guy.WalkTo(FridgePosition.X, 400),
                    Actors.Guy.FaceAway(),
                    Delay(TimeSpan.FromSeconds(1)),
                    Player.RemoveFromInventory(RoomObjects.Groceries),
                    AddRoomObject(RoomObjects.FullFridge, FridgePosition.X, FridgePosition.Y),
                    RemoveRoomObject(RoomObjects.EmptyFridge),
                    Delay(TimeSpan.FromSeconds(1)),
                    Actors.Guy.FaceFront()
                };
            });

            wireManager.Use(RoomObjects.GroceryList, RoomObjects.TodoList, (gameState) =>
            {
                if (gameState.Contains("listSwitched"))
                {
                    return new[]
                    {
                        Actors.Guy.WalkTo(TodoListPosition.X, 400),
                        Actors.Guy.FaceAway(),
                        Delay(TimeSpan.FromSeconds(1)),
                        Actors.Guy.FaceFront(),
                        Actors.Guy.Speak("I already did that.\nLet's not undo the magic!")
                    };
                }
                else
                {
                    gameState.SetValue("listSwitched", true);

                    return new[]
                    {
                        Actors.Guy.WalkTo(TodoListPosition.X - 15, TodoListPosition.Y + 100),
                        Actors.Guy.FaceAway(),
                        Delay(TimeSpan.FromSeconds(1)),
                        Player.RemoveFromInventory(RoomObjects.GroceryList),
                        AddRoomObject(RoomObjects.GroceryList, GroceryListPosition.X, GroceryListPosition.Y),
                        RemoveRoomObject(RoomObjects.TodoList),
                        Player.AddToInventory(RoomObjects.TodoList),
                        Delay(TimeSpan.FromSeconds(1)),
                        Actors.Guy.FaceFront(),
                        Actors.Guy.Speak("That should do the trick!")
                    };
                }
            });

            wireManager.Use(RoomObjects.TodoList, RoomObjects.GroceryList, (gameState) =>
            {
                if (gameState.Contains("listSwitched"))
                {
                    return new[]
                    {
                        Actors.Guy.WalkTo(TodoListPosition.X, 400),
                        Actors.Guy.FaceAway(),
                        Delay(TimeSpan.FromSeconds(1)),
                        Actors.Guy.FaceFront(),
                        Actors.Guy.Speak("Hmmm, there was I reason I switched these lists.\nI'll just keep it this way.")
                    };
                }
                else
                {
                    return new[]
                    {
                        Actors.Guy.WalkTo(TodoListPosition.X, 400),
                        Actors.Guy.FaceAway(),
                        Delay(TimeSpan.FromSeconds(1)),
                        Actors.Guy.FaceFront(),
                        Actors.Guy.Speak("I should probably do it the other way around.")
                    };
                }
            });

            wireManager.Use(RoomObjects.GroceryList, RoomObjects.Groceries, (gameState) =>
            {
                return Actors.Guy.Speak("Yep, I've got everything on the list!");
            });

            wireManager.Use(RoomObjects.Groceries, RoomObjects.GroceryList, (gameState) =>
            {
                return Actors.Guy.Speak("Yep, I've got everything on the list!");
            });

            wireManager.TalkTo(Actors.Ian, (gameState) =>
            {
                if (gameState.Contains("talkedAboutList"))
                {
                    var actions = new List<IAction>
                    {
                        Actors.Guy.WalkTo(IanPosition.X - 40, IanPosition.Y + 30),
                        Actors.Guy.FaceAway(),
                        Actors.Guy.Speak("Shouldn't you check the list?"),
                        Actors.Guy.FaceFront(),
                        Actors.Ian.WalkTo(TodoListPosition.X, TodoListPosition.Y + 120),
                        Actors.Ian.FaceAway()
                    };

                    if (!gameState.Contains("listSwitched"))
                    {
                        actions.Add(Actors.Ian.Speak("Hmm, we still need to find this Hans Scottleman guy..."));
                        actions.Add(Actors.Ian.FaceFront());
                        actions.Add(Actors.Ian.WalkTo(IanPosition.X, IanPosition.Y));
                    }
                    else
                    {
                        actions.Add(Actors.Ian.Speak("Hmm, looks like the mission parameters have changed!\nWe need to collect earthly food products!"));
                        actions.Add(Actors.Ian.FaceFront());
                        actions.Add(Actors.Ian.WalkTo(FridgePosition.X, FridgePosition.Y + 158));
                        actions.Add(Actors.Ian.FaceAway());

                        if (!gameState.Contains("fridgeOpened"))
                        {
                            actions.Add(AddRoomObject(
                                gameState.Contains("fridgeFull") ? RoomObjects.FullFridge : RoomObjects.EmptyFridge,
                                FridgePosition.X, FridgePosition.Y));
                        }
                        else
                        {
                            actions.Add(Actors.Ian.Speak("Damnit Al, you left the fridge open again!"));
                            actions.Add(Actors.Al.Speak("It wasn't me!"));
                        }

                        if (gameState.Contains("fridgeFull"))
                        {
                            actions.Add(Actors.Ian.Speak("Excellent, looks like we're all set!"));
                            actions.Add(Actors.Ian.FaceFront());
                            actions.Add(Actors.Ian.Speak("Ehm...\nWhy is that red shirt guy still in my spaceship?"));
                            actions.Add(Delay(TimeSpan.FromSeconds(2)));
                            actions.Add(SwitchRoom(new BeachRoom()));
                        }
                        else
                        {
                            actions.Add(Actors.Ian.Speak("Hmmmm\nWe're not quite there yet!"));
                            actions.Add(RemoveRoomObject(gameState.Contains("fridgeFull") ? RoomObjects.FullFridge : RoomObjects.EmptyFridge));
                            actions.Add(Actors.Ian.FaceFront());
                            actions.Add(Actors.Ian.WalkTo(IanPosition.X, IanPosition.Y));

                            gameState.RemoveValue("fridgeOpened");
                        }
                    }

                    return actions;
                }
                else
                {
                    return new[]
                    {
                        Actors.Ian.Speak("Go away, can't you see I'm extremely busy?")
                    };
                }
            });
        }
    }
}