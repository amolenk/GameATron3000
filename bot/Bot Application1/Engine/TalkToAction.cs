using System.Threading.Tasks;
using Bot_Application1.Dialogs;
using Microsoft.Bot.Builder.Dialogs;

namespace Bot_Application1.Engine
{
    public class TalkToAction : IAction
    {
        private readonly string _topic;
        private readonly ResumeAfter<object> _resume;

        public TalkToAction(string topic, ResumeAfter<object> resume)
        {
            _topic = topic;
            _resume = resume;
        }

        public Task<bool> ExecuteAsync(IDialogContext context)
        {
            context.Call(new ConversationTreeDialog(_topic), _resume);

            return Task.FromResult(true);
        }
    }
}