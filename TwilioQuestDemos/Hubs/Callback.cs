﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace TwilioQuestDemos.Hubs
{
    [HubName("callbackHub")]
    public class Callback : Hub
    {
    }
}