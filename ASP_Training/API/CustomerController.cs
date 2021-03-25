using ASP_Training.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ASP_Training.API
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(AuthenticationSchemes = "customer-api")]
    public class CustomerController : ControllerBase
    {
        ShopDbContext DB { set; get; }

        public CustomerController(ShopDbContext db)
        {
            this.DB = db;
        }

        [HttpGet]
        public async Task<ActionResult<List<CustomerListItem>>> Get()
        {
            var customers = await DB.Customers
                .AsNoTracking()
                .Select(c => new CustomerListItem
                {
                    CustomerID = c.CustomerID,
                    Name = c.Name,
                    Email = c.Email
                })
                .ToListAsync();

            return customers;
        }

        [HttpGet("{id:Guid}")]
        public async Task<ActionResult<CustomerListItem>> Get(Guid id)
        {
            var customer = await DB.Customers
                .AsNoTracking()
                .Where(c => c.CustomerID == id)
                .Select(c => new CustomerListItem
                {
                    CustomerID = c.CustomerID,
                    Name = c.Name,
                    Email = c.Email
                })
                .FirstOrDefaultAsync();

            if (customer == null)
            {
                return NotFound();
            }

            return customer;
        }

        [HttpPost]
        public async Task<ActionResult<bool>> Post([FromBody] CustomerAddOrUpdateModel model)
        {
            if (ModelState.IsValid == false)
            {
                return BadRequest(ModelState);
            }

            var newCustomer = new Customer
            {
                CustomerID = Guid.NewGuid(),
                Name = model.Name,
                Email = model.Email
            };

            DB.Customers.Add(newCustomer);
            await DB.SaveChangesAsync();

            return true;
        }

        [HttpPut("{id:Guid}")]
        public async Task<ActionResult<bool>> Put(Guid id, [FromBody] CustomerAddOrUpdateModel model)
        {

            var customer = await DB.Customers
                .Where(c => c.CustomerID == id)
                .FirstOrDefaultAsync();

            if (customer == null)
            {
                return NotFound();
            }

            if (ModelState.IsValid == false)
            {
                return BadRequest(ModelState);
            }

            customer.Name = model.Name;
            customer.Email = model.Email;

            await DB.SaveChangesAsync();

            return true;
        }

        [HttpDelete("{id:Guid}")]
        public async Task<ActionResult<bool>> Delete(Guid id)
        {
            var customer = await DB.Customers
                .Where(c => c.CustomerID == id)
                .FirstOrDefaultAsync();

            if (customer == null)
            {
                return NotFound();
            }

            DB.Customers.Remove(customer);
            await DB.SaveChangesAsync();

            return true;
        }
    }

    public class CustomerAddOrUpdateModel
    {
        [Required]
        [StringLength(256)]
        public string Name { set; get; }

        [Required]
        [StringLength(256)]
        public string Email { set; get; }
    }

    public class CustomerListItem
    {
        public Guid CustomerID { set; get; }
        public string Name { set; get; }
        public string Email { set; get; }
    }
}
