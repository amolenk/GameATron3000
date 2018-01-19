using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Newtonsoft.Json.Linq;

namespace GameATron3000.Bot.Engine.Actions
{
    public class RemoveRoomObjectAction : IAction
    {
        private readonly RoomObject _roomObject;

        public RemoveRoomObjectAction(RoomObject roomObject)
        {
            _roomObject = roomObject;
        }

        public async Task<bool> ExecuteAsync(IDialogContext context, ResumeAfter<object> resume)
        {
            var activity = ((Activity)context.Activity).CreateReply();
            activity.Type = ActivityTypes.Event;
            activity.Name = Event.RoomObjectRemoved;
            activity.Properties = JObject.FromObject(new
            {
                objectId = _roomObject.Id
            });

            await context.PostAsync(activity).ConfigureAwait(false);

            return false;
        }
    }
}