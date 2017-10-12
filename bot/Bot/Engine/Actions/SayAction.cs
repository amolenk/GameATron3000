﻿using System.Threading.Tasks;
using GameATron3000.Bot.Gameplay;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Newtonsoft.Json.Linq;

namespace GameATron3000.Bot.Engine.Actions
{
    public class SayAction : IAction
    {
        private readonly string _actorId;
        private readonly string _text;

        public SayAction(string actorId, string text)
        {
            _actorId = actorId;
            _text = text;
        }

        public async Task<bool> ExecuteAsync(IDialogContext context, ResumeAfter<object> resume)
        {
            var reply = ((Activity)context.Activity).CreateReply();
            reply.Type = ActivityTypes.Message;
            reply.Text = _text;
            reply.From.Name = _actorId;

            if (_actorId != Actors.Narrator.Id)
            {
                reply.Properties = JObject.FromObject(new
                {
                    actorId = _actorId
                });
            }

            await context.PostAsync(reply);

            return false;
        }
    }
}