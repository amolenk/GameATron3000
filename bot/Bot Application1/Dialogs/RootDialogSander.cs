using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;

namespace Bot_Application1.Dialogs
{
    [Serializable]
    public class RootDialog2 : IDialog<object> // GameATron3000Dialog(tm)
    {
        public async Task StartAsync(IDialogContext context)
        {
            await Say(Actors.Narrator, "Nice! It's a Sonic the Hedgehog action figure!", context);

            // Combine into single AddToInventory action?
            //.RemoveFromScene(Objects.SonicActionFigure)
            //.SetState(Objects.SonicActionFigure, "pickedUp", true)
            //.AddToInventory(Objects.SonicActionFigure)

            //.UpdateObjectDescription(Objects.SonicActionFigure, "Sonic the Hedgehog action figure")

            //.Say(Actors.Narrator, "Oooh! Collector's edition!")

            //.WalkTo(Actors.Guybrush, 150, 430)

            //.Say(Actors.Guybrush, "Hey!\nWhere did my Sonic action figure go?");

//            return Task.CompletedTask;
        }

        private Task Say(string actorId, string text, IDialogContext context)
        {
            var activity = Activity.CreateMessageActivity();
            activity.Text = text;
            activity.Value = actorId;

            return context.PostAsync(activity);
        }


        private async Task MessageReceivedAsync(IDialogContext context, IAwaitable<object> result)
        {
            var message = await result as IMessageActivity;

            //context.

            if (message.Text == "hi")
            {
                await context.Forward(new GraphDialog<object>(), ResumeAfterDialog, message, CancellationToken.None);
            }

            // User typed something else; for simplicity, ignore this input and wait for the next message.
            context.Wait(MessageReceivedAsync);
        }

        private async Task ResumeAfterDialog(IDialogContext context, IAwaitable<object> result)
        {
            // Store the value that NewOrderDialog returned. 
            // (At this point, new order dialog has finished and returned some value to use within the root dialog.)
            //            var resultFromNewOrder = await result;
            await result;

//            await context.PostAsync($"New order dialog just told me this: {resultFromNewOrder}");

            // Again, wait for the next message from the user.
            context.Wait(MessageReceivedAsync);
        }




//        private void WireUp()
//        {

//        }


//        private void WireAction()
//        {
//            WireManager.PickUp(Objects.SonicActionFigure, (actionBuilder) =>
//            {
//                if (true)
////                if (!stateManager.getState("sonicPickedUp"))
//                {
//                    actionBuilder
//                        .Say(Actors.Narrator, "Nice! It's a Sonic the Hedgehog action figure!")

//                        // Combine into single AddToInventory action?
//                        .RemoveFromScene(Objects.SonicActionFigure)
//                        .SetState(Objects.SonicActionFigure, "pickedUp", true)
//                        .AddToInventory(Objects.SonicActionFigure)

//                        .UpdateObjectDescription(Objects.SonicActionFigure, "Sonic the Hedgehog action figure")

//                        .Say(Actors.Narrator, "Oooh! Collector's edition!")

//                        .WalkTo(Actors.Guybrush, 150, 430)

//                        .Say(Actors.Guybrush, "Hey!\nWhere did my Sonic action figure go?");
//                }
//            });
//        }


//        //this.wireAction(Action.PickUpVerb, Objects.Sonic, () => {
//        //    if (!Objects.Sonic.getState("pickedUp"))
//        //    {
//        //        return this.narrator.say("Nice! It's a Sonic the Hedgehog action figure!")
//        //        .then(() => this.remove(Objects.Sonic))
//        //        .then(() => Objects.Sonic.setState("pickedUp", true))
//        //        .then(() => Objects.Sonic.displayName = "Sonic the Hedgehog action figure")
//        //        .then(() => this.addToInventory(InventoryItems.Sonic))
//        //        .then(() => this.narrator.say("Oooh! Collector's edition!"))
//        //        .then(() => Actors.Guybrush.walkTo(150, 430))
//        //        .then(() => Actors.Guybrush.say("Hey!\nWhere did my Sonic action figure go?"));
//        //    }
//        //    else
//        //    {
//        //        return this.remove(Objects.Sonic)
//        //        .then(() => this.addToInventory(InventoryItems.Sonic))
//        //        .then(() => Actors.Guybrush.walkTo(85, 430))
//        //        .then(() => Actors.Guybrush.say("Not again!"))
//        //        .then(() => Actors.Guybrush.walkTo(150, 430))
//        //        .then(() => Actors.Guybrush.say("There are too many pirates on this island!"));
//        //    }
//        //});
    }
}