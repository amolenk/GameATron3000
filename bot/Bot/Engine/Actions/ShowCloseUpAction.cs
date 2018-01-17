using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Newtonsoft.Json.Linq;

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
            await context.PostEventAsync(Event.CloseUpOpened, JObject.FromObject(new
            {
                objectId = _roomObject.Id
            }));

            foreach (var action in _closeUpActions)
            {
                await action.ExecuteAsync(context, resume);
            }

            await context.PostEventAsync(Event.CloseUpClosed, JObject.FromObject(new
            {
                objectId = _roomObject.Id
            }));

            return false;
        }
    }
}