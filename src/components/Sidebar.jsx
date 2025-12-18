import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  Users,
  Wallet,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
     ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50"}`;

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b border-gray-200 flex items-center px-4">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
        >
          <Menu size={22} />
        </button>
        <h2 className="ml-3 font-bold text-blue-600">IMTC Admin</h2>
      </div>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky lg:top-0 top-0 left-0 z-50 h-screen
          bg-white border-r border-gray-200 flex flex-col
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 w-64
        `}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-blue-600">IMTC Admin</h2>

          {/* Close button (mobile) */}
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu - Takes remaining space */}
        <div className="flex-1 px-3 py-4 overflow-y-auto">
          <nav className="space-y-1">
            <NavLink
              to="/dashboard"
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>

            <NavLink
              to="/companies"
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              <Building2 size={18} /> All Companies
            </NavLink>

            <NavLink
              to="/jobs"
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              <ClipboardList size={18} /> All Jobs
            </NavLink>

            <NavLink
              to="/candidates"
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              <Users size={18} /> Candidates
            </NavLink>

            <NavLink
              to="/wallets"
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              <Wallet size={18} /> Wallets
            </NavLink>
          </nav>
        </div>

        {/* Logout - Fixed at bottom */}
        <div className="mt-auto px-3 py-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
