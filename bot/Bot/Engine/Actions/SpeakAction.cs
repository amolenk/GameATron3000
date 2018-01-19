using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameATron3000.Bot.Engine.Actions
{
    public class SpeakAction : IAction
    {
        private readonly string _actorId;
        private readonly string _text;
        private readonly List<ConversationOption> _options;

        public SpeakAction(string actorId, string text, List<ConversationOption> options = null)
        {
            _actorId = actorId;
            _text = text;
            _options = options;
        }

        public async Task<bool> ExecuteAsync(IDialogContext context, ResumeAfter<object> resume = null)
        {
            var reply = ((Activity)context.Activity).CreateReply();
            reply.Type = ActivityTypes.Message;
            reply.Text = _text;
            reply.From.Name = _actorId;

            if (_options != null)
            {
                reply.SuggestedActions = new SuggestedActions
                {
                    Actions = _options
                        .Select(option => new CardAction
                        {
                            Title = option.Text,
                            Type = ActionTypes.ImBack,
                            Value = option.Text
                        })
                        .ToList()
                };
            }

            await context.PostAsync(reply);

            return false;
        }
    }
}