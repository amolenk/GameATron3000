using System.Threading.Tasks;
using Bot_Application1.Engine;
using Microsoft.Bot.Builder.Dialogs;

namespace Bot_Application1.Dialogs
{
    public class AddToInventoryAction : IAction
    {
        private readonly RoomObject _roomObject;

        public AddToInventoryAction(RoomObject roomObject)
        {
            _roomObject = roomObject;
        }

        public async Task<bool> ExecuteAsync(IDialogContext context)
        {
            var gameState = new GameState(context);
            gameState.AddInventoryItem(_roomObject);

            await context.PostMessageAsync("ADDTOINVENTORY!");

            return false;
        }
    }
}