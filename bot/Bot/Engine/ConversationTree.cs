using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameATron3000.Bot.Engine
{
    [Serializable]
    public class ConversationTree : IDialog<object>
    {
        public ConversationTree(string actorId, string scriptName, bool faceAway)
        {
            ActorId = actorId;
            Script = ConversationScript.Load(scriptName);
            FaceAway = faceAway;
        }

        public ConversationScript Script { get; private set; }

        public Stack<ConversationTopic> TopicStack { get; private set; }

        public bool FaceAway { get; private set; }

        public string ActorId { get; private set; }

        public async Task StartAsync(IDialogContext context)
        {
            if (FaceAway)
            {
                await context.PostEventAsync(Event.ActorFacedAway, JObject.FromObject(new
                {
                    actorId = Actor.PlayerId
                }));
            }

            var topic = Script.Topics["Start"];

            TopicStack = new Stack<ConversationTopic>();
            TopicStack.Push(topic);

            await SendReplies(context, null).ConfigureAwait(false);

            context.Wait(MessageReceivedAsync);
        }

        private async Task MessageReceivedAsync(IDialogContext context, IAwaitable<object> result)
        {
            var activity = await result as Activity;
            var selectedOption = TopicStack.Peek().Options.First(o => o.Text == activity.Text);

            var newTopic = Script.Topics[selectedOption.Action];
            TopicStack.Push(newTopic);

            var conversationCompleted = await SendReplies(context, selectedOption).ConfigureAwait(false);
            if (conversationCompleted)
            {
                // TODO Send Idle event.
                context.Done<object>(null);
            }
            else
            {
                context.Wait(MessageReceivedAsync);
            }
        }

        private async Task<bool> SendReplies(IDialogContext context, ConversationOption selectedOption)
        {
            var topic = TopicStack.Peek();

            // Create a list of lines to reply.
            var lines = new List<ConversationLine>();
            lines.AddRange(topic.Lines);

            if (selectedOption?.Action == "Stop")
            {
                foreach (var line in lines)
                {
                    var reply = ((Activity)context.Activity).CreateReply(line.Text);
                    reply.Type = ActivityTypes.Message;
                    reply.From.Name = line.ActorId;

                    await context.PostAsync(reply).ConfigureAwait(false);
                }

                return true;
            }
            else
            {
                // If the current topic doesn't have any options to let the player choose from,
                // keep going up the stack until a topic is encountered that:
                // 1. Has at least 1 checkpointed option
                // and 2. Does not contain the last selected option if not checkpointed
                if (topic.Options.Count == 0)
                {
                    while (topic.Options.Count(o => o.IsCheckpoint) == 0
                        || (topic.Options.Contains(selectedOption) && !selectedOption.IsCheckpoint))
                    {
                        TopicStack.Pop();
                        topic = TopicStack.Peek();
                    }
                }
            
                // Send all lines back to the client instead of the last one.
                for (var i = 0; i < lines.Count - 1; i++)
                {
                    var reply = ((Activity)context.Activity).CreateReply(lines[i].Text);
                    reply.Type = ActivityTypes.Message;
                    reply.From.Name = lines[i].ActorId;

                    await context.PostAsync(reply).ConfigureAwait(false);
                }

                // Piggy-back the conversation options onto the last line.
                if (topic.Options.Count > 0)
                {
                    var line = lines.Last();

                    var reply = ((Activity)context.Activity).CreateReply(line.Text);
                    reply.Type = ActivityTypes.Message;
                    reply.From.Name = line.ActorId;
                    reply.SuggestedActions = new SuggestedActions
                    {
                        Actions = topic.Options
                            .Select(option => new CardAction
                            {
                                Title = option.Text,
                                Type = ActionTypes.ImBack,
                                Value = option.Text
                            })
                            .ToList()
                    };

                    await context.PostAsync(reply).ConfigureAwait(false);
                }

                return false;
            }
        }
    }
}