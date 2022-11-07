using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebApi01.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SimpleApiCall : ControllerBase
    {
        [HttpGet]
        public string Get()
        {
            return "You got this!";
        }
    }
}
