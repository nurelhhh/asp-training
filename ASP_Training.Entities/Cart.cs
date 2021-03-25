using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASP_Training.Entities
{
    public class Cart
    {
        public long CartID { set; get; }
        public Guid CustomerID { set; get; }
        public Guid ProductID { set; get; }
        public int Quantity { set; get; }
        public Customer Customer { set; get; }
        public Product Product { set; get; }
    }
}
