using Microsoft.AspNetCore.Mvc;
using ToDoApp.Models;
using ToDoApp.Services;
using System.Linq;
using ToDoApp.Data;
using Microsoft.Extensions.Logging;

namespace ToDoApp.Controllers
{
    [ApiController]
    [Route("/{controller}")]
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly TokenService _tokenService;
        private readonly ILogger<AccountController> _logger;

        public AccountController(ApplicationDbContext context, TokenService tokenService, ILogger<AccountController> logger)
        {
            _context = context;
            _tokenService = tokenService;
            _logger = logger;
        }

        [HttpPost]
        [Route("login")]
        public IActionResult Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = _context.Users.FirstOrDefault(u => u.Username == model.Username && u.PasswordHash == model.Password);
                if (user != null)
                {
                    var token = _tokenService.CreateToken(user);
                    _logger.LogInformation($"User {user.Username} logged in successfully.");
                    return Ok(token);
                }
                else
                {
                    _logger.LogWarning($"Invalid login attempt for user {model.Username}.");
                    ModelState.AddModelError(string.Empty, "Invalid login attempt.");
                    return Ok("");
                }
            }
            _logger.LogWarning("Invalid model state during login attempt.");
            return Ok("");
        }

        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        [Route("register")]
        public IActionResult Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = new User
                {
                    Username = model.Username,
                    PasswordHash = model.Password
                };

                _context.Users.Add(user);
                _context.SaveChanges();

                _logger.LogInformation($"User {user.Username} registered successfully.");
                return Ok();
            }

            _logger.LogWarning("Invalid model state during registration attempt.");
            return BadRequest(ModelState);
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }
    }
}