using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Bot_Application1.Dialogs
{
    public interface IActionBuilder
    {
        IActionBuilder Say(string actorId, string text);

        IActionBuilder RemoveFromScene(string objectId);

        IActionBuilder SetState(string actorOrObjectId, string key, object value);

        IActionBuilder AddToInventory(string objectId);

        IActionBuilder UpdateObjectDescription(string objectId, string description);

        IActionBuilder WalkTo(object actorId, int x, int y);
    }
}