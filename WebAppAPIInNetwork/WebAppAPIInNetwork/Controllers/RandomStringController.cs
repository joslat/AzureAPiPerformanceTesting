using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

namespace WebApi01.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RandomStringController : ControllerBase
    {
        [HttpGet]
        public string Get()
        {
            string randomString = RandomString(10);

            return randomString;
        }
        private static Random random = new Random();

        private static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
