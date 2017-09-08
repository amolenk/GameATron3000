//using System;
//using System.Collections.Generic;
//using System.Threading;
//using System.Threading.Tasks;
//using Microsoft.Bot.Builder.Dialogs;
//using Microsoft.Bot.Connector;

//namespace Bot_Application1.Dialogs
//{
//    [Serializable]
//    public class MainDialog : IDialog<object>
//    {
//        public Task StartAsync(IDialogContext context)
//        {
//            context.Wait(MessageReceivedAsync);

//            return Task.CompletedTask;
//        }

//        private async Task MessageReceivedAsync(IDialogContext context, IAwaitable<object> result)
//        {
//            var message = await result as IMessageActivity;


//            if (message.Text == "hi")
//            {
//                context.Call(new RootDialog(), ResumeAfterDialog);
//            }

//            // User typed something else; for simplicity, ignore this input and wait for the next message.
//            context.Wait(MessageReceivedAsync);
//        }

//        private async Task ResumeAfterDialog(IDialogContext context, IAwaitable<object> result)
//        {
//            // Store the value that NewOrderDialog returned. 
//            // (At this point, new order dialog has finished and returned some value to use within the root dialog.)
//            //            var resultFromNewOrder = await result;
////            await result;

//////            await context.PostAsync($"New order dialog just told me this: {resultFromNewOrder}");

////            // Again, wait for the next message from the user.
////            context.Wait(MessageReceivedAsync);
//        }
//    }
//}