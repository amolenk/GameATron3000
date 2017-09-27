using System;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Microsoft.Bot.Builder.Luis;
using Microsoft.Bot.Builder.Luis.Models;
using System.Collections.Generic;

namespace GameATron3000.Bot.Engine
{
    #region secret stuff
    [LuisModel("46904df5-f37e-4beb-bac2-ad6790d45ea5", "9edcfab27acb46b7b430659ab44055d1")]
    #endregion

    //[LuisModel("my app id", "my app key")]
    [Serializable]
    public abstract class LuisRoom : LuisDialog<object>
    {
        [NonSerialized]
        private WireManager _wireManager;

        protected LuisRoom()
        {
        }

        public async override Task StartAsync(IDialogContext context)
        {
            var roomDefinition = GetRoomDefinition();

            await context.PostEventAsync(Event.RoomEntered, roomDefinition.ToJObject());
            await context.PostMessageAsync(roomDefinition.IntroductionText);

            await base.StartAsync(context);
        }

        protected abstract RoomDefinition GetRoomDefinition();

        protected abstract void WireRoom(WireManager wireManager);

        [LuisIntent("")]
        [LuisIntent("None")]
        public Task None(IDialogContext context, IAwaitable<object> result, LuisResult luisResult)
        {
            return Task.CompletedTask;
        }

        [LuisIntent("talk to")]
        [LuisIntent("look at")]
        [LuisIntent("pick up")]
        public async Task TalkToAsync(IDialogContext context, IAwaitable<object> result, LuisResult luisResult)
        {
            var activity = (Activity)await result;
            if (activity.Type == ActivityTypes.Message)
            {
                await HandleMessageAsync(context, luisResult);
            }
        }

        private async Task HandleMessageAsync(IDialogContext context, LuisResult luisResult)
        {
            var wireManager = GetWireManager();
            var gameState = new GameState(context);

            // build activity from LUIS result
            string intent = luisResult.TopScoringIntent.Intent;
            string subject = luisResult.Entities.Count > 0 ? luisResult.Entities[0].Type : "unknown";
            string activityFromLuis = $"{intent} {subject}";

            // execute actions
            var actions = wireManager.GetActions(activityFromLuis, gameState);
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

        private async Task ResumeAfterConversationTree(IDialogContext context, IAwaitable<object> result)
        {
            // TODO Check this
            await context.PostMessageAsync("End of conversation!");
            await context.PostEventAsync(Event.Idle);
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