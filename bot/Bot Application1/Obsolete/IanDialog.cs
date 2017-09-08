//using System;
//using System.Threading.Tasks;
//using Microsoft.Bot.Builder.Dialogs;
//using Microsoft.Bot.Connector;

//namespace Bot_Application1.Dialogs
//{
//    [Serializable]
//    public class IanDialog : GameATron3000Dialog, IDialog<object>
//    {
//        public async Task StartAsync(IDialogContext context)
//        {
//            await context.PostAsync("Huh, what ... why are you bothering me?");
//            context.Wait(MessageReceivedAsync);
//        }

//        private async Task MessageReceivedAsync(IDialogContext context, IAwaitable<object> result)
//        {
//            var activity = await result as Activity;

//            if (activity is IMessageActivity message)
//            {
//                string text = message.Text.ToLower();

//                switch(text)
//                {
//                    case string s when (text.Contains("bye")):
//                        await context.PostAsync("That's right, better leave me alone, f#@%in' assclown!");
//                        context.Done("");
//                        break;

//                    case string s when (text.Contains("band")):
//                        await context.PostAsync("All bands suck balls!");
//                        context.Wait(this.MessageReceivedAsync);
//                        break;

//                    case string s when (text.Contains("mood")):
//                        await context.PostAsync("Shut up fool!");
//                        context.Wait(this.MessageReceivedAsync);
//                        break;

//                    case string s when (text.Contains("game")):
//                        await context.PostAsync("As if I have time to play games, are you crazy!?");
//                        context.Wait(this.MessageReceivedAsync);
//                        break;

//                    default:
//                        await context.PostAsync("Dude you talk sh!t. If you have nothing interesting to say, hit the road!!");
//                        context.Wait(this.MessageReceivedAsync);
//                        break;
//                }
//            }
//        }
//    }
//}