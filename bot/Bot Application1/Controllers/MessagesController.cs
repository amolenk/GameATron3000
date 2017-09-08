using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using System.Linq;

namespace Bot_Application1
{
    [BotAuthentication]
    public class MessagesController : ApiController
    {
        /// <summary>
        /// POST: api/Messages
        /// Receive a message from a user and reply to it
        /// </summary>
        public async Task<HttpResponseMessage> Post([FromBody]Activity activity)
        {
            switch (activity.Type)
            {
                case ActivityTypes.ConversationUpdate:

                    // Support for emulator.
                    // When the bot is added to the emulator, start the game.
                    if (activity.MembersAdded.Any(m => m.Name == "Game-a-tron 3000 (TM)"
                        || m.Name == "Bot"))
                    {
                        await Conversation.SendAsync(activity, () => new Dialogs.RootDialog());
                    }
                    break;

                case ActivityTypes.Event:

                    // Support for the GUI.
                    // We need to ensure that the dialog state is saved in the correct user context.
                    // When the GUI client opens a direct line connection, a conversationUpdate message
                    // is sent, but it doesn't have the correct From id (should be 'player'). 
                    // Instead the conversation id is used by the direct line JS implementation. Because
                    // we need to make sure that dialog state is stored in the 'player' state, we wait
                    // for an explicit 'start' event with the correct From information before starting 
                    // the dialog.
                    if (activity.Name == "start")
                    {
                        await Conversation.SendAsync(activity, () => new Dialogs.RootDialog());
                    }
                    break;

                case ActivityTypes.Message:
                    await Conversation.SendAsync(activity, () => new Dialogs.RootDialog());
                    break;
            }

            //if (activity is )
            //{
            //    await Conversation.SendAsync(activity, () => new Dialogs.RootDialog());
            //}

            //if (activity.Type == ActivityTypes.Message)
            //{
            //    await Conversation.SendAsync(activity, () => new Dialogs.RootDialog());
            //}
            //else if (activity.Type == ActivityTypes.ConversationUpdate)
            //{
            //    if (activity.MembersAdded.Any(m => m.Id == activity.Recipient.Id))
            //    {
            //        // Use the data stored previously to create the required objects.
            //        //var userAccount = new ChannelAccount(activity.From.Id, activity.From.Name);
            //        //var botAccount = new ChannelAccount(activity.Recipient.Id, activity.Recipient.Name);
            //        //var connector = new ConnectorClient(new Uri(activity.ServiceUrl));

            //        //var client = new ConnectorClient(new Uri(activity.ServiceUrl));

            //        //var reply = activity.CreateReply();
            //        //reply.Text = "Welcome to Game-A-Tron 3000™";

            //        //await client.Conversations.ReplyToActivityAsync(reply);

            //        await Conversation.SendAsync(activity, () => new Dialogs.RootDialog());
            //    }
            //}
            //else
            //{
            //    HandleSystemMessage(activity);
            //}

            //var response = Request.CreateResponse(HttpStatusCode.OK);
            //return response;

            return new HttpResponseMessage(HttpStatusCode.Accepted);
        }

        private Activity HandleSystemMessage(Activity message)
        {
            if (message.Type == ActivityTypes.DeleteUserData)
            {
                // Implement user deletion here
                // If we handle user deletion, return a real message
            }
            else if (message.Type == ActivityTypes.ConversationUpdate)
            {
                // Handle conversation state changes, like members being added and removed
                // Use Activity.MembersAdded and Activity.MembersRemoved and Activity.Action for info
                // Not available in all channels
            }
            else if (message.Type == ActivityTypes.ContactRelationUpdate)
            {
                // Handle add/remove from contact lists
                // Activity.From + Activity.Action represent what happened
            }
            else if (message.Type == ActivityTypes.Typing)
            {
                // Handle knowing tha the user is typing
            }
            else if (message.Type == ActivityTypes.Ping)
            {
            }

            return null;
        }
    }
}