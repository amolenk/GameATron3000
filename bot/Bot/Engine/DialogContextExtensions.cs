using System;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Newtonsoft.Json.Linq;

namespace GameATron3000.Bot.Engine
{
    public static class DialogContextExtensions
    {
        [Obsolete]
        public static Task PostMessageAsync(this IDialogContext context, string text)
        {
            var activity = ((Activity)context.Activity).CreateReply();
            activity.Type = ActivityTypes.Message;
            activity.Text = text;

            return context.PostAsync(activity);
        }

        [Obsolete]
        public static Task PostMessageAsync(this IDialogContext context, string text, string actorId)
        {
            var activity = ((Activity)context.Activity).CreateReply();
            activity.Type = ActivityTypes.Message;
            activity.Text = text;
            activity.From.Name = actorId;

            if (actorId != Actor.NarratorId)
            {
                activity.Properties = JObject.FromObject(new
                {
                    actorId
                });
            }

            return context.PostAsync(activity);
        }

        [Obsolete]
        public static Task PostEventAsync(
            this IDialogContext context,
            Event @event,
            JObject properties = null,
            Action<Activity> beforePost = null)
        {
            var activity = ((Activity)context.Activity).CreateReply();
            activity.Type = ActivityTypes.Event;
            activity.Name = @event.ToString();

            if (properties != null)
            {
                activity.Properties = properties;
            }

            beforePost?.Invoke(activity);

            return context.PostAsync(activity);
        }
    }
}