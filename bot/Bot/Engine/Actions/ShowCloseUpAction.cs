using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GameATron3000.Bot.Engine.Actions
{
    public class ShowCloseUpAction : IAction
    {
        private readonly RoomObject _roomObject;
        private readonly IEnumerable<IAction> _closeUpActions;

        public ShowCloseUpAction(RoomObject roomObject, IEnumerable<IAction> closeUpActions)
        {
            _roomObject = roomObject;
            _closeUpActions = closeUpActions;
        }

        public async Task<bool> ExecuteAsync(IDialogContext context, ResumeAfter<object> resume)
        {
            var activity = ((Activity)context.Activity).CreateReply();
            activity.Type = ActivityTypes.Event;
            activity.Name = Event.CloseUpOpened;
            activity.Properties = JObject.FromObject(new
            {
                objectId = _roomObject.Id
            });

            await context.PostAsync(activity).ConfigureAwait(false);

            foreach (var action in _closeUpActions)
            {
                await action.ExecuteAsync(context, resume);
            }

            activity = ((Activity)context.Activity).CreateReply();
            activity.Type = ActivityTypes.Event;
            activity.Name = Event.CloseUpClosed;
            activity.Properties = JObject.FromObject(new
            {
                objectId = _roomObject.Id
            });

            await context.PostAsync(activity).ConfigureAwait(false);

            return false;
        }
    }
}