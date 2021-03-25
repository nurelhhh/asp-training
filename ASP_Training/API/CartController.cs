using ASP_Training.Entities;
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
    public class CartController : ControllerBase
    {
        ShopDbContext DB { set; get; }

        public CartController(ShopDbContext db)
        {
            this.DB = db;
        }

        [HttpGet("{customerId:Guid}")]
        public async Task<ActionResult<List<CartListItem>>> Get(Guid customerId)
        {
            var carts = await DB.Carts
                .AsNoTracking()
                .Where(c => c.CustomerID == customerId)
                .Select(c => new CartListItem
                {
                    ProductID = c.ProductID,
                    ProductName = c.Product.Name,
                    Price = c.Product.Price,
                    Quantity = c.Quantity
                })
                .ToListAsync();

            return carts;
        }

        [HttpPost]
        public async Task<ActionResult<bool>> Post([FromBody] CartAddOrUpdateModel model)
        {
            var customerExists = await DB.Customers
                .AsNoTracking()
                .Where(c => c.CustomerID == model.CustomerID)
                .AnyAsync();

            var productExists = await DB.Products
                .AsNoTracking()
                .Where(c => c.ProductID == model.ProductID)
                .AnyAsync();

            if (customerExists == false)
            {
                ModelState.AddModelError("CustomerID", "Customer does not exist");
            }

            if (productExists == false)
            {
                ModelState.AddModelError("ProductID", "Product does not exist");
            }

            if (ModelState.IsValid == false)
            {
                return BadRequest(ModelState);
            }

            var cart = await DB.Carts
                .Where(c => c.ProductID == model.ProductID && c.CustomerID == model.CustomerID)
                .FirstOrDefaultAsync();

            if (cart == null)
            {
                cart = new Cart
                {
                    CustomerID = model.CustomerID,
                    ProductID = model.ProductID,
                    Quantity = model.Quantity
                };

                DB.Carts.Add(cart);
            }

            cart.Quantity = model.Quantity;

            await DB.SaveChangesAsync();

            return true;
        }

        [HttpDelete("delete")]
        public async Task<ActionResult<bool>> Delete(Guid customerId, Guid productId)
        {
            var customerExists = await DB.Customers
                .AsNoTracking()
                .Where(c => c.CustomerID == customerId)
                .AnyAsync();

            var productExists = await DB.Products
                .AsNoTracking()
                .Where(c => c.ProductID == productId)
                .AnyAsync();

            if (customerExists == false)
            {
                ModelState.AddModelError("CustomerID", "Customer does not exist");
            }

            if (productExists == false)
            {
                ModelState.AddModelError("ProductID", "Product does not exist");
            }

            if (ModelState.IsValid == false)
            {
                return BadRequest(ModelState);
            }

            var cart = await DB.Carts
               .Where(c => c.ProductID == productId && c.CustomerID == customerId)
               .FirstOrDefaultAsync();

            DB.Carts.Remove(cart);
            await DB.SaveChangesAsync();

            return true;
        }
    }

    public class CartAddOrUpdateModel
    {
        [Required]
        public Guid CustomerID { set; get; }
        [Required]
        public Guid ProductID { set; get; }
        [Required]
        public int Quantity { set; get; }
    }

    public class CartListItem
    {
        public Guid ProductID { set; get; }
        public string ProductName { set; get; }
        public decimal Price { set; get; }
        public int Quantity { set; get; }
    }
}
