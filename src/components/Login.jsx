import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Loader2, Mail, Lock, User, Globe, ChevronDown } from "lucide-react";
import backgroundImage3 from "../assets/background3.jpg";

const MySwal = withReactContent(Swal);

const CREDENTIALS = {
  admin: { email: "admin@imtc.com", password: "admin123", ip: "192.168.1.1" },
  company: { email: "partner@imtc.com", password: "company123" },
  worker: { email: "field@imtc.com", password: "worker123" },
};

const Login = () => {
  const navigate = useNavigate();

  // --- States ---
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState("worker");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // Mobile Secret Tap Logic
  const [tapCount, setTapCount] = useState(0);
  const tapTimer = useRef(null);

  // --- Secret Access Handlers ---
  const unlockAdmin = () => {
    setIsRegistering(false);
    setShowAdmin(true);
    setRole("admin");
    MySwal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Admin Mode Enabled",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  // 🎹 Desktop Shortcut: Alt + A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        unlockAdmin();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 📱 Mobile Shortcut: Triple Tap Header
  const handleHeaderTap = () => {
    setTapCount((prev) => prev + 1);
    clearTimeout(tapTimer.current);

    tapTimer.current = setTimeout(() => {
      setTapCount(0);
    }, 1000); // Reset if taps are too slow

    if (tapCount + 1 >= 3) {
      unlockAdmin();
      setTapCount(0);
    }
  };

  const toggleMode = () => {
    const nextMode = !isRegistering;
    setIsRegistering(nextMode);
    if (nextMode && role === "admin") setRole("worker");
  };

  const handleAuth = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (isRegistering) {
        MySwal.fire({
          icon: "success",
          title: "Registration Success",
          text: "Registration successful, wait for approval",
          confirmButtonColor: "#2563eb",
        }).then(() => {
          setIsRegistering(false);
          setEmail("");
          setPassword("");
        });
      } else {
        const creds = CREDENTIALS[role];
        let isValid = false;

        if (role === "admin") {
          isValid =
            email === creds.email &&
            password === creds.password &&
            ip === creds.ip;
        } else {
          isValid = email === creds.email && password === creds.password;
        }

        if (isValid) {
          localStorage.setItem("role", role);
          if (role === "admin") {
            localStorage.setItem("adminLoggedIn", "true");
            navigate("/admin/dashboard");
          } else {
            navigate(
              role === "company" ? "/company/dashboard" : "/worker/dashboard"
            );
          }
        } else {
          MySwal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Invalid credentials.",
            confirmButtonColor: "#2563eb",
          });
        }
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-sans overflow-hidden">
      {/* Responsive Background Layer */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url(${backgroundImage3})` }}
      />
      <div className="absolute inset-0 z-10 bg-slate-900/80 backdrop-blur-sm" />

      {/* Login Card: Responsive widths from mobile to desktop */}
      <div className="relative z-20 w-full max-w-md px-4 py-6 md:py-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="bg-white pt-10 pb-4 px-8 text-center">
            {/* Tapping this 3 times unlocks admin on mobile */}
            <h2
              onClick={handleHeaderTap}
              className="text-3xl font-extrabold text-slate-800 tracking-tight cursor-default select-none active:scale-95 transition-transform"
            >
              IMTC Portal
            </h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              Enterprise Management System
            </p>
          </div>

          <form onSubmit={handleAuth} className="px-8 pb-8 space-y-4">
            {/* ROLE SELECT */}
            <div className="space-y-1 relative">
              <label className="text-[11px] font-bold uppercase tracking-widest text-blue-600 ml-1">
                Access Level
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-slate-700 appearance-none cursor-pointer"
                >
                  <option value="worker">Worker Login</option>
                  <option value="company">Company Login</option>
                  {!isRegistering && showAdmin && (
                    <option value="admin">System Administrator</option>
                  )}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={18}
                />
              </div>
            </div>

            {/* FULL NAME (Registration Only) */}
            {isRegistering && (
              <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                  {role === "company" ? "Organization Name" : "Full Name"}
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Type here..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>
            )}

            {/* EMAIL */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@imtc.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>

            {/* IP (Admin Only) */}
            {role === "admin" && !isRegistering && (
              <div className="space-y-1 animate-in fade-in duration-300">
                <label className="text-[11px] font-bold uppercase tracking-widest text-red-500 ml-1">
                  Secure IP Verification
                </label>
                <div className="relative">
                  <Globe
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                    placeholder="192.168.1.1"
                    className="w-full pl-10 pr-4 py-3 bg-red-50/50 border border-red-100 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>
            )}

            {/* SPINNING LOADER BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-700 active:scale-[0.98] transition-all mt-4 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{isRegistering ? "Register Now" : "Sign In"}</span>
              )}
            </button>

            {/* MODE TOGGLE */}
            <div className="text-center mt-6">
              <p className="text-sm text-slate-500 font-medium">
                {isRegistering ? "Already have an account?" : "New to IMTC?"}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="ml-2 text-blue-600 font-extrabold hover:underline underline-offset-4 cursor-pointer"
                >
                  {isRegistering ? "Log In" : "Register Now"}
                </button>
              </p>
            </div>
          </form>

          <div className="bg-slate-50 border-t border-slate-100 py-4 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              IMTC GLOBAL SYSTEMS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
