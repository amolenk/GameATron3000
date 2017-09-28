using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Newtonsoft.Json.Linq;

namespace GameATron3000.Bot.Engine.Actions
{
    public class TurnAwayAction : IAction
    {
        private readonly Actor _actor;

        public TurnAwayAction(Actor actor)
        {
            _actor = actor;
        }

        public async Task<bool> ExecuteAsync(IDialogContext context, ResumeAfter<object> resume)
        {
            await context.PostEventAsync(Event.ActorTurnedAway, JObject.FromObject(new
            {
                actorId = _actor.Id
            }));

            return false;
        }
    }
}