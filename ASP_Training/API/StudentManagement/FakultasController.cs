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
    public class FakultasController : ControllerBase
    {
        // GET: api/<FakultasController>
        [HttpGet]
        public ActionResult<List<Fakultas>> Get()
        {
            return new List<Fakultas>
            {
                new Fakultas
                {
                    FakultasID = new Guid("2FB68670-4FFB-4453-BA1B-7059E2551F0F"),
                    Name = "School of Computer Science"
                },
                new Fakultas
                {
                    FakultasID = new Guid("4B1EC68F-16D2-4AC9-8E8B-2AC8DFF4D90E"),
                    Name = "School of Information System"
                },
                new Fakultas
                {
                    FakultasID = new Guid("D2056918-0C9B-4C96-9B1B-E5A583D99904"),
                    Name = "Binus Business School"
                }
            };
        }

    }
    public class Fakultas
    {
        public Guid FakultasID { set; get; }
        public string Name { set; get; }
    }
}
