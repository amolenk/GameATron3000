using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;

namespace GameATron3000.Bot.Engine.Actions
{
    public class TalkToAction : IAction
    {
        private readonly Actor _actor;
        private readonly string _topic;

        public TalkToAction(Actor actor, string topic)
        {
            _actor = actor;
            _topic = topic;
        }

        public Task<bool> ExecuteAsync(IDialogContext context, ResumeAfter<object> resume)
        {
            context.Call(new ConversationTree(_actor, _topic), resume);

            return Task.FromResult(true);
        }
    }
}