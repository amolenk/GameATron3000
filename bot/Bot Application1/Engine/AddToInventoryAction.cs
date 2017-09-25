using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;

namespace Bot_Application1.Dialogs
{
    public class AddToInventoryAction : IAction
    {
        public AddToInventoryAction()
        {
        }

        public async Task<Activity> CreateReplyAsync(Activity activity, IDialogContext context)
        {
            var reply = activity.CreateReply();
            reply.Type = ActivityTypes.Message;
            reply.Text = "OK, inventory updated!";
            reply.From.Name = "player";

            context.ConversationData.SetValue("foo", "bar");

            return reply;
        }
    }
}