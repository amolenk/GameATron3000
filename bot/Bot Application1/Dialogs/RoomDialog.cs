﻿using System;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Newtonsoft.Json.Linq;

namespace Bot_Application1.Dialogs
{
    [Serializable]
    public abstract class Room : IDialog<object>
    {
        private readonly string _roomId;

        [NonSerialized]
        private WireManager _wireManager;

        protected Room(string roomId)
        {
            _roomId = roomId;
        }

        public async Task StartAsync(IDialogContext context)
        {
            var activity = (Activity)context.Activity;

            var roomManager = new RoomManager(_roomId);
            PopulateRoom(roomManager);

            var roomActivity = activity.CreateReply();
            roomActivity.Text = IntroductionText;
            roomActivity.Properties = roomManager.GetRoomDefinition();

            SetEnableUIFlag(roomActivity);

            await context.PostAsync(roomActivity);


            _wireManager = new WireManager();
            WireRoom(_wireManager);


            context.Wait(MessageReceivedAsync);
        }

        protected abstract string IntroductionText { get; }

        protected abstract void PopulateRoom(RoomManager roomManager);

        protected abstract void WireRoom(WireManager wireManager);

        [OnDeserialized()]
        private void OnDeserialized(StreamingContext context)
        {
            _wireManager = new WireManager();

            WireRoom(_wireManager);
        }

        private async Task MessageReceivedAsync(IDialogContext context, IAwaitable<object> result)
        {
            var activity = (Activity)await result;

            if (activity.Type == ActivityTypes.Message)
            {
                var actions = _wireManager.GetActions(activity.Text, context)
//                    .Select(action => action.CreateReplyAsync(activity))
                    .ToList();

                int count = 0;
                foreach (var action in actions)
                {
                    var reply = await action.CreateReplyAsync(activity, context);

                    // If this is the last reply, add a flag so the client knows
                    // it can re-enable the UI.
                    if (++count == actions.Count)
                    {
                        SetEnableUIFlag(reply);
                    }

                    await context.PostAsync(reply);
                }
            }

            context.Wait(MessageReceivedAsync);
        }

        private void SetEnableUIFlag(Activity activity)
        {
            if (activity.Properties == null)
            {
                activity.Properties = new JObject();
            }

            activity.Properties.Add("enableUI", true);
        }
    }
}