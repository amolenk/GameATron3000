﻿using GameATron3000.Bot.Engine;

namespace GameATron3000.Bot.Gameplay
{
    public static class Actors
    {
        public static readonly Actor Narrator = new Actor(Actor.NarratorId, "Narrator");
        public static readonly Actor Guy = new Actor(Actor.PlayerId, "Guy Scotthrie");
        public static readonly Actor Al = new Actor("al", "Al", "#92F6F0");
        public static readonly Actor Ian = new Actor("ian", "Ian", "Yellow");
    }
}