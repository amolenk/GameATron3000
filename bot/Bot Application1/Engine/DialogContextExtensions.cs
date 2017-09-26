using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Bot_Application1.Dialogs;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Newtonsoft.Json.Linq;

namespace Bot_Application1.Engine
{
    public static class DialogContextExtensions
    {
        public static Task PostMessageAsync(this IDialogContext context, string text)
        {
            var activity = ((Activity)context.Activity).CreateReply();
            activity.Type = ActivityTypes.Message;
            activity.Text = text;
            //            reply.From.Name = _from;

            return context.PostAsync(activity);
        }

        public static Task PostEventAsync(this IDialogContext context, Event @event, JObject properties = null)
        {
            var activity = ((Activity)context.Activity).CreateReply();
            activity.Type = ActivityTypes.Event;
            activity.Name = @event.ToString();
            //            reply.From.Name = _from;

            if (properties != null)
            {
                activity.Properties = properties;
            }

            return context.PostAsync(activity);
        }
    }
}