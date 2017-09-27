using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;

namespace GameATron3000.Bot.Engine
{
    public interface IAction
    {
        Task<bool> ExecuteAsync(IDialogContext context);
    }
}