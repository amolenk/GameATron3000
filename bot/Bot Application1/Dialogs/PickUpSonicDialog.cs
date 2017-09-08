using System;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using System.Collections.Generic;

namespace Bot_Application1.Dialogs
{
    [Serializable]
    public class PickUpSonicDialog : GameATron3000Dialog, IDialog<object>
    {
        public async Task StartAsync(IDialogContext context)
        {
            await Say(Actors.Narrator, "Nice! It's a Sonic the Hedgehog action figure!", context);

            //await AddToInventory(Objects.SonicActionFigure, context);

            //await UpdateObjectDescriptionAsync(Objects.SonicActionFigure, "Sonic the Hedgehog action figure", context);

            await Say(Actors.Narrator, "Oooh! Collector's edition!", context);

            await Say(Actors.Guybrush, "Hey!\nWhere did my Sonic action figure go?", context);

            context.Done(true);

            //return Task.CompletedTask;
        }
    }
}