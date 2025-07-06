import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Job } from "../types/job";

const API_URL =
  import.meta.env.MODE === "production"
    ? "https://job-tracker-api.example.com/api/jobs"
    : "http://localhost:5112/api/jobs";

export default function JobDetailPage() {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }
    fetch(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setJob(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!job) return;
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) {
      console.error("Job data is not available");
      return;
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(job),
    });

    if (response.ok) {
      navigate("/");
    } else {
      console.error("Update failed");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!job) return <p>Job not found</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Edit Job</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <input
          type="text"
          name="company"
          value={job.company}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="title"
          value={job.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <select name="status" value={job.status} onChange={handleChange} className="w-full p-2 border rounded">
          <option>Applied</option>
          <option>Interviewing</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
        <input
          type="date"
          name="appliedDate"
          value={job.appliedDate.split("T")[0]}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="notes"
          value={job.notes}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Notes"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save
        </button>
      </form>
    </div>
  );
}
