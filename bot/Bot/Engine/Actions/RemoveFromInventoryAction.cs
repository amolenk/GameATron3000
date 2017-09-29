using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Newtonsoft.Json.Linq;

namespace GameATron3000.Bot.Engine.Actions
{
    public class RemoveFromInventoryAction : IAction
    {
        private readonly RoomObject _roomObject;

        public RemoveFromInventoryAction(RoomObject roomObject)
        {
            _roomObject = roomObject;
        }

        public async Task<bool> ExecuteAsync(IDialogContext context, ResumeAfter<object> resume)
        {
            var gameState = new GameState(context);
            gameState.RemoveInventoryItem(_roomObject);

            await context.PostEventAsync(Event.InventoryItemRemoved, JObject.FromObject(new
            {
                objectId = _roomObject.Id
            }));

            return false;
        }
    }
}