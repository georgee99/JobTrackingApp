import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.MODE === "production"
    ? "https://job-tracker-api.example.com/api/jobs"
    : "http://localhost:5112/api/jobs";

interface Job {
  company: string;
  title: string;
  status: string;
  appliedDate: string;
  notes?: string;
}

type Status = "Applied" | "Interviewing" | "Offer" | "Rejected";

export default function AddJobPage() {
  const [formData, setFormData] = useState<Job>({
    company: "",
    title: "",
    status: "Applied" as Status,
    appliedDate: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/");
      } else {
        setSubmitError("Failed to submit job");
      }
    } catch {
      setSubmitError("Failed to submit job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Add a New Job</h2>
      {submitError && <p className="text-red-600">{submitError}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="company" className="block font-medium mb-1">Company</label>
          <input
            id="company"
            type="text"
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="title" className="block font-medium mb-1">Job Title</label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="status" className="block font-medium mb-1">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option>Applied</option>
            <option>Interviewing</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
        </div>
        <div>
          <label htmlFor="appliedDate" className="block font-medium mb-1">Applied Date</label>
          <input
            id="appliedDate"
            type="date"
            name="appliedDate"
            value={formData.appliedDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="notes" className="block font-medium mb-1">Notes</label>
          <textarea
            id="notes"
            name="notes"
            placeholder="Notes (optional)"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
