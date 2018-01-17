using GameATron3000.Bot.Engine.Actions;
using System.Drawing;

namespace GameATron3000.Bot.Engine
{
    public class Actor : RoomObject
    {
        public static readonly string NarratorId = "narrator";
        public static readonly string PlayerId = "player";

        public Actor(string id, string description, string textColor = "White")
            : base(id, description)
        {
            TextColor = textColor;
        }

        public string TextColor { get; private set; }

        public IAction FaceAway()
        {
            return new FaceAwayAction(Id);
        }

        public IAction FaceFront()
        {
            return new FaceFrontAction(Id);
        }

        public IAction Speak(string text)
        {
            return new SpeakAction(Id, text);
        }

        public IAction TalkTo(string topic, bool faceAway = false)
        {
            return new TalkToAction(Id, topic, faceAway);
        }

        public IAction WalkTo(int x, int y)
        {
            return new WalkToAction(Id, x, y); 
        }
    }
}