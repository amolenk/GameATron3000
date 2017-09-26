using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;

namespace Bot_Application1.Dialogs
{
    public class AddToInventoryAction : IAction
    {
        private readonly RoomObject _object;

        public AddToInventoryAction(RoomObject @object)
        {
            _object = @object;
        }

        public Task ExecuteAsync(Activity activity, IDialogContext context, ResumeAfter<object> resume)
        {
            var reply = activity.CreateReply();
            reply.Type = ActivityTypes.Message;
            reply.Text = "OK, inventory updated!";
            reply.From.Name = "player";

            context.ConversationData.SetValue($"inv_{_object.Id}", true);

            return context.PostAsync(reply);
        }
    }
}