using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Bot_Application1.Dialogs;

namespace Bot_Application1.Engine
{
    public static class Player
    {
        public static IAction AddToInventory(RoomObject @object)
        {
            return new AddToInventoryAction(@object);
        }
    }
}