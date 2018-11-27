using MyAngularApp.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MyAngularApp.Extensions;

namespace MyAngularApp.Business
{
    public class ScheduleOrders: IScheduleOrders
    {
        Context _context;
        int count = 0;

        public ScheduleOrders(Context context) {
            _context = context;
        }

        async public Task<int> Schedule()
        {
            await _context.Orders.
                Where(o => o.Status == Status.Received && DateTime.Now.Subtract(o.DateReceived).Days > 1)
                .ToList().ForEachAsync(o => SetScheduled(o));

            return this.count;
        }

        async private Task SetScheduled(Order order)
        {
            Order o = _context.Orders.Find(order.Id);
            o.Status = Status.Scheduled;
            o.DateScheduled = DateTime.Now;
            await _context.SaveChangesAsync();
            this.count++;
        }
    }
}
