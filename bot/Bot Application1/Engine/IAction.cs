using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;

namespace Bot_Application1.Dialogs
{
    public interface IAction
    {
        Task ExecuteAsync(Activity activity, IDialogContext context, ResumeAfter<object> resume);
    }
}