using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;

namespace GameATron3000.Bot.Engine.Actions
{
    public class TalkToAction : IAction
    {
        private readonly Actor _actor;
        private readonly string _topic;
        private readonly bool _turnedAway;

        public TalkToAction(Actor actor, string topic, bool turnedAway = false)
        {
            _actor = actor;
            _topic = topic;
            _turnedAway = turnedAway;
        }

        public Task<bool> ExecuteAsync(IDialogContext context, ResumeAfter<object> resume)
        {
            context.Call(new ConversationTree(_actor, _topic, _turnedAway), resume);

            return Task.FromResult(true);
        }
    }
}