using System;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;

namespace Bot_Application1.Dialogs
{
    public static class Player
    {
        public static IAction AddToInventory(RoomObject roomObject)
        {
            return new AddToInventoryAction();
        }

        public static bool HasItem(RoomObject newspaper)
        {
            throw new NotImplementedException();
        }
    }
}