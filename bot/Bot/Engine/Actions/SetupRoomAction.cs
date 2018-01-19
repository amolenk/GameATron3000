using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;

namespace GameATron3000.Bot.Engine.Actions
{
    public class SetupRoomAction : IAction
    {
        private readonly RoomDefinition _roomDefinition;

        public SetupRoomAction(RoomDefinition roomDefinition)
        {
            _roomDefinition = roomDefinition;
        }

        public async Task<bool> ExecuteAsync(IDialogContext context, ResumeAfter<object> resume = null)
        {
            var activity = ((Activity)context.Activity).CreateReply();
            activity.Type = ActivityTypes.Event;
            activity.Name = Event.RoomEntered;
            activity.Properties = _roomDefinition.ToJObject();

            await context.PostAsync(activity).ConfigureAwait(false);

            return false;
        }
    }
}