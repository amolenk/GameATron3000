using Newtonsoft.Json.Linq;
using System.Drawing;

namespace GameATron3000.Bot.Engine
{
    public class RoomDefinition
    {
        private readonly JArray _objects;
        private readonly JArray _actors;

        public RoomDefinition(string id)
        {
            Id = id;

            _objects = new JArray();
            _actors = new JArray();
        }

        public string Id { get; private set; }

        public void Add(RoomObject roomObject, int x, int y)
        {
            _objects.Add(JObject.FromObject(new
            {
                id = roomObject.Id,
                description = roomObject.Description,
                x,
                y
            }));
        }

        public void Add(Actor actor, int x, int y)
        {
            _actors.Add(JObject.FromObject(new
            {
                id = actor.Id,
                description = actor.Description,
                x,
                y,
                textColor = actor.TextColor
            }));
        }

        public JObject ToJObject()
        {
            return JObject.FromObject(new
            {
                roomId = Id,
                objects = _objects,
                actors = _actors
            });
        }
    }
}