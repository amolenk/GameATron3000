using GameATron3000.Bot.Engine;

namespace GameATron3000.Bot.Gameplay
{
    public static class RoomObjects
    {
        public static readonly RoomObject Newspaper = new RoomObject("newspaper", "newspaper");
        public static readonly RoomObject FullShoppingBag = new RoomObject("fullshoppingbag", "shopping bag");
        public static readonly RoomObject ClosedFridge = new RoomObject("fridge-closed", "fridge");
        public static readonly RoomObject EmptyFridge = new RoomObject("fridge-open-empty", "empty fridge");
        public static readonly RoomObject FullFridge = new RoomObject("fridge-open-full", "full fridge");
        public static readonly RoomObject TodoList = new RoomObject("todolist", "todo-list");
        public static readonly RoomObject TractorBeam = new RoomObject("tractorbeam", "tractor beam");
    }
}