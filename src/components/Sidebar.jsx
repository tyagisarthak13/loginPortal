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
  Briefcase,
  UserCircle,
} from "lucide-react";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // 1. Get the current role from localStorage
  const role = localStorage.getItem("role") || "worker";

  // 2. Define menu structures for each role with updated prefixed routes
  const menuConfigs = {
    admin: {
      title: "IMTC Admin",
      links: [
        { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/admin/companies", label: "All Companies", icon: Building2 },
        { to: "/admin/jobs", label: "All Jobs", icon: ClipboardList },
        { to: "/admin/candidates", label: "Candidates", icon: Users },
        { to: "/admin/wallets", label: "Wallets", icon: Wallet },
      ],
    },
    company: {
      title: "Partner Portal",
      links: [
        {
          to: "/company/dashboard",
          label: "Company Home",
          icon: LayoutDashboard,
        },
        { to: "/company/my-jobs", label: "Posted Jobs", icon: Briefcase },
        { to: "/company/applicants", label: "Applicants", icon: Users },
        { to: "/company/wallet", label: "Billing", icon: Wallet },
      ],
    },
    worker: {
      title: "Worker Portal",
      links: [
        { to: "/worker/dashboard", label: "Field Home", icon: LayoutDashboard },
        { to: "/worker/find-jobs", label: "Browse Jobs", icon: Briefcase },
        {
          to: "/worker/applications",
          label: "My Applications",
          icon: ClipboardList,
        },
        { to: "/worker/profile", label: "My Profile", icon: UserCircle },
      ],
    },
  };

  // 3. Select the config based on current role
  const currentConfig = menuConfigs[role] || menuConfigs.worker;

  const logout = () => {
    localStorage.clear(); // Clears role and adminLoggedIn
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
     ${
       isActive
         ? "bg-blue-600 text-white shadow-md"
         : "text-gray-700 hover:bg-blue-50"
     }`;

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
        <h2 className="ml-3 font-bold text-blue-600">{currentConfig.title}</h2>
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
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-blue-600 leading-tight">
              IMTC
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">
              {currentConfig.title}
            </span>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 px-3 py-4 overflow-y-auto">
          <nav className="space-y-1">
            {currentConfig.links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                <link.icon size={18} /> {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout */}
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
