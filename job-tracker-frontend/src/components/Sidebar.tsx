import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-full md:w-64 bg-gray-800 text-white p-6">
      <h2 className="text-2xl font-bold mb-6">Job Tracker</h2>
      <ul className="space-y-4">
        <li><Link to="/">Jobs</Link></li>
        <li><Link to="/add">Add Job</Link></li>
        <li><Link to="/stats">Stats</Link></li>
        <li><Link to="/settings">Settings</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </div>
  );
}
