namespace JobTrackerAPI.Data;

using Microsoft.EntityFrameworkCore;
using JobTrackerAPI.Models;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Job> Jobs => Set<Job>();
}
