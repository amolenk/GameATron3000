using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Builder.Dialogs.Internals;
using Microsoft.Bot.Connector;
using Newtonsoft.Json;

namespace Bot_Application1.Engine
{
    public class InMemoryBotState : IBotDataStore<BotData>
    {
        private readonly Dictionary<string, string> _state;

        public InMemoryBotState()
        {
            _state = new Dictionary<string, string>();
        }

        public Task<BotData> LoadAsync(IAddress key, BotStoreType botStoreType, CancellationToken cancellationToken)
        {
            BotData result;
            var dictionaryKey = GetDictionaryKey(key, botStoreType);
            string json;

            if (_state.TryGetValue(dictionaryKey, out json))
            {
                result = new BotData(eTag: string.Empty, data: JsonConvert.DeserializeObject(json));
            }
            else
            {
                result = new BotData(eTag: string.Empty, data: null);
            }

            return Task.FromResult(result);
        }

        public Task SaveAsync(IAddress key, BotStoreType botStoreType, BotData data, CancellationToken cancellationToken)
        {
            var dictionaryKey = GetDictionaryKey(key, botStoreType);
            var json = JsonConvert.SerializeObject(data);

            _state[dictionaryKey] = json;

            return Task.CompletedTask;
        }

        public Task<bool> FlushAsync(IAddress key, CancellationToken cancellationToken)
        {
            return Task.FromResult(true);
        }

        private static string GetDictionaryKey(IAddress key, BotStoreType botStoreType)
        {
            switch (botStoreType)
            {
                case BotStoreType.BotConversationData:
                    return $"{key.ChannelId}:conversation:{key.ConversationId}";

                case BotStoreType.BotUserData:
                    return $"{key.ChannelId}:user:{key.UserId}";

                case BotStoreType.BotPrivateConversationData:
                    return $"{key.ChannelId}:private:{key.ConversationId}:{key.UserId}";

                default:
                    throw new ArgumentException("Unsupported bot store type!");
            }
        }
    }
}