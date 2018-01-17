using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;

namespace GameATron3000.Bot.Engine
{
    [Serializable]
    public class ConversationScript
    {
        private const string RegexConversationLine = @"^\>\s*(?<ActorId>.*?)\s*:\s*(?<Text>.*?)\s*$";
        private const string RegexConversationOption = @"^\-\s*(?<Text>.*?)\s*\*(?<Action>.*?)\*\s*$";
        private const string RegexAchievement = @"^\*\*(?<Achievement>.*?)\*\*\s*$";


        public Dictionary<string, ConversationTopic> Topics { get; private set; }

        public static ConversationScript Load(string name)
        {
            var resourceName = $"GameATron3000.Bot.Gameplay.ConversationTrees.{name}.md";

            using (var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName))
            using (var reader = new StreamReader(stream))
            {
                return new ConversationScript
                {
                    Topics = ReadTopics(reader)
                };
            }
        }

        private static Dictionary<string, ConversationTopic> ReadTopics(StreamReader reader)
        {
            var topics = new Dictionary<string, ConversationTopic>();
            ConversationTopic topic;

            while (TryReadTopic(reader, out topic))
            {
                topics.Add(topic.Name, topic);
            }

            return topics;
        }

        private static bool TryReadTopic(StreamReader reader, out ConversationTopic topic)
        {
            var nextChar = Peek(reader);
            if (nextChar == '#')
            {
                topic = new ConversationTopic
                {
                    Name = reader.ReadLine().Substring(1).Trim(),
                    Lines = ReadLines(reader),
                    Options = ReadOptions(reader),
                    Achievements = ReadAchievements(reader)
                };

                return true;
            }

            topic = null;
            return false;
        }

        private static List<ConversationLine> ReadLines(StreamReader reader)
        {
            var lines = new List<ConversationLine>();

            var nextChar = Peek(reader);
            while (nextChar == '>')
            {
                var line = reader.ReadLine();
                var match = Regex.Match(line, RegexConversationLine);
                if (match.Success)
                {
                    lines.Add(new ConversationLine
                    {
                        ActorId = match.Groups["ActorId"].Value,
                        Text = match.Groups["Text"].Value
                    });
                }
                else
                {
                    throw new IOException("Expected to read conversation line, but found: " + line);
                }

                nextChar = Peek(reader);
            }

            return lines;
        }

        private static List<ConversationOption> ReadOptions(StreamReader reader)
        {
            var lines = new List<ConversationOption>();

            var nextChar = Peek(reader);
            while (nextChar == '-')
            {
                var line = reader.ReadLine();
                var match = Regex.Match(line, RegexConversationOption);
                if (match.Success)
                {
                    var action = match.Groups["Action"].Value;

                    lines.Add(new ConversationOption
                    {
                        Text = match.Groups["Text"].Value,
                        Action = action.Trim('*'),
                        IsCheckpoint = action.StartsWith("*") && action.EndsWith("*")
                    });
                }
                else
                {
                    throw new IOException("Expected to read conversation options, but found: " + line);
                }

                nextChar = Peek(reader);
            }

            return lines;
        }

        private static List<string> ReadAchievements(StreamReader reader)
        {
            var achievements = new List<string>();

            var nextChar = Peek(reader);
            while (nextChar == '*')
            {
                var line = reader.ReadLine();
                var match = Regex.Match(line, RegexAchievement);
                if (match.Success)
                {
                    achievements.Add(match.Groups["Achievement"].Value);
                }
                else
                {
                    throw new IOException("Expected to read achievement, but found: " + line);
                }

                nextChar = Peek(reader);
            }

            return achievements;
        }

        private static char Peek(StreamReader reader)
        {
            while (char.IsWhiteSpace((char)reader.Peek()))
            {
                reader.Read();
            }

            return (char)reader.Peek();
        }
    }
}