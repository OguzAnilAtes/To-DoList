namespace ToDoApp.Models
{
    public class Note
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }

        // Foreign key property
       public int UserId { get; set; }

        // Navigation property
        public User User { get; set; }
        public bool IsDeleted { get; set; }
    }
}
