using GameATron3000.Bot.Engine;

namespace GameATron3000.Bot.Gameplay
{
    public static class RoomObjects
    {
        public static readonly RoomObject Newspaper = new RoomObject("newspaper", "newspaper");
        public static readonly RoomObject FullShoppingBag = new RoomObject("fullshoppingbag", "shopping bag");
        public static readonly RoomObject Refrigerator = new RoomObject("refrigerator", "fridge");
        public static readonly RoomObject RefrigeratorOpenEmpty = new RoomObject("refrigerator-open-empty", "fridge");
        public static readonly RoomObject RefrigeratorOpenFull = new RoomObject("refrigerator-open-full", "fridge");
        public static readonly RoomObject SnatchList = new RoomObject("snatchlist", "snatchlist");
        public static readonly RoomObject TractorBeam = new RoomObject("tractorbeam", "tractor beam");
    }
}