using System.Collections.Generic;
using GameATron3000.Bot.Engine;

namespace GameATron3000.Bot.Gameplay
{
    public class Game
    {
        public List<RoomObject> InitialInventoryItems => new List<RoomObject> { RoomObjects.Groceries, RoomObjects.GroceryList };

        public Room CreateInitialRoom()
        {
            return new ParkRoom();
        }
    }
}