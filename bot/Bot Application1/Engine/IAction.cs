using Microsoft.Bot.Connector;

namespace Bot_Application1.Dialogs
{
    public interface IAction
    {
        Activity CreateReply(Activity activity);
    }
}