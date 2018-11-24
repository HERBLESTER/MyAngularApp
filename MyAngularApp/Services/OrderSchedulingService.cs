using MyAngularApp.Business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyAngularApp.Services
{
    public class OrderSchedulingService
    {
        public OrderSchedulingService(IScheduleOrders scheduleOrders)
        {
            ScheduleOrders = scheduleOrders;
        }

        public IScheduleOrders ScheduleOrders { get; set; }
    }
}
