using System.Threading.Tasks;
using Bot_Application1.Dialogs;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;

namespace Bot_Application1.Engine
{
    public class TalkToAction : IAction
    {
        public TalkToAction(string topic)
        {

        }

        public Task ExecuteAsync(Activity activity, IDialogContext context, ResumeAfter<object> resume)
        {
            context.Call(new ConversationTreeDialog(), resume);

            return Task.CompletedTask;
        }
    }
}