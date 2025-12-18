import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Briefcase,
  Users,
  Clock,
  Wallet,
  DollarSign,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Sample data - Replace with your actual API data
const dashboardData = {
  summary: {
    totalCompanies: 156,
    activeJobs: 342,
    totalCandidates: 1250,
    pendingCompanies: 24,
    totalWallet: 125000,
    monthlyRevenue: 45000,
  },
  monthlyRevenue: [
    { month: "Jan", revenue: 40000, jobs: 120 },
    { month: "Feb", revenue: 42000, jobs: 135 },
    { month: "Mar", revenue: 38000, jobs: 110 },
    { month: "Apr", revenue: 45000, jobs: 150 },
    { month: "May", revenue: 48000, jobs: 160 },
    { month: "Jun", revenue: 52000, jobs: 180 },
    { month: "Jul", revenue: 55000, jobs: 190 },
  ],
  companyTypes: [
    { name: "IT", value: 65, color: "#3b82f6" },
    { name: "Manufacturing", value: 25, color: "#10b981" },
    { name: "Healthcare", value: 15, color: "#8b5cf6" },
    { name: "Education", value: 20, color: "#f59e0b" },
    { name: "Finance", value: 18, color: "#ef4444" },
  ],
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Stats cards data
  const statsCards = [
    {
      id: 1,
      title: "Total Companies",
      value: dashboardData.summary.totalCompanies,
      icon: <Building2 className="h-6 w-6" />,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: 2,
      title: "Active Jobs",
      value: dashboardData.summary.activeJobs,
      icon: <Briefcase className="h-6 w-6" />,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: 3,
      title: "Total Candidates",
      value: dashboardData.summary.totalCandidates.toLocaleString(),
      icon: <Users className="h-6 w-6" />,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: 4,
      title: "Pending Companies",
      value: dashboardData.summary.pendingCompanies,
      icon: <Clock className="h-6 w-6" />,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      id: 5,
      title: "Wallet Balance",
      value: formatCurrency(dashboardData.summary.totalWallet),
      icon: <Wallet className="h-6 w-6" />,
      color: "bg-indigo-500",
      textColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      id: 6,
      title: "Monthly Revenue",
      value: formatCurrency(dashboardData.summary.monthlyRevenue),
      icon: <DollarSign className="h-6 w-6" />,
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        {statsCards.map((card) => (
          <motion.div
            key={card.id}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start">
              <div className={`p-3 ${card.bgColor} rounded-lg`}>
                <div className={card.textColor}>{card.icon}</div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {card.value}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Revenue & Jobs Overview
            </h3>
            <p className="text-sm text-gray-600">Monthly performance metrics</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    value.toLocaleString(),
                    value > 1000 ? "Revenue (₹)" : "Jobs",
                  ]}
                  labelStyle={{ color: "#374151" }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue (₹)"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="jobs"
                  name="Active Jobs"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Company Types Chart */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Company Distribution
            </h3>
            <p className="text-sm text-gray-600">By industry type</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.companyTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {dashboardData.companyTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
