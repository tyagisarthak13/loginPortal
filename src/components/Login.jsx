import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import backgroundImage3 from "../assets/background3.jpg";

const MySwal = withReactContent(Swal);

// 🔐 Static admin credentials
const ADMIN_CREDENTIALS = {
  email: "admin@imtc.com",
  password: "admin123",
  branch: "Delhi",
  ip: "192.168.1.1",
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password || !branch || !ip) {
      MySwal.fire({
        icon: "error",
        title: "Missing fields",
        text: "All fields are required",
      });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (
        email === ADMIN_CREDENTIALS.email &&
        password === ADMIN_CREDENTIALS.password &&
        branch === ADMIN_CREDENTIALS.branch &&
        ip === ADMIN_CREDENTIALS.ip
      ) {
        localStorage.setItem("adminLoggedIn", "true");

        MySwal.fire({
          icon: "success",
          title: "Login successful",
          text: "Welcome to IMTC Admin Portal",
        }).then(() => {
          navigate("/dashboard", { replace: true }); // ADD THIS LINE
        });
      } else {
        MySwal.fire({
          icon: "error",
          title: "Invalid credentials",
          text: "Please check your details",
        }).then(() => {
          navigate("/", { replace: true });
        });
      }

      setLoading(false);
    }, 800);
  };

  return (
    // Background container
    <div
      className="fixed inset-0 w-full h-full bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage3}` }}
    >
      {/* Opacity Overlay */}
      <div className="fixed inset-0 bg-gray-900 opacity-70"></div>

      {/* Content Container */}
      <div className="min-h-screen relative z-10 flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 text-white z-10">
          <span className="text-blue-400">IMTC </span>
          <span className="text-white">Admin Portal</span>
        </h1>

        <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-gray-200 z-10">
          <div className="px-8 py-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Admin Login</h2>
          </div>

          <form onSubmit={onSubmitHandler} className="px-8 py-8 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@imtc.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Branch
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="Delhi"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                IP Address
              </label>
              <input
                type="text"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="192.168.1.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              />
            </div>

            {/* Login Button with Integrated Loader and disabled cursor control */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 mt-6 rounded-lg bg-blue-600 text-white font-bold shadow-md hover:bg-blue-700 transition duration-150 ease-in-out
              disabled:bg-blue-400 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Verifying...</span>
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
