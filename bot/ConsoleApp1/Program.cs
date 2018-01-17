using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Program
    {
        static void Main(string[] args)
        {
            var reader = new ScriptReader();
            var topics = reader.ReadScript(@"script.txt");

            foreach (var topic in topics)
            {
                Console.WriteLine("# " + topic.Id);

                foreach (var action in topic.Actions)
                {
                    Console.WriteLine(action);
                }

                foreach (var option in topic.Options)
                {
                    Console.WriteLine(option.Text);
                }
            }


        }

        

        public static void Execute(string[] script, string topic)
        {
            foreach (var action in ReadActions(script, topic))
            {
                Console.WriteLine(action);
            }

            foreach (var option in ReadOptions(script, topic))
            {
                Console.WriteLine(option);
            }
        }

        public static IEnumerable<string> ReadActions(string[] script, string topic)
        {
            var line = Array.IndexOf(script, "# " + topic);
            line += 1; // Read past topic name.

            while (!script[line].StartsWith("-"))
            {
                yield return script[line].Trim();

                line += 1;
            }
        }

        public static IEnumerable<string> ReadOptions(string[] script, string topic)
        {
            var line = Array.IndexOf(script, "# " + topic);
            line += 1; // Read past topic name.
             
            while (!script[line].StartsWith("#"))
            {
                if (script[line].StartsWith("-"))
                {
                    yield return script[line].Substring(1).Trim();
                }

                line += 1;
            }
        }
    }

    public class ScriptReader
    {
        public IEnumerable<Topic> ReadScript(string path)
        {
            using (var reader = new StreamReader(path))
            {
                Topic topic;
                while ((topic = ReadTopic(reader)) != null)
                {
                    yield return topic;
                }
            }
        }

        private Topic ReadTopic(StreamReader reader)
        {
            if (reader.EndOfStream)
            {
                return null;
            }

            if (reader.Peek() != '#')
            {
                throw new InvalidDataException("Expected topic start, but found: " + reader.ReadLine());
            }

            var topicStart = reader.ReadLine().Substring(1).Trim();

            //ReadActions(reader);

            return new Topic
            {
                Id = topicStart,
                Actions = ReadActions(reader).ToList(),
                Options = ReadOptions(reader).ToList()
            };
        }

        private IEnumerable<string> ReadActions(StreamReader reader)
        {
            List<string> actions = new List<string>();
            string action;

            while (TryReadAction(reader, out action))
            {
                yield return action;
            }
        }

        private IEnumerable<Option> ReadOptions(StreamReader reader)
        {
            List<Option> options = new List<Option>();
            Option option;

            while (TryReadOption(reader, out option))
            {
                yield return option;
            }
        }

        private bool TryReadAction(StreamReader reader, out string action)
        {
            var nextChar = Peek(reader);
            if (nextChar == '>' || nextChar == '*')
            {
                action = reader.ReadLine().Substring(1).Trim();
                return true;
            }

            action = string.Empty;
            return false;
        }

        private bool TryReadOption(StreamReader reader, out Option option)
        {
            var nextChar = Peek(reader);
            if (nextChar == '-')
            {
                option = new Option
                {
                    Text = reader.ReadLine().Substring(1).Trim(),
                    Actions = ReadActions(reader).ToList()
                };

                return true;
            }

            option = null;
            return false;
        }

        private char Peek(StreamReader reader)
        {
            while (char.IsWhiteSpace((char)reader.Peek()))
            {
                reader.Read();
            }

            return (char)reader.Peek();
        }
    }

    public class Topic
    {
        public string Id { get; set; }

        public List<string> Actions { get; set; }

        public List<Option> Options { get; set; }


    }

    public class Option
    {
        public string Text { get; set; }

        public List<string> Actions { get; set; }

 
    }
}
