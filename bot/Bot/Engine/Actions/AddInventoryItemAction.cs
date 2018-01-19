using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Newtonsoft.Json.Linq;

namespace GameATron3000.Bot.Engine.Actions
{
    public class AddInventoryItemAction : IAction
    {
        private readonly RoomObject _roomObject;

        public AddInventoryItemAction(RoomObject roomObject)
        {
            _roomObject = roomObject;
        }

        public async Task<bool> ExecuteAsync(IDialogContext context, ResumeAfter<object> resume = null)
        {
            var gameState = new GameState(context);
            gameState.AddInventoryItem(_roomObject);

            var activity = ((Activity)context.Activity).CreateReply();
            activity.Type = ActivityTypes.Event;
            activity.Name = Event.InventoryItemAdded;
            activity.Properties = JObject.FromObject(new
            {
                objectId = _roomObject.Id,
                description = _roomObject.Description
            });

            await context.PostAsync(activity).ConfigureAwait(false);

            return false;
        }
    }
}