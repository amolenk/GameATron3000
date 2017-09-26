using System;
using Bot_Application1.Engine;

namespace Bot_Application1.Dialogs
{
    public class Actor : RoomObject
    {
        public Actor(string id, string text)
            : base(id, text)
        {
        }

        public IAction Say(string text)
        {
            return new MessageAction(Id, text, Description);
        }

        public IAction WalkTo(int x, int y)
        {
            return new WalkAction(Id, x, y); 
        }
    }
}