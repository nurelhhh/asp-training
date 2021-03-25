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
    public class ProductController : ControllerBase
    {
        ShopDbContext DB { set; get; }

        public ProductController(ShopDbContext db)
        {
            this.DB = db;
        }

        [HttpGet]
        public async Task<ActionResult<List<ProductListItem>>> Get()
        {
            var products = await DB.Products
                .AsNoTracking()
                .Select(p => new ProductListItem
                {
                    ProductID = p.ProductID,
                    Name = p.Name,
                    Price = p.Price
                })
                .ToListAsync();

            return products;
        }

        [HttpGet("{id:Guid}")]
        public async Task<ActionResult<ProductListItem>> Get(Guid id)
        {
            var product = await DB.Products
                .AsNoTracking()
                .Where(c => c.ProductID == id)
                .Select(p => new ProductListItem
                {
                    ProductID = p.ProductID,
                    Name = p.Name,
                    Price = p.Price
                })
                .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        [HttpPost]
        public async Task<ActionResult<bool>> Post([FromBody] ProductAddOrUpdateModel model)
        {
            if (ModelState.IsValid == false)
            {
                return BadRequest(ModelState);
            }

            var newProduct = new Product
            {
                ProductID = Guid.NewGuid(),
                Name = model.Name,
                Price = model.Price
            };

            DB.Products.Add(newProduct);
            await DB.SaveChangesAsync();

            return true;
        }

        [HttpPut("{id:Guid}")]
        public async Task<ActionResult<bool>> Put(Guid id, [FromBody] ProductAddOrUpdateModel model)
        {

            var product = await DB.Products
                .Where(p => p.ProductID == id)
                .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound();
            }

            if (ModelState.IsValid == false)
            {
                return BadRequest(ModelState);
            }

            product.Name = model.Name;
            product.Price = model.Price;

            await DB.SaveChangesAsync();

            return true;
        }

        [HttpDelete("{id:Guid}")]
        public async Task<ActionResult<bool>> Delete(Guid id)
        {
            var product = await DB.Products
                .Where(p => p.ProductID == id)
                .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound();
            }

            DB.Products.Remove(product);
            await DB.SaveChangesAsync();

            return true;
        }
    }

    public class ProductAddOrUpdateModel
    {
        [Required]
        [StringLength(256)]
        public string Name { set; get; }

        [Required]
        [Range(0, 10_000_000_000)]
        public decimal Price { set; get; }
    }

    public class ProductListItem
    {
        public Guid ProductID { set; get; }
        public string Name { set; get; }
        public decimal Price { set; get; }
    }
}
