using System;

namespace GameATron3000.Bot.Engine
{
    [Serializable]
    public class ConversationOption
    {
        public string Text { get; set; }

        public string Action { get; set; }

        public bool IsCheckpoint { get; set; }
    }
}