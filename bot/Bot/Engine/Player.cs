using GameATron3000.Bot.Engine.Actions;

namespace GameATron3000.Bot.Engine
{
    public static class Player
    {
        public static IAction AddToInventory(RoomObject @object)
        {
            return new AddToInventoryAction(@object);
        }
    }
}