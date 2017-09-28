using GameATron3000.Bot.Engine.Actions;

namespace GameATron3000.Bot.Engine
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

        public IAction StartConversation(string topic)
        {
            return new TalkToAction(this, topic);
        }

        public IAction TurnAway()
        {
            return new TurnAwayAction(this);
        }

        public IAction TurnFront()
        {
            return new TurnFrontAction(this);
        }

        public IAction WalkTo(int x, int y)
        {
            return new WalkToAction(Id, x, y); 
        }
    }
}