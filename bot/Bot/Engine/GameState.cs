using Microsoft.Bot.Builder.Dialogs;

namespace GameATron3000.Bot.Engine
{
    public class GameState
    {
        private readonly IDialogContext _context;

        public GameState(IDialogContext context)
        {
            _context = context;
        }

        public void AddInventoryItem(RoomObject @object)
        {
            var key = GetKeyForInventoryItem(@object.Id);

            SetValue(key, true);
        }

        public bool Contains(string key)
        {
            return _context.ConversationData.ContainsKey(key);
        }

        public bool ContainsInventoryItem(RoomObject @object)
        {
            var key = GetKeyForInventoryItem(@object.Id);

            return Contains(key);
        }

        public void RemoveInventoryItem(RoomObject @object)
        {
            var key = GetKeyForInventoryItem(@object.Id);

            RemoveValue(key);
        }

        public void RemoveValue(string key)
        {
            _context.ConversationData.RemoveValue(key);
        }

        public void SetValue<T>(string key, T value)
        {
            _context.ConversationData.SetValue(key, value);
        }

        private static string GetKeyForInventoryItem(string objectId)
        {
            return $"inventory:{objectId}";
        }
    }
}