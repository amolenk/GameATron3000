using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Newtonsoft.Json.Linq;

namespace GameATron3000.Bot.Engine.Actions
{
    public class AddRoomObjectAction : IAction
    {
        private readonly RoomObject _roomObject;
        private readonly int _x;
        private readonly int _y;
        private readonly bool _foreground;

        public AddRoomObjectAction(RoomObject roomObject, int x, int y, bool foreground = false)
        {
            _roomObject = roomObject;
            _x = x;
            _y = y;
            _foreground = foreground;
        }

        public async Task<bool> ExecuteAsync(IDialogContext context, ResumeAfter<object> resume)
        {
            await context.PostEventAsync(Event.RoomObjectAdded, JObject.FromObject(new
            {
                objectId = _roomObject.Id,
                description = _roomObject.Description,
                x = _x,
                y = _y,
                foreground = _foreground
            }));

            return false;
        }
    }
}