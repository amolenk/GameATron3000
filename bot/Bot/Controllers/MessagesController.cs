using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using GameATron3000.Bot.Engine;
using GameATron3000.Bot.Gameplay;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;

namespace GameATron3000.Bot.Controllers
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
            await Conversation.SendAsync(activity, () => new RootDialog(new Game()));

            return new HttpResponseMessage(HttpStatusCode.Accepted);
        }
    }
}