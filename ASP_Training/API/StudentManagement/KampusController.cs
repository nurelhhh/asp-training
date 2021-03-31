using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ASP_Training.API.StudentManagement
{
    [Route("api/[controller]")]
    [ApiController]
    public class KampusController : ControllerBase
    {

        // GET: api/<KampusController>
        [HttpGet]
        public ActionResult<List<Kampus>> Get()
        {
            return new List<Kampus>
            {
                new Kampus
                {
                    KampusID = new Guid("DE0C321A-13F6-4D31-9E87-A569C8068944"),
                    Name = "Alam Sutera"
                },
                new Kampus
                {
                    KampusID = new Guid("CBF59955-2FBC-4852-8E6B-C450057B1BBE"),
                    Name = "Kemanggisan"
                }
            };
        }
    }

    public class Kampus
    {
        public Guid KampusID { set; get; }
        public string Name { set; get; }
    }
}
