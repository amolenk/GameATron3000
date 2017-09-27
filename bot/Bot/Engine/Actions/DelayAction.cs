using System;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
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
            await context.PostEventAsync(Event.Delayed, JObject.FromObject(new
            {
                time = _time.TotalMilliseconds
            }));

            return false;
        }
    }
}