﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Bot_Application1.Dialogs
{
    public interface ISimpleAction
    {
        ISimpleAction Then();
    }
}