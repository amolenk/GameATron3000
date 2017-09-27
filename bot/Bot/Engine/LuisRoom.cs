using System;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Microsoft.Bot.Builder.Luis;
using Microsoft.Bot.Builder.Luis.Models;

namespace GameATron3000.Bot.Engine
{
    [LuisModel("46904df5-f37e-4beb-bac2-ad6790d45ea5", "9edcfab27acb46b7b430659ab44055d1")]
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

            await context.PostEventAsync(Event.EnteredRoom, roomDefinition.ToJObject());
            await context.PostMessageAsync(roomDefinition.IntroductionText);

            //context.Wait(MessageReceived);

            await base.StartAsync(context);
        }

        protected abstract RoomDefinition GetRoomDefinition();

        protected abstract void WireRoom(WireManager wireManager);

        protected IAction StartConversation(string topic)
        {
            return new TalkToAction(topic, ResumeAfterConversationTree);
        }


        [LuisIntent("")]
        [LuisIntent("None")]
        public async Task NoneAsync(IDialogContext context, IAwaitable<object> result, LuisResult luisResult)
        {
            //context.Wait(this.MessageReceived);
        }

        [LuisIntent("talk to")]
        public async Task TalkToAsync(IDialogContext context, IAwaitable<object> result, LuisResult luisResult)
        {
            var activity = (Activity)await result;
            if (activity.Type == ActivityTypes.Message)
            {
                await HandleMessageAsync(context, luisResult);
            }

            //context.Wait(this.MessageReceived);
        }


        private async Task HandleMessageAsync(IDialogContext context, LuisResult luisResult)
        {
            var wireManager = GetWireManager();
            var gameState = new GameState(context);

            // build activity from LUIS result
            string intent = luisResult.TopScoringIntent.Intent;
            string actor = luisResult.Entities.Count > 0 ? luisResult.Entities[0].Type : "unknown actor";
            //EntityRecommendation entity;
            //if (luisResult.TryFindEntity("simple", out entity))
            //{
            //    actor = entity.Role;
            //}
            string activityFromLuis = $"{intent} {actor}";

            var actions = wireManager.GetActions(activityFromLuis, gameState);

            foreach (var action in actions)
            {
                var contextHandled = await action.ExecuteAsync(context);
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

            //context.Wait(this.MessageReceived);
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