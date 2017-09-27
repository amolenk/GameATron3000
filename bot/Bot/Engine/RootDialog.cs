﻿using System;
using System.Threading.Tasks;
using GameATron3000.Bot.Gameplay;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Newtonsoft.Json.Linq;

namespace GameATron3000.Bot.Engine
{
    [Serializable]
    public class RootDialog : IDialog<object>
    {
        [NonSerialized]
        private readonly Game _game;

        public RootDialog(Game game)
        {
            _game = game;
        }

        public async Task StartAsync(IDialogContext context)
        {
            foreach (var item in _game.InitialInventoryItems)
            {
                await context.PostEventAsync(Event.InventoryItemAdded, JObject.FromObject(new
                {
                    objectId = item.Id,
                    description = item.Description
                }));
            }

            context.Call(_game.CreateInitialRoom(), GameOver);
        }

        private Task GameOver(IDialogContext context, IAwaitable<object> result)
        {
            context.Done<object>(null);

            return Task.CompletedTask;
        }
    }
}