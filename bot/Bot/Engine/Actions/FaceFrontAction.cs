using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
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
            await context.PostEventAsync(Event.ActorFacedFront, JObject.FromObject(new
            {
                actorId = _actorId
            }));

            return false;
        }
    }
}