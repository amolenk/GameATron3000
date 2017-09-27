namespace GameATron3000.Bot.Engine
{
    public enum Event
    {
        // Actor has moved to a different position.
        ActorMoved,

        // Player has stopped looking closely at an object.
        CloseUpClosed,

        // Player is looking closely at an object.
        CloseUpOpened,

        // Scene is paused for the given delay.
        Delayed,

        // Player has added an item to his/her's inventory.
        InventoryItemAdded,

        // Player has entered a new room.
        RoomEntered,

        // A new object has been added to the room.
        RoomObjectAdded,

        // Bot is waiting for input from client.
        Idle
    }
}