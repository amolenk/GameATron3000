using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Newtonsoft.Json.Linq;

namespace GameATron3000.Bot.Engine.Actions
{
    public class FaceFrontAction : IAction
    {
        private readonly string _actorId;

        public FaceFrontAction(string actorId)
        {
            _actorId = actorId;
        }

        public async Task<bool> ExecuteAsync(IDialogContext context, ResumeAfter<object> resume)
        {
            var activity = ((Activity)context.Activity).CreateReply();
            activity.Type = ActivityTypes.Event;
            activity.Name = Event.ActorFacedFront;
            activity.Properties = JObject.FromObject(new
            {
                actorId = _actorId
            });

            await context.PostAsync(activity).ConfigureAwait(false);

            return false;
        }
    }
}