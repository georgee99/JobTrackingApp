import { useEffect, useState } from "react";
import type { Job } from "../types/job";
import JobCard from "../components/JobCard";

const API_URL =
    import.meta.env.MODE === "production"
        ? "https://job-tracker-api.example.com/api/jobs"
        : "http://localhost:5112/api/jobs";

export default function JobListPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 5;

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm("Are you sure you want to delete this job?");
        if (!confirmed) return;

        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

        if (response.ok) {
            setJobs((prev) => prev.filter((job) => job.id !== id));
        } else {
            console.error("Failed to delete job");
        }
    };

    useEffect(() => {
        fetch(API_URL)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch jobs");
                }
                return res.json();
            })
            .then((data) => {
                setJobs(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load jobs");
                setLoading(false);
            });
    }, []);

    const sortedJobs = [...jobs].sort((a, b) => {
        const dateA = new Date(a.appliedDate).getTime();
        const dateB = new Date(b.appliedDate).getTime();
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    // Pagination
    const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);
    const startIndex = (currentPage - 1) * jobsPerPage;
    const currentJobs = sortedJobs.slice(startIndex, startIndex + jobsPerPage);

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">Job Applications</h1>
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
                    className="border rounded p-1"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="space-y-4">
                {currentJobs.map((job) => (
                    <JobCard key={job.id} job={job} onDelete={handleDelete} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="self-center">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
