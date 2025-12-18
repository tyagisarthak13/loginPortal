import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CreditCard,
  User,
  Building2,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Eye,
} from "lucide-react";

// Sample data
import { initialTransactions } from "../utils/initialTranaction";

// Animation variants
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
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

const Wallets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [transactions, setTransactions] = useState(initialTransactions);

  // Filter states
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Get unique values for filters
  const companies = ["all", ...new Set(transactions.map((t) => t.company))];
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
  ];

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "credit", label: "Credits" },
    { value: "debit", label: "Debits" },
  ];

  const dateOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
  ];

  // Calculate wallet summary
  const walletSummary = {
    totalBalance: 29500,
    totalCredits: transactions
      .filter((t) => t.type === "credit" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0),
    totalDebits: transactions
      .filter((t) => t.type === "debit" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0),
    pendingTransactions: transactions.filter((t) => t.status === "pending")
      .length,
  };

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter((transaction) => {
      const matchesSearch =
        !searchTerm ||
        transaction.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.transactionId
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesType =
        typeFilter === "all" || transaction.type === typeFilter;

      const matchesStatus =
        statusFilter === "all" || transaction.status === statusFilter;

      const matchesDate =
        dateFilter === "all" ||
        (dateFilter === "today" &&
          new Date(transaction.date).toDateString() ===
            new Date().toDateString()) ||
        (dateFilter === "week" &&
          (new Date() - new Date(transaction.date)) / (1000 * 60 * 60 * 24) <=
            7) ||
        (dateFilter === "month" &&
          new Date(transaction.date).getMonth() === new Date().getMonth() &&
          new Date(transaction.date).getFullYear() ===
            new Date().getFullYear());

      return matchesSearch && matchesType && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === "oldest") {
        return new Date(a.date) - new Date(b.date);
      } else if (sortBy === "amount_high") {
        return b.amount - a.amount;
      } else if (sortBy === "amount_low") {
        return a.amount - b.amount;
      } else {
        return a.company.localeCompare(b.company);
      }
    });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const clearFilters = () => {
    setTypeFilter("all");
    setStatusFilter("all");
    setDateFilter("all");
    setSearchTerm("");
    setSortBy("newest");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        icon: <CheckCircle className="h-4 w-4" />,
        text: "Completed",
        color: "bg-green-100 text-green-800 border-green-200",
        iconColor: "text-green-500",
      },
      pending: {
        icon: <RefreshCw className="h-4 w-4" />,
        text: "Pending",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        iconColor: "text-yellow-500",
      },
      failed: {
        icon: <XCircle className="h-4 w-4" />,
        text: "Failed",
        color: "bg-red-100 text-red-800 border-red-200",
        iconColor: "text-red-500",
      },
    };

    const config = statusConfig[status];
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${config.color}`}
      >
        <span className={config.iconColor}>{config.icon}</span>
        <span className="text-sm font-medium">{config.text}</span>
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const exportToCSV = () => {
    alert("Export feature would download CSV file");
    // In real app: Generate and download CSV
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="space-y-4 md:space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Wallet Transactions
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage and view all wallet transactions
          </p>
        </div>
      </motion.div>

      {/* Wallet Summary Cards */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Balance</p>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(walletSummary.totalBalance)}
              </p>
            </div>
            <Wallet className="h-10 w-10 opacity-80" />
          </div>
          <p className="text-xs mt-3 opacity-90">Available for use</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Credits</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {formatCurrency(walletSummary.totalCredits)}
              </p>
            </div>
            <ArrowUpRight className="h-10 w-10 text-green-500" />
          </div>
          <p className="text-xs text-gray-500 mt-3">From company payments</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Debits</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {formatCurrency(walletSummary.totalDebits)}
              </p>
            </div>
            <ArrowDownRight className="h-10 w-10 text-red-500" />
          </div>
          <p className="text-xs text-gray-500 mt-3">For platform services</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Transactions</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {walletSummary.pendingTransactions}
              </p>
            </div>
            <RefreshCw className="h-10 w-10 text-yellow-500" />
          </div>
          <p className="text-xs text-gray-500 mt-3">Awaiting clearance</p>
        </div>
      </motion.div>

      {/* Search and Filters Bar */}
      <motion.div variants={itemVariants}>
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by company name, transaction ID, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Filter and Clear Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              >
                <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Filters</span>
                <ChevronDown
                  className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              <button
                onClick={exportToCSV}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              >
                <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Export</span>
              </button>

              {(typeFilter !== "all" ||
                statusFilter !== "all" ||
                dateFilter !== "all" ||
                sortBy !== "newest") && (
                <button
                  onClick={clearFilters}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors cursor-pointer text-sm sm:text-base whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Type Filter */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Transaction Type
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none cursor-pointer text-sm"
                  >
                    {typeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none cursor-pointer text-sm"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Date Range
                  </label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none cursor-pointer text-sm"
                  >
                    {dateOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none cursor-pointer text-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="amount_high">Amount (High to Low)</option>
                    <option value="amount_low">Amount (Low to High)</option>
                    <option value="company">Company Name A-Z</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Results Info */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <p className="text-sm sm:text-base text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredTransactions.length}
              </span>{" "}
              transactions
              {searchTerm && (
                <span>
                  {" "}
                  for "
                  <span className="font-semibold text-gray-900">
                    {searchTerm}
                  </span>
                  "
                </span>
              )}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Transactions List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3 sm:space-y-4"
      >
        {filteredTransactions.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 text-center"
          >
            <CreditCard className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2">
              No transactions found
            </h3>
            <p className="text-sm text-gray-600 mb-3 sm:mb-4">
              Try adjusting your search or filters
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              Clear All Filters
            </button>
          </motion.div>
        ) : (
          <AnimatePresence>
            {filteredTransactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                layout
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -10 }}
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Transaction Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          transaction.type === "credit"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {transaction.type === "credit" ? (
                          <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {transaction.company}
                          </h3>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(transaction.status)}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1 truncate">
                            <Building2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="truncate">
                              {transaction.companyId}
                            </span>
                          </span>
                          <span className="flex items-center gap-1 truncate">
                            <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="truncate">
                              {transaction.transactionId}
                            </span>
                          </span>
                          <span className="flex items-center gap-1 truncate">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="truncate">
                              {formatDate(transaction.date)}
                            </span>
                          </span>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm text-gray-700">
                            {transaction.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={`text-lg sm:text-xl font-bold ${
                              transaction.type === "credit"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.type === "credit" ? "+" : "-"}{" "}
                            {formatCurrency(transaction.amount)}
                          </span>
                          <span className="text-sm text-gray-500">
                            Balance: {formatCurrency(transaction.balance)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Wallets;
