using MyAngularApp.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyAngularApp.Business
{
    public interface IScheduleOrders
    {
        Task<int> Schedule();
    }
}
