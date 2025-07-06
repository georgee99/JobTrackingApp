using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JobTrackerAPI.Data;
using JobTrackerAPI.Models;
using Microsoft.AspNetCore.Authorization;

namespace JobTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public JobsController(AppDbContext db) => _db = db;

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Job>>> GetJobs() =>
            await _db.Jobs.ToListAsync();

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Job>> GetJob(int id)
        {
            if (id <= 0)
            {
                Console.WriteLine($"Invalid job ID: {id}");
                return BadRequest("Invalid job ID.");
            }

            Console.WriteLine($"Fetching job with ID: {id}");
            var job = await _db.Jobs.FindAsync(id);
            if (job == null)
            {
                Console.WriteLine($"Job with ID {id} not found.");
                return NotFound();
            }

            // Convert back to local time
            job.AppliedDate = DateTime.SpecifyKind(job.AppliedDate, DateTimeKind.Utc).ToLocalTime();

            return Ok(job);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Job>> CreateJob(Job job)
        {
            if (job == null)
            {
                Console.WriteLine("Received null job object for creation.");
                return BadRequest("Job data is required.");
            }

            // Storing as UTC
            job.AppliedDate = DateTime.SpecifyKind(job.AppliedDate, DateTimeKind.Utc);

            Console.WriteLine($"Creating job: {job.Company} - {job.Title} on {job.AppliedDate}");

            _db.Jobs.Add(job);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJobs), new { id = job.Id }, job);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            if (id <= 0)
            {
                Console.WriteLine($"Invalid job ID for deletion: {id}");
                return BadRequest("Invalid job ID.");
            }

            try
            {
                Console.WriteLine($"Deleting job with ID: {id}");
                var job = await _db.Jobs.FindAsync(id);
                if (job == null)
                {
                    Console.WriteLine($"Job with ID {id} not found for deletion.");
                    return NotFound();
                }

                _db.Jobs.Remove(job);
                await _db.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting job with ID {id}: {ex.Message}");
                return StatusCode(500, "An error occurred while deleting the job.");
            }
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(int id, Job updatedJob)
        {
            if (id != updatedJob.Id)
            {
                return BadRequest();
            }

            // Storing as UTC
            updatedJob.AppliedDate = DateTime.SpecifyKind(updatedJob.AppliedDate, DateTimeKind.Utc);

            Console.WriteLine($"Updating job: {updatedJob.Company} - {updatedJob.Title} on {updatedJob.AppliedDate}");

            _db.Entry(updatedJob).State = EntityState.Modified;

            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!JobExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        private bool JobExists(int id)
        {
            return _db.Jobs.Any(e => e.Id == id);
        }
    }
}
