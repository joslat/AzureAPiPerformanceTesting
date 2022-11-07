using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

namespace WebApi01.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GUIDController : ControllerBase
    {
        [HttpGet]
        public string Get()
        {
            Guid newGuid = Guid.NewGuid();

            return newGuid.ToString();
        }
    }
}
