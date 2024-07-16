using Microsoft.EntityFrameworkCore;
using ToDoApp.Models;

namespace ToDoApp.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Note> Notes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.HasKey(x => x.Id);
                entity.Property(x => x.Username);
                entity.Property(x => x.PasswordHash);
            });

            modelBuilder.Entity<Note>(entity =>
            {
                entity.ToTable("Note");
                entity.Property(x => x.Id);
                entity.Property(x => x.Title);
                entity.Property(x => x.Text);

                entity.HasOne(y => y.User)
                .WithMany(p=> p.Notes)
                .HasForeignKey(y => y.UserId);
            });
        }
    }
}
