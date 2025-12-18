import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6 pt-20 lg:pt-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
