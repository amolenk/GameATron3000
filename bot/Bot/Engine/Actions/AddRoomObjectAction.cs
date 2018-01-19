using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace GameATron3000.Bot.Engine.Actions
{
    public class AddRoomObjectAction : IAction
    {
        private readonly RoomObject _roomObject;
        private readonly int _x;
        private readonly int _y;
        private readonly bool _bringToFront;

        public AddRoomObjectAction(RoomObject roomObject, int x, int y, bool bringToFront = false)
        {
            _roomObject = roomObject;
            _x = x;
            _y = y;
            _bringToFront = bringToFront;
        }

        public async Task<bool> ExecuteAsync(IDialogContext context, ResumeAfter<object> resume)
        {
            var activity = ((Activity)context.Activity).CreateReply();
            activity.Type = ActivityTypes.Event;
            activity.Name = Event.RoomObjectAdded;
            activity.Properties = JObject.FromObject(new
            {
                objectId = _roomObject.Id,
                description = _roomObject.Description,
                x = _x,
                y = _y,
                foreground = _bringToFront
            });

            await context.PostAsync(activity).ConfigureAwait(false);

            return false;
        }
    }
}