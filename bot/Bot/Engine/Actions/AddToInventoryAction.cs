using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Newtonsoft.Json.Linq;

namespace GameATron3000.Bot.Engine.Actions
{
    public class AddToInventoryAction : IAction
    {
        private readonly RoomObject _roomObject;

        public AddToInventoryAction(RoomObject roomObject)
        {
            _roomObject = roomObject;
        }

        public async Task<bool> ExecuteAsync(IDialogContext context, ResumeAfter<object> resume)
        {
            var gameState = new GameState(context);
            gameState.AddInventoryItem(_roomObject);

            await context.PostEventAsync(Event.InventoryItemAdded, JObject.FromObject(new
            {
                objectId = _roomObject.Id,
                description = _roomObject.Description
            }));

            return false;
        }
    }
}