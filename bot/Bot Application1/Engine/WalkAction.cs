using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Newtonsoft.Json.Linq;

namespace Bot_Application1.Dialogs
{
    public class WalkAction : IAction
    {
        private readonly string _actorId;
        private readonly int _x;
        private readonly int _y;

        public WalkAction(string actorId, int x, int y)
        {
            _actorId = actorId;
            _x = x;
            _y = y;
        }

        public Task<Activity> CreateReplyAsync(Activity activity, IDialogContext context)
        {
            var reply = activity.CreateReply();
            reply.Type = ActivityTypes.Event;
            reply.Name = "WalkTo";
            reply.Properties = JObject.FromObject(new
            {
                actorId = _actorId,
                x = _x,
                y = _y
            });

            return Task.FromResult(reply);
        }
    }
}