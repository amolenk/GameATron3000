using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;

namespace GameATron3000.Bot.Engine.Actions
{
    public class TalkToAction : IAction
    {
        private readonly string _actorId;
        private readonly string _topic;
        private readonly bool _turnedAway;

        public TalkToAction(string actorId, string topic, bool turnedAway = false)
        {
            _actorId = actorId;
            _topic = topic;
            _turnedAway = turnedAway;
        }

        public Task<bool> ExecuteAsync(IDialogContext context, ResumeAfter<object> resume)
        {
            context.Call(new ConversationTree(_actorId, _topic, _turnedAway), resume);

            return Task.FromResult(true);
        }
    }
}