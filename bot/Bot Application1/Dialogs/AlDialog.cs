using System;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using System.Collections.Generic;

namespace Bot_Application1.Dialogs
{
    [Serializable]
    public class AlDialog : GameATron3000Dialog, IDialog<object>
    {
        List<string> _inventory = new List<string>();

        public async Task StartAsync(IDialogContext context)
        {

            await Say("Al", "What's up, I'm Al. How can I help you?", context);

//            await context.PostAsync("What's up, I'm Al. How can I help you?");
            context.Wait(MessageReceivedAsync);
        }

        private async Task MessageReceivedAsync(IDialogContext context, IAwaitable<object> result)
        {
            var activity = await result as Activity;

            //List<object> inventory = await GetInventory(activity);




            if (activity is IMessageActivity message)
            {
                string text = message.Text.ToLower();

                switch(text)
                {
                    case string s when (text.Contains("bye")):
                        await context.PostAsync("Ok, later dude!");
                        context.Done("");
                        break;

                    case string s when (text.Contains("band")):
                        await context.PostAsync("Nirvana all the way!");
                        context.Wait(this.MessageReceivedAsync);
                        break;

                    case string s when (text.Contains("mood")):
                        await context.PostAsync("Rasta man vibrations yeah, positive.");
                        context.Wait(this.MessageReceivedAsync);
                        break;

                    case string s when (text.Contains("game")):
                        await context.PostAsync("Nothing beats Day of the Tentacle!");
                        context.Wait(this.MessageReceivedAsync);
                        break;

                    case string s when (text.Contains("alone")):
                        await context.PostAsync("No I'm with my buddy Ian. We form the dynamic duo Alian. Ian say hi to Guy!");
                        context.Call(new IanDialog(), this.ResumeAfterIanDialog);
                        break;

                    default:
                        await context.PostAsync("You realy have to articulate better. Al hasno clue what you're saying!");
                        context.Wait(this.MessageReceivedAsync);
                        break;
                }
            }
        }

        private async Task ResumeAfterIanDialog(IDialogContext context, IAwaitable<object> result)
        {
            await context.PostAsync("Yeah I know, Ian can be a bit grumpy at times. Welcome back!");
            context.Wait(this.MessageReceivedAsync);
        }
    }
}