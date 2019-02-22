using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyAngularApp.Business;
using MyAngularApp.Controllers;
using MyAngularApp.Domain;
using MyAngularApp.Services;
using NUnit.Framework;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Results;
using static MyAngularApp.Controllers.OrdersController;

namespace Tests
{
    [TestFixture]
    public class TestOrderController
    {
        private OrdersController ordersController;
        private Context context;

        //[SetUp]
        public TestOrderController()
        {
            var builder = new DbContextOptionsBuilder<Context>()
             .UseInMemoryDatabase("dbContext").EnableSensitiveDataLogging();

            context = new Context(builder.Options);
            context.Customers.Add(new Customer { Id = 1, Name = "Cust" });
            context.Operations.Add(new Operation { Id = 1, Name = "Op" });
            context.Cities.Add(new City { Id = 1, Name = "City" });

            context.Orders.Add(new Order {
                Id = 99, CityId = 1, CustomerId = 1, OperationId = 1, Street = "123 Avenue", Notes = "Note" });

            int changed = context.SaveChanges();
            OrderSchedulingService scheduleService = new OrderSchedulingService(new ScheduleOrders(context));

            ordersController = new OrdersController(context, scheduleService);
        }

        [Test]
        public async Task TestGetAllOrders()
        {
            var result = await ordersController.GetAllOrders();

            OkObjectResult ok = (OkObjectResult)result.Result;
            IEnumerable<OrderVM> orderVMs = ok.Value as IEnumerable<OrderVM>;
            Assert.IsTrue(orderVMs.Count() == 1);
        }

        [Test]
        public async Task TestGetPagedOrders()
        {
            var result = await ordersController.GetPagedOrders(1, -1, "");

            OkObjectResult ok = (OkObjectResult)result.Result;
            IEnumerable<OrderVM> orderVMs = ok.Value as IEnumerable<OrderVM>;
            Assert.IsTrue(orderVMs.Count() == 1);
        }

        [Test]
        public async Task TestGetSearchList()
        {
            var result = await ordersController.GetSearchList("ven", -1);

            OkObjectResult ok = (OkObjectResult)result.Result;
            string[] terms = ok.Value as string[];
            Assert.IsTrue(terms.Count() == 1);
        }

        [Test]
        public async Task TestGet()
        {
            var result = await ordersController.Get(99);

            OkObjectResult ok = (OkObjectResult)result.Result;
            OrderVM order = ok.Value as OrderVM;
            Assert.IsInstanceOf<OrderVM>(order);
        }

        [Test]
        public async Task TestUpdateOrder()
        {
            var o = context.Orders.Find(99);
            OrderVM order = new OrderVM
            { status = Status.Cancelled,
                id = o.Id,
                cityId = o.CityId,
                customerId = o.CustomerId,
                operationId = o.OperationId,
                notes = o.Notes,
                street = o.Street
            };
            var result = await ordersController.UpdateOrder(99, order);

            OkObjectResult ok = (OkObjectResult)result.Result;
            order = ok.Value as OrderVM;
            Assert.IsInstanceOf<OrderVM>(order);
            Assert.IsTrue(order.status == Status.Cancelled);
        }

        [Test]
        public async Task TestNewOrder()
        {
            var o = context.Orders.Find(99);
            OrderVM order = new OrderVM
            {
                cityId = o.CityId,
                customerId = o.CustomerId,
                operationId = o.OperationId,
                notes = "New Order",
                street = o.Street
            };
            var result = await ordersController.NewOrder(order);

            CreatedAtActionResult ok = (CreatedAtActionResult)result.Result;
            order = ok.Value as OrderVM;
            Assert.IsInstanceOf<OrderVM>(order);
            Assert.IsTrue(order.status == Status.Received);
        }

        [Test]
        public async Task TestScheduleOrders()
        {
            var result = await ordersController.ScheduleOrders();

            OkObjectResult ok = (OkObjectResult)result.Result;
            var count = ok.Value as int?;
            
            Assert.IsTrue(count == 1);
        }
    }
}