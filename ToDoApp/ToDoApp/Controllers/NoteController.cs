using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Security.Claims;
using ToDoApp.Data;
using ToDoApp.DTOs;
using ToDoApp.Models;
using Microsoft.Extensions.Logging;
using Serilog;

namespace ToDoApp.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("[controller]/[action]")]
    public class NoteController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<NoteController> _logger;

        public NoteController(ApplicationDbContext context, ILogger<NoteController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Index()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                _logger.LogWarning("User ID not found in token.");
                return Unauthorized("Authorization error. Please log in again.");
            }

            int userId = int.Parse(userIdClaim.Value);

            var notes = _context.Notes.Where(n => n.UserId == userId && !n.IsDeleted).ToList();
            _logger.LogInformation($"Retrieved {notes.Count} notes for user ID {userId}.");

            return Ok(notes);
        }

        [HttpPost]
        public IActionResult Add([FromBody] NoteDTO dto)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                _logger.LogWarning("User ID not found in token.");
                return Unauthorized("Authorization error. Please log in again.");
            }

            int userId = int.Parse(userIdClaim.Value);

            Note note = new Note
            {
                Title = dto.Title,
                Text = dto.Text,
                UserId = userId
            };

            _context.Notes.Add(note);
            _context.SaveChanges();
            _logger.LogInformation($"Note added for user ID {userId} with title '{note.Title}'.");

            return Ok(note); // Newly added note should be returned
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var note = _context.Notes.FirstOrDefault(n => n.Id == id);

            if (note == null)
            {
                _logger.LogWarning($"Note with ID {id} not found.");
                return NotFound();
            }

            // Mark note as deleted
            note.IsDeleted = true;
            _context.SaveChanges();

            _logger.LogInformation($"Note with ID {id} marked as deleted.");

            return NoContent();
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] NoteDTO dto)
        {
            var note = _context.Notes.FirstOrDefault(n => n.Id == id);

            if (note == null)
            {
                _logger.LogWarning($"Note with ID {id} not found.");
                return NotFound();
            }

            // Update Note
            note.Title = dto.Title;
            note.Text = dto.Text;
            _context.SaveChanges();

            _logger.LogInformation($"Note with ID {id} updated. New title: '{note.Title}', New text: '{note.Text}'.");

            return Ok(note);
        }
    }
}
