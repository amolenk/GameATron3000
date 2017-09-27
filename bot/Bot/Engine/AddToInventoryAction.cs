using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;

namespace GameATron3000.Bot.Engine
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

            await context.PostMessageAsync("ADDTOINVENTORY!");

            return false;
        }
    }
}