using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Bot_Application1.Dialogs
{
    public interface IVerbs
    {
        ISimpleAction PickUp(string objectId);

        IGiveVerb Give(string inventoryItemId);
    }
}