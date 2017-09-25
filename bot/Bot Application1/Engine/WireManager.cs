using System;
using System.Collections.Generic;
using System.Linq;
using Bot_Application1.Engine;
using Microsoft.Bot.Builder.Dialogs;

namespace Bot_Application1.Dialogs
{
    public class WireManager
    {
        private readonly Dictionary<string, Func<Inventory, IEnumerable<IAction>>> _wiredActions;

        public WireManager()
        {
            _wiredActions = new Dictionary<string, Func<Inventory, IEnumerable<IAction>>>();
        }

        public void LookAt(RoomObject roomObject, Func<Inventory, IAction> onExecute)
        {
            LookAt(roomObject, (i) => new[] { onExecute(i) });
        }

        public void LookAt(RoomObject roomObject, Func<Inventory, IEnumerable<IAction>> onExecute)
        {
            _wiredActions[$"look at {roomObject.Description}".ToLowerInvariant()] = onExecute;
        }

        public void PickUp(RoomObject roomObject, Func<Inventory, IAction> onExecute)
        {
            PickUp(roomObject, (i) => new[] { onExecute(i) });
        }

        public void PickUp(RoomObject roomObject, Func<Inventory, IEnumerable<IAction>> onExecute)
        {
            _wiredActions[$"pick up {roomObject.Description}".ToLowerInvariant()] = onExecute;
        }

        public IEnumerable<IAction> GetActions(string command, IDialogContext context)
        {
            var inventory = new Inventory(context);

            Func<Inventory, IEnumerable<IAction>> _actionFactory;
            if (_wiredActions.TryGetValue(command.ToLowerInvariant(), out _actionFactory))
            {
                return _actionFactory(inventory);
            }

            return Enumerable.Empty<IAction>();
        }
    }
}