import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import JobListPage from "./pages/JobListPage";
import AddJobPage from "./pages/AddJobPage";
import StatsPage from "./pages/StatsPage";
import SettingsPage from "./pages/SettingsPage";
import AboutPage from "./pages/AboutPage";
import JobDetailPage from "./pages/JobDetailPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<JobListPage />} />
        <Route path="/job/:id" element={<JobDetailPage />} />
        <Route path="/add" element={<AddJobPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
