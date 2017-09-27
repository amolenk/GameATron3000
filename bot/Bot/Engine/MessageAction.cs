using System.Threading.Tasks;
using GameATron3000.Bot.Gameplay;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Newtonsoft.Json.Linq;

namespace GameATron3000.Bot.Engine
{
    public class MessageAction : IAction
    {
        private readonly string _actorId;
        private readonly string _text;
        private readonly string _from;

        public MessageAction(string actorId, string text, string from)
        {
            _actorId = actorId;
            _text = text;
            _from = from;
        }

        public async Task<bool> ExecuteAsync(IDialogContext context, ResumeAfter<object> resume)
        {
            var reply = ((Activity)context.Activity).CreateReply();
            reply.Type = ActivityTypes.Message;
            reply.Text = _text;
            reply.From.Name = _from;

            if (_actorId != Actors.Narrator.Id)
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