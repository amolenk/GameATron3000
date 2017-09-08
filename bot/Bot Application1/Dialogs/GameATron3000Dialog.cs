using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;

namespace Bot_Application1.Dialogs
{
    [Serializable]
    public class GameATron3000Dialog
    {
        protected async Task AddToInventory(string objectId, IDialogContext context)
        {
            var reply = ((Activity)context.Activity).CreateReply();
            reply.Type = ActivityTypes.Event;
            reply.Name = "ObjectAddedToInventory";
            reply.Id = objectId;

            await SetStateAsync("inventory_" + objectId, true, context);

            await context.PostAsync(reply);
        }

        protected Task Say(string actorId, string text, IDialogContext context)
        {
            var reply = ((Activity)context.Activity).CreateReply(text);
            reply.Value = actorId;
            reply.From.Name = actorId;

            return context.PostAsync(reply);
        }

        protected async Task UpdateObjectDescriptionAsync(string objectId, string description, IDialogContext context)
        {
            var reply = ((Activity)context.Activity).CreateReply();
            reply.Type = ActivityTypes.Event;
            reply.Name = "ObjectDescriptionUpdated";
            reply.Id = objectId;
            reply.Value = description;

            await context.PostAsync(reply);
        }

        //protected async Task<List<object>> GetInventory(Activity activity)
        //{
        //    StateClient stateClient = activity.GetStateClient();
        //    BotData botData = await stateClient.BotState.GetConversationDataAsync(activity.ChannelId, activity.From.Id);
        //    return botData.GetProperty<List<object>>("Inventory") ?? new List<object>();
        //}

        //protected async Task AddToInventory(Activity activity, object item)
        //{
        //    StateClient stateClient = activity.GetStateClient();
        //    BotData botData = await stateClient.BotState.GetConversationDataAsync(activity.ChannelId, activity.From.Id);
        //    List<object> inventory = botData.GetProperty<List<object>>("Inventory") ?? new List<object>();
        //    inventory.Add(item);
        //    botData.SetProperty("Inventory", inventory);
        //    await stateClient.BotState.SetConversationDataAsync(activity.ChannelId, activity.From.Id, botData);
        //}

        protected async Task SetStateAsync<T>(string property, T data, IDialogContext context)
        {
            var activity = context.Activity;
            var stateClient = activity.GetStateClient();

            var botData = await stateClient.BotState.GetConversationDataAsync(activity.ChannelId, activity.From.Id);

            botData.SetProperty(property, data);

            await stateClient.BotState.SetConversationDataAsync(activity.ChannelId, activity.From.Id, botData);
        }
    }
}