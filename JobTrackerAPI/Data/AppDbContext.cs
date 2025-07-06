namespace JobTrackerAPI.Data;

using Microsoft.EntityFrameworkCore;
using JobTrackerAPI.Models;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();

    public DbSet<Job> Jobs => Set<Job>();
}
