using System;

namespace GameATron3000.Bot.Engine
{
    [Serializable]
    public class ConversationLine
    {
        public string ActorId { get; set; }

        public string Text { get; set; }
    }
}