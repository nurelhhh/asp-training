using ASP_Training.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ASP_Training.API
{



    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        public ShopDbContext DB { set; get; }

        public BookingController(ShopDbContext db)
        {
            this.DB = db;
        }

        // GET: api/<BookingController>
        [HttpGet]
        public async Task<ActionResult<List<BookingListItem>>> Get()
        {
            //var bookings = new List<BookingListItem>();
            //bookings.Add(new BookingListItem
            //{
            //    BookingID = new Guid("D19ECC6B-8234-4FE2-8C7C-BAA4116C734E"),
            //    From = DateTimeOffset.UtcNow.AddDays(-7),
            //    To = DateTimeOffset.UtcNow.AddDays(3)
            //});


            var data = await DB.Bookings
                .AsNoTracking()
                .Select(Q => new BookingListItem { 
                    BookingID = Q.BookingID,
                    From = Q.From,
                    To = Q.To
                })
                .ToListAsync();

            return data;
        }


        // POST api/<BookingController>
        [HttpPost]
        public async Task<ActionResult<bool>> Post([FromBody] BookingPostRequestModel model)
        {
            DB.Bookings.Add(new Booking
            {
                BookingID = Guid.NewGuid(),
                From = model.From.ToUniversalTime(),
                To = model.To.ToUniversalTime()
            });

            await DB.SaveChangesAsync();

            return true;
        }


    }

    public class BookingPostRequestModel
    {
        [Required]
        public DateTimeOffset From { set; get; }

        [Required]
        public DateTimeOffset To { set; get; }
    }

    public class BookingListItem
    {
        public Guid BookingID { set; get; }

        public DateTimeOffset From { set; get; }

        public DateTimeOffset To { set; get; }
    }
}
