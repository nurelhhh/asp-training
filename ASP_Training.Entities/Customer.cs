using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASP_Training.Entities
{
    public class Customer
    {
        public Guid CustomerID { set; get; }
        public string Name { set; get; }
        public string Email { set; get; }
        public ICollection<Cart> Carts { set; get; }
    }
}
