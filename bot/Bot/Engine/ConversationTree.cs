﻿using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace GameATron3000.Bot.Engine
{
    [Serializable]
    public class ConversationTree : IDialog<object>
    {
        public ConversationTree(string topic)
        {
            Topic = topic;
        }

        public async Task StartAsync(IDialogContext context)
        {
            Model = LoadConversationTreeModel(Topic);

            await PostReply(context, Model["text"].Value<string>());

            context.Wait(MessageReceivedAsync);
        }

        public JToken Model { get; private set; }

        public string Topic { get; private set; }

        private async Task MessageReceivedAsync(IDialogContext context, IAwaitable<object> result)
        {
            var activity = await result as Activity;

            // Try to find the input text in the conversation tree actions.
            var match = Model["actions"]
                .Children()
                .Where(action => action["value"].Value<string>() == activity.Text)
                .FirstOrDefault();

            // If we found the input text, position the graph at the reply.
            if (match != null)
            {
                Model = match["reply"];
            }

            var replyText = Model["text"].Value<string>();
            var isDone = Model["done"] != null;

            // If the reply does not contain any actions, we've reached a leaf and need to reset
            // back to the top.
            if (Model["actions"] == null)
            {
                Model = LoadConversationTreeModel(Topic);
            }

            await PostReply(context, replyText);

            if (isDone)
            {
                context.Done<object>(null);
            }
            else
            {
                context.Wait(MessageReceivedAsync);
            }
        }

        private Task PostReply(IDialogContext context, string replyText)
        {
            var reply = ((Activity)context.Activity).CreateReply(replyText);
            reply.Type = ActivityTypes.Message;
            reply.TextFormat = TextFormatTypes.Plain;

            reply.SuggestedActions = new SuggestedActions()
            {
                Actions = Model["actions"].Select(
                    action => new CardAction
                    {
                        Title = action["value"].Value<string>(),
                        Type = ActionTypes.ImBack,
                        Value = action["value"].Value<string>()
                    })
                    .ToList()
            };

            return context.PostAsync(reply);
        }

        private static JObject LoadConversationTreeModel(string name)
        {
            var resourceName = $"GameATron3000.Bot.Gameplay.ConversationTrees.{name}.json";

            using (var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName))
            using (var reader = new JsonTextReader(new StreamReader(stream)))
            {
                return JObject.Load(reader);
            }
        }
    }
}