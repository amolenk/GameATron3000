using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Newtonsoft.Json.Linq;

namespace GameATron3000.Bot.Engine.Actions
{
    public class RemoveInventoryItemAction : IAction
    {
        private readonly RoomObject _roomObject;

        public RemoveInventoryItemAction(RoomObject roomObject)
        {
            _roomObject = roomObject;
        }

        public async Task<bool> ExecuteAsync(IDialogContext context, ResumeAfter<object> resume)
        {
            var gameState = new GameState(context);
            gameState.RemoveInventoryItem(_roomObject);

            var activity = ((Activity)context.Activity).CreateReply();
            activity.Type = ActivityTypes.Event;
            activity.Name = Event.InventoryItemRemoved;
            activity.Properties = JObject.FromObject(new
            {
                objectId = _roomObject.Id
            });

            await context.PostAsync(activity).ConfigureAwait(false);

            return false;
        }
    }
}