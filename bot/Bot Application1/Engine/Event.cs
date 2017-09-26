using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Bot_Application1.Engine
{
    public enum Event
    {
        // Player has entered a new room.
        EnteredRoom,

        // Bot is waiting for input from client.
        Idle
    }
}