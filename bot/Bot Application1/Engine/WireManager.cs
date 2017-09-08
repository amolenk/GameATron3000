using System;
using System.Collections.Generic;
using System.Linq;

namespace Bot_Application1.Dialogs
{
    public class WireManager
    {
        private readonly Dictionary<string, Func<IEnumerable<IAction>>> _wiredActions;

        public WireManager()
        {
            _wiredActions = new Dictionary<string, Func<IEnumerable<IAction>>>();
        }

        public void LookAt(RoomObject roomObject, Func<IAction> onExecute)
        {
            LookAt(roomObject, () => new[] { onExecute() });
        }

        public void LookAt(RoomObject roomObject, Func<IEnumerable<IAction>> onExecute)
        {
            _wiredActions[$"look at {roomObject.Description}".ToLowerInvariant()] = onExecute;
        }

        public void PickUp(RoomObject roomObject, Func<IAction> onExecute)
        {
            PickUp(roomObject, () => new[] { onExecute() });
        }

        public void PickUp(RoomObject roomObject, Func<IEnumerable<IAction>> onExecute)
        {
            _wiredActions[$"pick up {roomObject.Description}".ToLowerInvariant()] = onExecute;
        }

        public IEnumerable<IAction> GetActions(string command)
        {
            Func<IEnumerable<IAction>> _actionFactory;
            if (_wiredActions.TryGetValue(command.ToLowerInvariant(), out _actionFactory))
            {
                return _actionFactory();
            }

            return Enumerable.Empty<IAction>();
        }
    }
}