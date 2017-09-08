using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Bot_Application1.Dialogs
{
    [Serializable]
    public class GraphDialog<TResult> : IDialog<TResult>
    {
        public Task StartAsync(IDialogContext context)
        {
            GraphNode = LoadGraph("graph");

            context.Wait(MessageReceivedAsync);

            return Task.CompletedTask;
        }

        public JToken GraphNode { get; private set; }

        private async Task MessageReceivedAsync(IDialogContext context, IAwaitable<object> result)
        {
            var activity = await result as Activity;

            if (activity.Text == "hi")
            {
                
            }
            else
            {
                var match = GraphNode["actions"]
                    .Children()
                    .Where(action => action["value"].Value<string>() == activity.Text)
                    .FirstOrDefault();

                if (match != null)
                {
                    GraphNode = match["reply"];
                }
            }

            var reply = activity.CreateReply(GraphNode["text"].Value<string>());
            reply.Type = ActivityTypes.Message;
            reply.TextFormat = TextFormatTypes.Plain;

            if (GraphNode["actions"] == null)
            {
                GraphNode = LoadGraph("graph");
            }

            reply.SuggestedActions = new SuggestedActions()
            {
                Actions = GraphNode["actions"].Select(
                    action => new CardAction
                    {
                        Title = action["value"].Value<string>(),
                        Type = ActionTypes.ImBack,
                        Value = action["value"].Value<string>()
                    })
                    .ToList()
            };

            await context.PostAsync(reply);

            context.Wait(MessageReceivedAsync);
        }

        private static JObject LoadGraph(string name)
        {
            var resourceName = $"Bot_Application1.Dialogs.{name}.json";

            using (var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName))
            using (var reader = new JsonTextReader(new StreamReader(stream)))
            {
                return JObject.Load(reader);
            }
        }
    }
}