using System;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace Bot_Application1.Dialogs
{
    [Serializable]
    public class RootDialog : GameATron3000Dialog, IDialog<object>
    {
        public async Task StartAsync(IDialogContext context)
        {
            var activity = (Activity)context.Activity;

            var reply = activity.CreateReply();
            reply.Text = "You are standing in a remote village. There's a blue hedgehog lying on the ground.";
            reply.Properties = JObject.FromObject(new
            {
                roomId = "village",
                complete = true,
                objects = new[]
                {
                    new
                    {
                        id = "sonic",
                        text = "blue hedgehog",
                        x = 450,
                        y = 400
                    }
                }
            });

            await context.PostAsync(reply);


            context.Wait(MessageReceivedAsync);

//            return Task.CompletedTask;
        }

        //        public async Task StartAsync(IDialogContext context)
        //        {
        //            if (_initialMessage)
        //            {
        //                await Say(Actors.Narrator, "You are in a UFO. There's a blue hedgehog on the floor.", context);
        //                _initialMessage = false;
        //            }

        //            //reply.Entities.Add(new Entity("actor")
        //            //{
        //            //    Properties = JObject.FromObject(new
        //            //    {
        //            //        actorId = "guybrush",
        //            //        x = 100,
        //            //        y = 200
        //            //    })
        //            //});
        //            //reply.Entities.Add(new Entity("actor")
        //            //{
        //            //    Properties = JObject.FromObject(new
        //            //    {
        //            //        actorId = "guybrush",
        //            //        x = 100,
        //            //        y = 200
        //            //    })
        //            //});
        //            //reply.Entities.Add(new Entity("room")
        //            //{
        //            //    Properties = JObject.FromObject(new
        //            //    {
        //            //        actors = new[]
        //            //        {
        //            //            new
        //            //            {
        //            //                actorId = "guybrush",
        //            //                x = 100,
        //            //                y = 200
        //            //            },
        //            //            new
        //            //            {
        //            //                actorId = "guybrush",
        //            //                x = 100,
        //            //                y = 200
        //            //            }
        //            //        }
        //            //    })
        //            //});

        //            //await context.PostAsync(reply);

        ////            await Say(Actors.Narrator, "Hi", context);

        //            context.Wait(MessageReceivedAsync);

        //            //return Task.CompletedTask;
        //        }

        private async Task MessageReceivedAsync(IDialogContext context, IAwaitable<object> result)
        {
            var activity = (Activity)await result;

            if (activity.Type == ActivityTypes.Message)
            {
                switch (activity.Text.ToLower())
                {
                    case "look at blue hedgehog":
                        var e = activity.CreateReply();
                        e.Type = ActivityTypes.Message;
                        e.Text = "It's a blue hedgehog.";
                        await context.PostAsync(e);
                        context.Wait(MessageReceivedAsync);
                        break;

                    case "pick up blue hedgehog":
                        context.Call(new PickUpSonicDialog(), ResumeAfterAlorIanDialog);
                        break;

                    case string text when (text.Contains("talk to al")):
                        context.Call(new AlDialog(), this.ResumeAfterAlorIanDialog);
                        break;

                    case string text when (text.Contains("talk to ian")):
                        context.Call(new IanDialog(), this.ResumeAfterAlorIanDialog);
                        break;

                    default:
                        await context.PostAsync("I don't understand you. Maybe Al knows what you're talking about.");
                        context.Wait(MessageReceivedAsync);
                        break;
                }
            }
        }

        private async Task ResumeAfterAlorIanDialog(IDialogContext context, IAwaitable<object> result)
        {
            await context.PostAsync("Hey welcome back! As you might remember: I'm Root. What do you want to know?");
            context.Wait(this.MessageReceivedAsync);
        }
    }
}