import type { Job } from "../types/job";
import { useNavigate } from "react-router-dom";

interface JobCardProps {
  job: Job;
  onDelete: (id: number) => void;
}

export default function JobCard({ job, onDelete }: JobCardProps) {
  const navigate = useNavigate();

  return (
    <div className="border p-4 rounded shadow hover:bg-gray-50 transition relative" onClick={() => navigate(`/job/${job.id}`)}>
      <div className="text-xl font-semibold">{job.title}</div>
      <div className="text-gray-700">{job.company}</div>
      <div className="text-sm text-gray-500">
        Applied: {new Date(job.appliedDate).toLocaleDateString()}
        <br />
        Status: {job.status} 
      </div>
      {job.notes && <p className="mt-2 text-gray-600">{job.notes}</p>}

      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(job.id);
        }}
        className="absolute top-2 right-2 text-sm text-red-600 hover:underline">
        Delete
      </button>
    </div>
  );
}
