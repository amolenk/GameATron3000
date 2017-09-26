using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Newtonsoft.Json.Linq;
using Bot_Application1.Engine;

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

        public async Task<bool> ExecuteAsync(IDialogContext context)
        {
            await context.PostMessageAsync("WALKTO!");
            //var reply = activity.CreateReply();
            //reply.Type = ActivityTypes.Event;
            //reply.Name = "WalkTo";
            //reply.Properties = JObject.FromObject(new
            //{
            //    actorId = _actorId,
            //    x = _x,
            //    y = _y
            //});

            return false;
            //return context.PostAsync(reply);
        }
    }
}