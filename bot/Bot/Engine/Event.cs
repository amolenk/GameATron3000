namespace GameATron3000.Bot.Engine
{
    public sealed class Event
    {
        // Actor has moved to a different position.
        public const string ActorMoved = "ActorMoved";

        // Actor has turned, facing away from the camera.
        public const string ActorFacedAway = "ActorFacedAway";

        // Actor has turned, facing the camera.
        public const string ActorFacedFront = "ActorFacedFront";

        // Player has stopped looking closely at an object.
        public const string CloseUpClosed = "CloseUpClosed";

        // Player is looking closely at an object.
        public const string CloseUpOpened = "CloseUpOpened";

        // Scene is paused for the given delay.
        public const string Delayed = "Delayed";

        // Player has added an item to his/her's inventory.
        public const string InventoryItemAdded = "InventoryItemAdded";

        // Player has removed an item from his/her's inventory.
        public const string InventoryItemRemoved = "InventoryItemRemoved";

        // Player has entered a new room.
        public const string RoomEntered = "RoomEntered";

        // A new object has been added to the room.
        public const string RoomObjectAdded = "RoomObjectAdded";

        // An object is removed from the room.
        public const string RoomObjectRemoved = "RoomObjectRemoved";

        // Bot is waiting for input from client.
        public const string Idle = "Idle";
    }
}