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

        public IAction WalkTo(int x, int y)
        {
            return new WalkAction(Id, x, y); 
        }
    }
}