import { useEffect, useState } from "react";
import type { Job } from "../types/job";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.MODE === "production"
    ? "https://job-tracker-api.example.com/api/jobs"
    : "http://localhost:5112/api/jobs";

export default function StatsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const navigate = useNavigate();
  const now = new Date();

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchJobs = async () => {
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await res.json();
      setJobs(data);
    };
    fetchJobs();
  }, [navigate]);


  const getStartOfWeek = () => {
    const date = new Date(now);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const isSameWeek = (dateStr: string) => {
    const applied = new Date(dateStr);
    return applied >= getStartOfWeek();
  };

  const isSameMonth = (dateStr: string) => {
    const applied = new Date(dateStr);
    return applied.getMonth() === now.getMonth() && applied.getFullYear() === now.getFullYear();
  };

  const total = jobs.length;
  const weekly = jobs.filter((job) => isSameWeek(job.appliedDate)).length;
  const monthly = jobs.filter((job) => isSameMonth(job.appliedDate)).length;

  const byStatus = jobs.reduce((acc: Record<string, number>, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Job Application Stats</h2>

      <div className="space-y-2 text-lg">
        <p>📌 Total: <strong>{total}</strong></p>
        <p>📅 This Month: <strong>{monthly}</strong></p>
        <p>📆 This Week: <strong>{weekly}</strong></p>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">By Status</h3>
        <div className="space-y-1">
          {Object.entries(byStatus).map(([status, count]) => (
            <div key={status} className="flex justify-between border-b pb-1">
              <span>{status}</span>
              <span className="font-semibold">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Status Chart</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={Object.entries(byStatus).map(([status, count]) => ({ status, count }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
