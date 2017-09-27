using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
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
            await context.PostEventAsync(Event.ActorMoved, JObject.FromObject(new
            {
                actorId = _actorId,
                x = _x,
                y = _y
            }));

            return false;
        }
    }
}