using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Newtonsoft.Json.Linq;

namespace Bot_Application1.Dialogs
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

        public Task ExecuteAsync(Activity activity, IDialogContext context, ResumeAfter<object> resume)
        {
            var reply = activity.CreateReply();
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

            return context.PostAsync(reply);
        }
    }
}