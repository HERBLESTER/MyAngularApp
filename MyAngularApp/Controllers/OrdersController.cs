using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyAngularApp.Domain;

namespace MyAngularApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly Context _context;

        public OrdersController(Context context)
        {
            _context = context;
        }

        // GET: api/Orders
        [Route("~/api/Orders/Getallorders")]
        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
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

            IEnumerable<OrderVM> orders = await orderVMs.ToListAsync();

            return Ok(orders);
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        [Route("~/api/Orders/Customer")]
        public async Task<IActionResult> GetCustomerOrders([FromRoute] int customerId )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var order = await _context.Orders.FindAsync(1);

            if (order == null)
            {
                return NotFound();
            }

            return Ok(order);
        }

        // PUT: api/Orders/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder([FromRoute] int id, [FromBody] Order order)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != order.Id)
            {
                return BadRequest();
            }

            _context.Entry(order).State = EntityState.Modified;

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

            return NoContent();
        }

        // POST: api/Orders

        [HttpPost]
        [Route("~/api/Orders/NewOrder")]
        public async Task<IActionResult> NewOrder([FromBody] OrderVM order)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Order o = new Order
            {
                CityId = order.cityId,
                CustomerId = order.customerId,
                DateReceived = DateTime.Now,
                Notes = order.notes,
                OperationId = order.operationId,
                Status = Status.Received,
                Street = order.street
            };

            _context.Orders.Add(o);
            await _context.SaveChangesAsync();
            o = await _context.Orders.Include("Customer").Include("City").Include("Operation").FirstAsync<Order>(oo => oo.Id == o.Id);

            order = new OrderVM
            {
                id = o.Id,
                cityName = o.City.Name,
                customerName = o.Customer.Name,
                dateReceived = o.DateReceived,
                notes = o.Notes,
                operationName = o.Operation.Name,
                status = o.Status,
                street = o.Street
            };

            return CreatedAtAction("GetOrder", new { id = order.id }, order);
        }

     
        // GET: api/Orders/5
        [Route("~/api/Orders/scheduled")]
        [HttpGet]
        public async Task<IActionResult> GetScheduledOrders()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var order = await _context.Orders.FindAsync(1);

            if (order == null)
            {
                return NotFound();
            }

            return Ok(order);
        }

        //[Route("~/api/Orders/Completed")]
        //[HttpPost]
        //public async Task<IActionResult> GetCompletedOrders([FromRoute] DateTime begin, [FromRoute] DateTime end)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    var order = await _context.Orders.FindAsync(1);

        //    if (order == null)
        //    {
        //        return NotFound();
        //    }

        //    return Ok(order);
        //}

        //[Route("~/api/Orders/Complete")]
        //[HttpPost]
        //public async Task<IActionResult> CompleteOrder([FromBody] CompletedOrder completed)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //   var order = await _context.Orders.FindAsync(completed.OrderId);

        //    if (order == null)
        //    {
        //        return NotFound();
        //    }

        //    return Ok(order);
        //}

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

    }
}