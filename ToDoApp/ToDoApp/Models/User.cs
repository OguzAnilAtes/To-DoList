using System.Collections.Generic;

namespace ToDoApp.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }

        // Navigation property
        public ICollection<Note> Notes { get; set; }
    }
}
