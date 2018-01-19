using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Newtonsoft.Json.Linq;

namespace GameATron3000.Bot.Engine.Actions
{
    public class IdleAction : IAction
    {
        public async Task<bool> ExecuteAsync(IDialogContext context, ResumeAfter<object> resume = null)
        {
            var activity = ((Activity)context.Activity).CreateReply();
            activity.Type = ActivityTypes.Event;
            activity.Name = Event.Idle;

            await context.PostAsync(activity).ConfigureAwait(false);

            return false;
        }
    }
}