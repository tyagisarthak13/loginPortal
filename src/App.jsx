import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar"; // Your reusable sidebar

// Admin Pages
import Dashboard from "./Admin/pages/Dashboard";
import Companies from "./Admin/pages/Companies";
import Jobs from "./Admin/pages/Jobs";
import Candidates from "./Admin/pages/Candidates";
import Wallets from "./Admin/pages/Wallet";
import CompanyDetails from "./Admin/pages/CompanyDetails";
import JobDetails from "./Admin/pages/JobDetails";
import CandidateDetails from "./Admin/pages/CandidatesDetails";

// Worker Pages
import WorkerDashboard from "./Worker/pages/WorkerDashboard";
import FindJobs from "./Worker/pages/FindJobs";
import MyApplications from "./Worker/pages/MyApplications";
import Profile from "./Worker/pages/Profile";

// Company Pages
import CompanyDashboard from "./Company/pages/CompanyDashboard";
import MyJobs from "./Company/pages/MyJobs";
import Applicants from "./Company/pages/Applicants";
import CompanyWallet from "./Company/pages/CompanyWallet";

// --- REUSABLE LAYOUT ---
const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-8 mt-14 lg:mt-0">{children}</main>
    </div>
  );
};

// --- ROUTE GUARDS ---
const ProtectedRoute = ({ children, allowedRole }) => {
  const role = localStorage.getItem("role");
  const adminAuth = localStorage.getItem("adminLoggedIn") === "true";

  // If not logged in at all
  if (!role) return <Navigate to="/login" replace />;

  // Special check for Admin
  if (allowedRole === "admin" && (!adminAuth || role !== "admin")) {
    return <Navigate to="/login" replace />;
  }

  // Check if user role matches the required role for this route
  if (role !== allowedRole) {
    // Redirect to their own dashboard if they try to cross-over
    const pathMap = {
      admin: "/admin/dashboard",
      company: "/company/dashboard",
      worker: "/worker/dashboard",
    };
    return <Navigate to={pathMap[role]} replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* 🛡️ ADMIN ROUTES */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/companies"
          element={
            <ProtectedRoute allowedRole="admin">
              <Companies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/companies/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <CompanyDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute allowedRole="admin">
              <Jobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <JobDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/candidates"
          element={
            <ProtectedRoute allowedRole="admin">
              <Candidates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/candidates/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <CandidateDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/wallets"
          element={
            <ProtectedRoute allowedRole="admin">
              <Wallets />
            </ProtectedRoute>
          }
        />

        {/* 🛡️ WORKER ROUTES */}
        <Route
          path="/worker/dashboard"
          element={
            <ProtectedRoute allowedRole="worker">
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/find-jobs"
          element={
            <ProtectedRoute allowedRole="worker">
              <FindJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/applications"
          element={
            <ProtectedRoute allowedRole="worker">
              <MyApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/profile"
          element={
            <ProtectedRoute allowedRole="worker">
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 🛡️ COMPANY ROUTES */}
        <Route
          path="/company/dashboard"
          element={
            <ProtectedRoute allowedRole="company">
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/my-jobs"
          element={
            <ProtectedRoute allowedRole="company">
              <MyJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/applicants"
          element={
            <ProtectedRoute allowedRole="company">
              <Applicants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/wallet"
          element={
            <ProtectedRoute allowedRole="company">
              <CompanyWallet />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
