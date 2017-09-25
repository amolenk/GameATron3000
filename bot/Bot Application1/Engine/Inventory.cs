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
            return _context.ConversationData.ContainsKey(@object.Id);
        }

        public void Add(RoomObject @object)
        {
            _context.ConversationData.SetValue(@object.Id, true);
        }

        // TODO GetKey method with inventory: prefix
    }
}