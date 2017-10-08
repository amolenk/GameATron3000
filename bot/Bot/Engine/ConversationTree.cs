using System;
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
        public ConversationTree(Actor actor, string topic)
        {
            ActorId = actor.Id;
            ActorDescription = actor.Description;
            Topic = topic;
        }

        public async Task StartAsync(IDialogContext context)
        {
            Model = LoadConversationTreeModel(Topic);

            await PostReplies(context, (JArray)Model["text"]);

            context.Wait(MessageReceivedAsync);
        }

        public JToken Model { get; private set; }

        public string Topic { get; private set; }

        public string ActorId { get; private set; }

        public string ActorDescription { get; private set; }

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

            var replyTexts = (JArray)Model["text"];
            var isDone = Model["done"] != null;

            // If the reply does not contain any actions, we've reached a leaf and need to reset
            // back to the top.
            if (Model["actions"] == null)
            {
                Model = LoadConversationTreeModel(Topic);
            }

            await PostReplies(context, replyTexts, isDone);

            if (isDone)
            {
                context.Done<object>(null);
            }
            else
            {
                context.Wait(MessageReceivedAsync);
            }
        }

        private async Task PostReplies(IDialogContext context, JArray replyTexts, bool isDone = false)
        {
            for (var i = 0; i < replyTexts.Count; i++)
            {
                await PostReply(
                    context,
                    replyTexts[i]["actor"].Value<string>(),
                    replyTexts[i]["text"].Value<string>(),
                    !isDone && i == replyTexts.Count - 1);
            }
        }

        private Task PostReply(IDialogContext context, string actorId, string replyText, bool includeSuggestedActions = false)
        {
            var reply = ((Activity)context.Activity).CreateReply(replyText);
            reply.Type = ActivityTypes.Message;
            reply.TextFormat = TextFormatTypes.Plain;

            reply.From.Name = ActorDescription;
            reply.Properties = JObject.FromObject(new
            {
                actorId = actorId
            });

            if (includeSuggestedActions)
            {
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
            }

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