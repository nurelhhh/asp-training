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
    public class JurusanController : ControllerBase
    {
        // GET: api/<JurusanController>
        [HttpGet]
        public ActionResult<List<Jurusan>> Get(Guid fakultasID)
        {
            var jurusans = new List<Jurusan>
            {
                new Jurusan
                {
                    JurusanID = new Guid("b2bd376e-b0a7-43c6-9f03-d0419163fb3b"),
                    Name = "Teknik Informatika",
                    FakultasID = new Guid("2FB68670-4FFB-4453-BA1B-7059E2551F0F")
                },
                new Jurusan
                {
                    JurusanID = new Guid("cde19b5b-e6f2-47dd-b700-90ccde4ebc71"),
                    Name = "Sistem Informasi",
                    FakultasID = new Guid("4B1EC68F-16D2-4AC9-8E8B-2AC8DFF4D90E")
                },
                new Jurusan
                {
                    JurusanID = new Guid("6b11de09-0641-401e-867f-639c0b9f854b"),
                    Name = "Game and Application Technology",
                    FakultasID = new Guid("2FB68670-4FFB-4453-BA1B-7059E2551F0F")
                },
                new Jurusan
                {
                    JurusanID = new Guid("aee9a95b-03e3-4588-9c2c-4cc784b1528e"),
                    Name = "Ekonomi",
                    FakultasID = new Guid("D2056918-0C9B-4C96-9B1B-E5A583D99904")
                },
                new Jurusan
                {
                    JurusanID = new Guid("767a7332-f2f5-4d39-bc37-1b8690a7d4ba"),
                    Name = "Bisnis",
                    FakultasID = new Guid("D2056918-0C9B-4C96-9B1B-E5A583D99904")
                }
            };

            return jurusans.Where(Q => Q.FakultasID == fakultasID).ToList();

        }

    }

    public class Jurusan
    {
        public Guid JurusanID { set; get; }
        public string Name { set; get; }
        public Guid FakultasID { set; get; }
    }
}
