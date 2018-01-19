using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;

namespace GameATron3000.Bot.Engine.Actions
{
    public class SwitchRoomAction : IAction
    {
        private readonly Room _newRoom;

        public SwitchRoomAction(Room newRoom)
        {
            _newRoom = newRoom;
        }

        public Task<bool> ExecuteAsync(IDialogContext context, ResumeAfter<object> resume)
        {
            context.Done(_newRoom);

            return Task.FromResult(true);
        }
    }
}