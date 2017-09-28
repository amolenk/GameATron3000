﻿using System;
using System.Collections.Generic;
using System.Linq;

namespace GameATron3000.Bot.Engine
{
    public class WireManager
    {
        private readonly Dictionary<string, Func<GameState, IEnumerable<IAction>>> _wiredActions;

        public WireManager()
        {
            _wiredActions = new Dictionary<string, Func<GameState, IEnumerable<IAction>>>();
        }

        public void LookAt(RoomObject roomObject, Func<GameState, IAction> onExecute)
        {
            LookAt(roomObject, (state) => new[] { onExecute(state) });
        }

        public void LookAt(RoomObject roomObject, Func<GameState, IEnumerable<IAction>> onExecute)
        {
            _wiredActions[$"look at {roomObject.Description}".ToLowerInvariant()] = onExecute;
        }

        public void PickUp(RoomObject roomObject, Func<GameState, IAction> onExecute)
        {
            PickUp(roomObject, (state) => new[] { onExecute(state) });
        }

        public void PickUp(RoomObject roomObject, Func<GameState, IEnumerable<IAction>> onExecute)
        {
            _wiredActions[$"pick up {roomObject.Description}".ToLowerInvariant()] = onExecute;
        }

        public void Open(RoomObject roomObject, Func<GameState, IEnumerable<IAction>> onExecute)
        {
            _wiredActions[$"open {roomObject.Description}".ToLowerInvariant()] = onExecute;
        }

        public void Close(RoomObject roomObject, Func<GameState, IEnumerable<IAction>> onExecute)
        {
            _wiredActions[$"close {roomObject.Description}".ToLowerInvariant()] = onExecute;
        }

        public void Use(RoomObject use, RoomObject with, Func<GameState, IEnumerable<IAction>> onExecute)
        {
            _wiredActions[$"use {use.Description} with {with.Description}".ToLowerInvariant()] = onExecute;
        }

        public void TalkTo(Actor actor, Func<GameState, IAction> onExecute)
        {
            TalkTo(actor, (state) => new[] { onExecute(state) });
        }

        public void TalkTo(Actor actor, Func<GameState, IEnumerable<IAction>> onExecute)
        {
            _wiredActions[$"talk to {actor.Description}".ToLowerInvariant()] = onExecute;
        }

        public IEnumerable<IAction> GetActions(string command, GameState gameState)
        {
            Func<GameState, IEnumerable<IAction>> _actionFactory;
            if (_wiredActions.TryGetValue(command.ToLowerInvariant(), out _actionFactory))
            {
                return _actionFactory(gameState);
            }

            return Enumerable.Empty<IAction>();
        }
    }
}