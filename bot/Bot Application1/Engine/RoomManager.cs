using Newtonsoft.Json.Linq;

namespace Bot_Application1.Dialogs
{
    public class RoomManager
    {
        private readonly string _id;
        private readonly JArray _objects;
        private readonly JArray _actors;

        public RoomManager(string id)
        {
            _id = id;
            _objects = new JArray();
            _actors = new JArray();
        }

        public void Add(RoomObject roomObject, int x, int y)
        {
            _objects.Add(JObject.FromObject(new
            {
                id = roomObject.Id,
                description = roomObject.Description,
                x = x,
                y = y
            }));
        }

        public void Add(Actor actor, int x, int y)
        {
            _actors.Add(JObject.FromObject(new
            {
                id = actor.Id,
                description = actor.Description,
                x = x,
                y = y
            }));
        }

        public JObject GetRoomDefinition()
        {
            return JObject.FromObject(new
            {
                roomId = _id,
                objects = _objects,
                actors = _actors
            });
        }
    }
}