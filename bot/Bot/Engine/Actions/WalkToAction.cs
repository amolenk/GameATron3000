using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Newtonsoft.Json.Linq;

namespace GameATron3000.Bot.Engine.Actions
{
    public class WalkToAction : IAction
    {
        private readonly string _actorId;
        private readonly int _x;
        private readonly int _y;

        public WalkToAction(string actorId, int x, int y)
        {
            _actorId = actorId;
            _x = x;
            _y = y;
        }

        public async Task<bool> ExecuteAsync(IDialogContext context, ResumeAfter<object> resume)
        {
            var activity = ((Activity)context.Activity).CreateReply();
            activity.Type = ActivityTypes.Event;
            activity.Name = Event.ActorMoved;
            activity.Properties = JObject.FromObject(new
            {
                actorId = _actorId,
                x = _x,
                y = _y
            });

            await context.PostAsync(activity).ConfigureAwait(false);

            return false;
        }
    }
}