using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using Autofac;
using System.Configuration;
using Microsoft.Bot.Connector;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Builder.Dialogs.Internals;
using Bot_Application1.Engine;

namespace Bot_Application1
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            //var store = new InMemoryBotState();
            //var storeKey = new object();

            GlobalConfiguration.Configure(WebApiConfig.Register);

            //Conversation.UpdateContainer(
            //    builder =>
            //    {
            //        builder.Register(c => store)
            //            .Keyed<IBotDataStore<BotData>>(storeKey)
            //            .AsSelf()
            //            .SingleInstance();

            //        builder.Register(c => new CachingBotDataStore(store,
            //            CachingBotDataStoreConsistencyPolicy.ETagBasedConsistency))
            //            .As<IBotDataStore<BotData>>()
            //            .AsSelf()
            //            .InstancePerLifetimeScope();
            //    });
        }
    }
}
