using System;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Newtonsoft.Json.Linq;

namespace GameATron3000.Bot.Engine.Actions
{
    public class DelayAction : IAction
    {
        private readonly TimeSpan _time;

        public DelayAction(TimeSpan time)
        {
            _time = time;
        }

        public async Task<bool> ExecuteAsync(IDialogContext context, ResumeAfter<object> resume)
        {
            var activity = ((Activity)context.Activity).CreateReply();
            activity.Type = ActivityTypes.Event;
            activity.Name = Event.Delayed;
            activity.Properties = JObject.FromObject(new
            {
                time = _time.TotalMilliseconds
            });

            await context.PostAsync(activity).ConfigureAwait(false);

            return false;
        }
    }
}