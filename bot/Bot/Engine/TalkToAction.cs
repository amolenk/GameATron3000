using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;

namespace GameATron3000.Bot.Engine
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
            context.Call(new ConversationTree(_topic), _resume);

            return Task.FromResult(true);
        }
    }
}