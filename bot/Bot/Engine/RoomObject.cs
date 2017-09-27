namespace GameATron3000.Bot.Engine
{
    public class RoomObject
    {
        public RoomObject(string id, string description)
        {
            Id = id;
            Description = description;
        }

        public string Id { get; private set; }

        public string Description { get; private set; }
    }
}