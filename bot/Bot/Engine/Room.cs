using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameATron3000.Bot.Engine.Actions;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;

namespace GameATron3000.Bot.Engine
{
    [Serializable]
    public abstract class Room : IDialog<Room>
    {
        [NonSerialized]
        private WireManager _wireManager;

        protected Room()
        {
        }

        public async Task StartAsync(IDialogContext context)
        {
            var roomDefinition = GetRoomDefinition();

            await context.PostEventAsync(Event.RoomEntered, roomDefinition.ToJObject());
            //await context.PostMessageAsync(roomDefinition.IntroductionText);

            foreach (var action in OnEnterRoom())
            {
                var contextHandled = await action.ExecuteAsync(context, ResumeAfterConversationTree);
                if (contextHandled)
                {
                    return;
                }
            }

            await context.PostEventAsync(Event.Idle);

            context.Wait(MessageReceivedAsync);
        }

        protected abstract RoomDefinition GetRoomDefinition();

        protected virtual IEnumerable<IAction> OnEnterRoom()
        {
            return Enumerable.Empty<IAction>();
        }

        protected abstract void WireRoom(WireManager wireManager);

        protected IAction AddRoomObject(RoomObject roomObject, int x, int y, bool foreground = false)
        {
            return new AddRoomObjectAction(roomObject, x, y, foreground);
        }

        protected IAction RemoveRoomObject(RoomObject roomObject)
        {
            return new RemoveRoomObjectAction(roomObject);
        }

        protected IAction Delay(TimeSpan time)
        {
            return new DelayAction(time);
        }

        protected IAction NextRoom(Room nextRoom)
        {
            return new NextRoomAction(nextRoom);
        }

        protected IAction ShowCloseUp(RoomObject roomObject, IEnumerable<IAction> closeUpActions)
        {
            return new CloseUpAction(roomObject, closeUpActions);
        }

        private async Task MessageReceivedAsync(IDialogContext context, IAwaitable<object> result)
        {
            var activity = (Activity)await result;
            if (activity.Type == ActivityTypes.Message)
            {
                var wireManager = GetWireManager();
                var gameState = new GameState(context);

                var actions = wireManager.GetActions(activity.Text, gameState);

                foreach (var action in actions)
                {
                    var contextHandled = await action.ExecuteAsync(context, ResumeAfterConversationTree);
                    if (contextHandled)
                    {
                        return;
                    }
                }

                await context.PostEventAsync(Event.Idle);
            }

            context.Wait(MessageReceivedAsync);
        }

        private async Task ResumeAfterConversationTree(IDialogContext context, IAwaitable<object> result)
        {
            await context.PostEventAsync(Event.Idle);

            context.Wait(MessageReceivedAsync);
        }

        private WireManager GetWireManager()
        {
            if (_wireManager == null)
            {
                _wireManager = new WireManager();

                WireRoom(_wireManager);
            }

            return _wireManager;
        }
    }
}