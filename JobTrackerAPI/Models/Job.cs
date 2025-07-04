namespace JobTrackerAPI.Models;

public class Job
{
    public int Id { get; set; }
    public string Company { get; set; } = "";
    public string Title { get; set; } = "";
    public string Status { get; set; } = "Applied";
    public DateTime AppliedDate { get; set; }
    public string Notes { get; set; } = "";
}
