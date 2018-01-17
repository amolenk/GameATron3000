using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace GameATron3000.Bot.Engine.Actions
{
    public class SpeakAction : IAction
    {
        private readonly string _actorId;
        private readonly string _text;

        public SpeakAction(string actorId, string text)
        {
            _actorId = actorId;
            _text = text;
        }

        public async Task<bool> ExecuteAsync(IDialogContext context, ResumeAfter<object> resume)
        {
            // TODO USE EXTENSION METHOD

            var reply = ((Activity)context.Activity).CreateReply();
            reply.Type = ActivityTypes.Message;
            reply.Text = _text;
            reply.From.Name = _actorId;

            if (_actorId != Actor.NarratorId)
            {
                reply.Properties = JObject.FromObject(new
                {
                    actorId = _actorId
                });
            }

            await context.PostAsync(reply);

            return false;
        }
    }
}