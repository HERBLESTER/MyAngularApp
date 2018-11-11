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
    public class MetaDataController : ControllerBase
    {
        private readonly Context _context;

        public MetaDataController(Context context)
        {
            _context = context;
        }
        // GET: api/Meatdata
        [HttpGet("[action]")]
        public async Task<IActionResult> GetMetadata()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            MetaData metaData = new MetaData();

            metaData.Cities = await (_context.Cities.ToArrayAsync());
            metaData.Operations = await _context.Operations.ToArrayAsync();
            metaData.Customers = await _context.Customers.ToArrayAsync();

            return Ok(metaData);
        }
    }

    public class MetaData
    {
        public City[] Cities;
        public Operation[] Operations;
        public Customer[] Customers;
    }
}
