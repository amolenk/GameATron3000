using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;

namespace GameATron3000.Bot.Engine.Actions
{
    public class EnterRoom : IAction
    {
        private readonly Room _room;

        public EnterRoom(Room room)
        {
            _room = room;
        }

        public Task<bool> ExecuteAsync(IDialogContext context, ResumeAfter<object> resume)
        {
            context.Done(_room);

            return Task.FromResult(true);
        }
    }
}