using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyAngularApp.Domain;
using MyAngularApp.Services;

namespace MyAngularApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly Context _context;
        OrderSchedulingService _scheduleService;

        public OrdersController(Context context, OrderSchedulingService scheduleService)
        {
            _context = context;
            _scheduleService = scheduleService;
        }

        [Route("~/api/Orders/Getallorders")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderVM>>> GetAllOrders()
        {
            IQueryable<OrderVM> orderVMs = _context.Orders.Include("Customer").Include("City").Include("Operation")
                .Select(o => new OrderVM {
                id = o.Id,
                cityName = o.City.Name,
                customerName = o.Customer.Name,
                dateReceived = o.DateReceived,
                notes = o.Notes,
                operationName = o.Operation.Name,
                status = o.Status,
                street = o.Street
            }).OrderByDescending(o => o.dateReceived);

            if (orderVMs.Count() > 0)
            {
                IEnumerable<OrderVM> orders = await orderVMs.ToListAsync();
                return Ok(orders);
            }
            else
            {
                return NotFound();
            }
        }

        [Route("~/api/Orders/GetPagedorders")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderVM>>> GetPagedOrders(
            [FromQuery(Name = "page")]int pageNumber, 
            [FromQuery(Name = "status")]int statusCode,
            [FromQuery(Name = "searchTerm")]string searchTerm)
        {
            int orderCount = 0;
            IQueryable<Order> orders = _context.Orders;

            if (searchTerm != null && searchTerm.TrimStart().Length > 0)
            {
                orders = this.GetSearchQuery(searchTerm);
            }

            if (statusCode != -1)
            {
                orders = orders.Where(o => (int)o.Status == statusCode);
            }

            orderCount = await orders.CountAsync();

            switch ((Status)statusCode)
            {
                case Status.Received:
                    orders = orders.OrderByDescending(o => o.DateReceived);
                    break;
                case Status.Scheduled:
                    orders = orders.OrderByDescending(o => o.DateScheduled);
                    break;
                //case Status.enRoute:
                //    break;
                case Status.Cancelled:
                    orders = orders.OrderByDescending(o => o.DateCancelled);
                    break;
                case Status.Completed:
                    orders = orders.OrderByDescending(o => o.DateCompleted);
                    break;
                default:
                    orders = orders.OrderByDescending(o => o.DateReceived);
                    break;
            }

            OrderVM[] model = await orders.Include("Customer").Include("City").Include("Operation").
                Skip(10 * (pageNumber - 1)).Take(10)
                .Select(o => new OrderVM
                {
                    id = o.Id,
                    cityName = o.City.Name,
                    customerName = o.Customer.Name,
                    dateReceived = o.DateReceived,
                    notes = o.Notes,
                    operationName = o.Operation.Name,
                    status = o.Status,
                    street = o.Street,
                    asset = o.Asset,
                    cancelled = o.DateCancelled,
                    completed = o.DateCompleted,
                    installerComments = o.InstallerComments,
                    scheduled = o.DateScheduled
                }).ToArrayAsync();
           
            if (model.Count() > 0)
            {
                model[0].orderCount = orderCount;
            }

            return Ok(model);
        }

        [Route("~/api/Orders/GetSearchList")]
        [HttpGet]
        public async Task<ActionResult<string[]>> GetSearchList([FromQuery(Name = "searchInput")]string searchInput, [FromQuery(Name = "status")] int statusCode)
        {
            string[] results;
            if (searchInput.TrimStart().Length > 0) {

                IQueryable<Order> baseQuery = _context.Orders;
                if (statusCode != -1)
                {
                    baseQuery = baseQuery.Where(o => (int)o.Status == statusCode);
                }

                IQueryable<string> searchTerms =
                    baseQuery.Where(o => o.Street.Contains(searchInput)).Select(o => o.Street).
                    Union(baseQuery.Include("Customer").Where(o => o.Customer.Name.Contains(searchInput)).Select(o => o.Customer.Name)).
                    Union(baseQuery.Include("City").Where(o => o.City.Name.Contains(searchInput)).Select(o => o.City.Name)).
                    Union(baseQuery.Where(o => o.Notes.Contains(searchInput)).Select(o => o.Notes));

                int id = 0;
                if(int.TryParse(searchInput, out id))
                {
                    searchTerms = searchTerms.Union(baseQuery.Where(o => o.Id.ToString().Contains(searchInput)).Select(o => o.Id.ToString()));
                }

                DateTime received;
                if(DateTime.TryParse(searchInput, out received))
                {
                    searchTerms = searchTerms.Union(baseQuery.Where(o => 
                    o.DateReceived.ToString("d").Contains(searchInput)).Select(o => o.DateReceived.ToString("d")));
                }

                

                results = await searchTerms.Take(10).ToArrayAsync();
                return Ok(results);
            }
            else
            {
                return BadRequest("Invalid search input");
            }
        }
      
        [HttpGet("{orderId}")]
        public async Task<ActionResult<OrderVM>> Get(int orderId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Order o = await _context.Orders.Include("Customer").Include("City").Include("Operation").FirstOrDefaultAsync<Order>(oo => oo.Id == orderId);
            if (o == null)
            {
                return NotFound();
            }

            OrderVM order = new OrderVM
            {
                id = o.Id,
                cityId = o.CityId,
                cityName = o.City.Name,
                customerId = o.CustomerId,
                customerName = o.Customer.Name,
                dateReceived = o.DateReceived,
                notes = o.Notes,
                operationId = o.OperationId,
                operationName = o.Operation.Name,
                status = o.Status,
                street = o.Street
            };

            return Ok(order);
        }

        // PUT: api/Orders/5
        [HttpPut("{id}")]
        public async Task<ActionResult<OrderVM>> UpdateOrder([FromRoute] int id, [FromBody] OrderVM orderVM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != orderVM.id)
            {
                return BadRequest();
            }

            Order order = await _context.Orders.FindAsync(orderVM.id);

            if (orderVM.status != order.Status && orderVM.status == Status.Cancelled)
            {
                order.DateCancelled = DateTime.Now;
            }

            order.Id = orderVM.id;
            order.CityId = orderVM.cityId;
            order.CustomerId = orderVM.customerId;
            order.Notes = orderVM.notes;
            order.OperationId = orderVM.operationId;
            order.Status = orderVM.status;
            order.Street = orderVM.street;

            _context.Entry(order).State = EntityState.Modified;
            //_context.MarkAsModified(order);
            
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            order = await _context.Orders.Include("Customer").Include("City").Include("Operation").FirstOrDefaultAsync<Order>(oo => oo.Id == order.Id);
            if (order == null)
            {
                return NotFound();
            }

            orderVM = new OrderVM
            {
                id = order.Id,
                cityId = order.CityId,
                cityName = order.City.Name,
                customerId = order.CustomerId,
                customerName = order.Customer.Name,
                dateReceived = order.DateReceived,
                notes = order.Notes,
                operationId = order.OperationId,
                operationName = order.Operation.Name,
                status = order.Status,
                street = order.Street
            };

            return Ok(orderVM);
        }

        [HttpPost]
        [Route("~/api/Orders/NewOrder")]
        public async Task<ActionResult<OrderVM>> NewOrder([FromBody] OrderVM orderVM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Order order = new Order
            {
                CityId = orderVM.cityId,
                CustomerId = orderVM.customerId,
                DateReceived = DateTime.Now,
                Notes = orderVM.notes,
                OperationId = orderVM.operationId,
                Status = Status.Received,
                Street = orderVM.street
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            order = await _context.Orders.Include("Customer").Include("City").Include("Operation").FirstOrDefaultAsync<Order>(oo => oo.Id == order.Id);
            if (order == null)
            {
                return NotFound();
            }

            orderVM = new OrderVM
            {
                id = 2,
                cityName = order.City.Name,
                customerName = order.Customer.Name,
                dateReceived = order.DateReceived,
                notes = order.Notes,
                operationName = order.Operation.Name,
                status = order.Status,
                street = order.Street
            };

            return CreatedAtAction("NewOrder", new { orderVM.id }, orderVM);
        }

        [HttpPost]
        [Route("~/api/Orders/ScheduleOrders")]
        public async Task<ActionResult<int>> ScheduleOrders()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            int count = 0;

            try
            {
                count = await _scheduleService.ScheduleOrders.Schedule();
            }
            catch(Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }

            return Ok( count );
        }

        [HttpPost]
        [Route("~/api/Orders/CompleteOrder")]
        public async Task<IActionResult> CompleteOrder([FromBody] CompletedOrderVM completedOrderVM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Order order = await _context.Orders.FindAsync(completedOrderVM.OrderId);
            if(order == null)
            {
                return NotFound();
            }

            order.Status = Status.Completed;
            order.DateCompleted = completedOrderVM.Completed;
            order.InstallerComments = completedOrderVM.Comments;
            order.Asset = completedOrderVM.Asset;

            _context.Entry(order).State = EntityState.Modified;
            //_context.MarkAsModified(order);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(order.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(completedOrderVM);
        }

        public class CompletedOrderVM
        {
            public int OrderId { get; set; }
            public string Comments { get; set; }
            public DateTime Completed { get; set; }
            public string Asset { get; set; }
        }

        public class OrderVM
        {
            public int id;
            public int customerId;
            public string customerName;
            public string street;
            public int cityId;
            public string cityName;
            public DateTime dateReceived;
            public int operationId;
            public string operationName;
            public string notes;
            public Status status;
            public int orderCount;
            public string asset;
            public string installerComments;
            public DateTime completed;
            public DateTime cancelled;
            public DateTime scheduled;
        }
        // DELETE: api/Orders/5
        // [HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteOrder([FromRoute] int id)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    var order = await _context.Orders.FindAsync(id);
        //    if (order == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.Orders.Remove(order);
        //    await _context.SaveChangesAsync();

        //    return Ok(order);
        //}

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }

        private IQueryable<Order> GetSearchQuery(string searchInput)
        {
            IQueryable<Order> baseQuery = _context.Orders;

            IQueryable<Order> search =
                baseQuery.Where(o => o.Street.Contains(searchInput)).
                Union(baseQuery.Include("Customer").Where(o => o.Customer.Name.Contains(searchInput))).
                Union(baseQuery.Include("City").Where(o => o.City.Name.Contains(searchInput))).
                Union(baseQuery.Where(o => o.Notes.Contains(searchInput)));

            int id = 0;
            if (int.TryParse(searchInput, out id))
            {
                search = search.Union(baseQuery.Where(o => o.Id.ToString().Contains(searchInput)));
            }

            //todo: more dates
            DateTime received;
            if (DateTime.TryParse(searchInput, out received))
            {
                search = search.Union(baseQuery.Where(o =>
                o.DateReceived.ToString("d").Contains(searchInput)));
            }

            return search;
        }
    }
}