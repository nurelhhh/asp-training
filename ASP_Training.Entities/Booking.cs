using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASP_Training.Entities
{
    public class Booking
    {
        public Guid BookingID { set; get; }

        // DateTime tidak ada timezone
        // DateTimeOffset ada timezone, bisa diconvert ke UTC
        public DateTimeOffset From { set; get; }

        public DateTimeOffset To { set; get; }
    }
}
