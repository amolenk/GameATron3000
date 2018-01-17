using System;
using System.Collections.Generic;

namespace GameATron3000.Bot.Engine
{
    [Serializable]
    public class ConversationTopic
    {
        public string Name { get; set; }

        public List<ConversationLine> Lines { get; set; }

        public List<ConversationOption> Options { get; set; }

        public List<string> Achievements { get; set; }
    }
}