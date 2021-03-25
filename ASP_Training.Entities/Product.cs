using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASP_Training.Entities
{
    public class Product
    {
        public Guid ProductID { set; get; }
        public string Name { set; get; }
        public decimal Price { set; get; }
        public ICollection<Cart> Carts { set; get; }
    }
}
