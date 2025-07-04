export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 text-lg">
      <h1 className="text-3xl font-bold mb-4">ℹ️ About</h1>
      <p className="text-gray-700 mb-2">
        <strong>Job Tracker</strong> is a personal application designed to help you organize and manage your job search efficiently.
      </p>
      <p className="text-gray-700 mb-2">
        It's built with <strong>React</strong>, <strong>TypeScript</strong>, and <strong>Tailwind CSS</strong> on the frontend. The backend is powered by <strong>.NET 8</strong> with <strong>PostgreSQL</strong>.
      </p>
    </div>
  );
}
