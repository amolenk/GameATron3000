using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Bot_Application1.Dialogs;
using Microsoft.Bot.Builder.Dialogs;

namespace Bot_Application1.Engine
{
    public class Inventory
    {
        private readonly IDialogContext _context;

        public Inventory(IDialogContext context)
        {
            _context = context;
        }

        public bool Contains(RoomObject @object)
        {
            return _context.ConversationData.ContainsKey($"inv_{@object.Id}");
        }

        public IAction Add(RoomObject @object)
        {
            return new AddToInventoryAction(@object);
        }
    }
}