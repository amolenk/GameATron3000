namespace Bot_Application1.Dialogs
{
    public static class Player
    {
        public static IAction AddToInventory(RoomObject roomObject)
        {
            return new MessageAction(Actors.Narrator.Id, "Added to inventory", "player");
        }
    }
}