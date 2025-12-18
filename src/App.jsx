import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import AdminLayout from "./Admin/layout/AdminLayout";

import Dashboard from "./Admin/pages/Dashboard";
import Companies from "./Admin/pages/Companies";
import Candidates from "./Admin/pages/Candidates";
import Wallets from "./Admin/pages/Wallet";
import Jobs from "./Admin/pages/Jobs";
import CompanyDetails from "./Admin/pages/CompanyDetails";
import JobDetails from "./Admin/pages/JobDetails";
import CandidateDetails from "./Admin/pages/CandidatesDetails";

const PrivateRoute = ({ children }) => {
  const isAuth = localStorage.getItem("adminLoggedIn") === "true";
  return isAuth ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          {/* Default page */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="companies" element={<Companies />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="wallets" element={<Wallets />} />
          <Route path="/companies/:id" element={<CompanyDetails />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/candidates/:id" element={<CandidateDetails />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
