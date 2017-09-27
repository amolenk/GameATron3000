using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
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
            await context.PostEventAsync(Event.RoomObjectRemoved, JObject.FromObject(new
            {
                objectId = _roomObject.Id,
            }));

            return false;
        }
    }
}