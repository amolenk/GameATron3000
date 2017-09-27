namespace GameATron3000.Bot.Engine
{
    public enum Event
    {
        // Actor has moved to a different position.
        ActorMoved,

        // Player has entered a new room.
        RoomEntered,

        // Bot is waiting for input from client.
        Idle
    }
}