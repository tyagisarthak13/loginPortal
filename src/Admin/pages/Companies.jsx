import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Building2,
  MapPin,
  CheckCircle,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  ChevronRight,
} from "lucide-react";

// Sample data - Replace with your actual API data
import { initialCompanies } from "../utils/initialsCompanies";

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

const Companies = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [companies, setCompanies] = useState(initialCompanies);

  // Filter states
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");

  // Get unique values for filters
  const countries = ["all", ...new Set(companies.map((c) => c.country))];
  const industries = ["all", ...new Set(companies.map((c) => c.industry))];
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "verified", label: "Verified" },
    { value: "pending", label: "Pending" },
  ];

  // Filter and sort companies
  const filteredCompanies = companies
    .filter((company) => {
      const matchesSearch =
        !searchTerm ||
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesVerification =
        verificationFilter === "all" || company.status === verificationFilter;

      const matchesCountry =
        countryFilter === "all" || company.country === countryFilter;

      const matchesIndustry =
        industryFilter === "all" || company.industry === industryFilter;

      return (
        matchesSearch &&
        matchesVerification &&
        matchesCountry &&
        matchesIndustry
      );
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.registrationDate) - new Date(a.registrationDate);
      } else {
        // oldest
        return new Date(a.registrationDate) - new Date(b.registrationDate);
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
    setVerificationFilter("all");
    setCountryFilter("all");
    setIndustryFilter("all");
    setSearchTerm("");
    setSortBy("newest");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      verified: {
        icon: <CheckCircle className="h-4 w-4" />,
        text: "Verified",
        color: "bg-green-100 text-green-800 border-green-200",
        iconColor: "text-green-500",
      },
      pending: {
        icon: <Clock className="h-4 w-4" />,
        text: "Pending",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        iconColor: "text-yellow-500",
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
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const viewCompanyDetails = (company) => {
    // Navigate to company details page
    navigate(`/admin/companies/${company.id}`, { state: { company } });
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
            All Companies
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage and view all registered companies
          </p>
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
                  placeholder="Search companies..."
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

              {(verificationFilter !== "all" ||
                countryFilter !== "all" ||
                industryFilter !== "all" ||
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
                {/* Verification Status Filter */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Status
                  </label>
                  <select
                    value={verificationFilter}
                    onChange={(e) => setVerificationFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none cursor-pointer text-sm"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Country Filter */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Country
                  </label>
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none cursor-pointer text-sm"
                  >
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country === "all" ? "All Countries" : country}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Industry Filter */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Industry
                  </label>
                  <select
                    value={industryFilter}
                    onChange={(e) => setIndustryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none cursor-pointer text-sm"
                  >
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry === "all" ? "All Industries" : industry}
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
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Results Info and Sort Buttons */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <p className="text-sm sm:text-base text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredCompanies.length}
              </span>{" "}
              companies
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

      {/* Companies List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3 sm:space-y-4"
      >
        {filteredCompanies.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 text-center"
          >
            <Building2 className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2">
              No companies found
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
            {filteredCompanies.map((company) => (
              <motion.div
                key={company.id}
                layout
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -10 }}
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Company Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {company.name}
                          </h3>

                          {/* Status Badge Only */}
                          <div className="flex items-center gap-2">
                            {getStatusBadge(company.status)}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1 truncate">
                            <svg
                              className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="truncate">{company.email}</span>
                          </span>

                          <span className="flex items-center gap-1 truncate">
                            <svg
                              className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            <span className="truncate">{company.phone}</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-800 rounded-full text-xs sm:text-sm truncate max-w-full">
                            <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                            <span className="truncate">{company.country}</span>
                          </span>

                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-800 rounded-full text-xs sm:text-sm truncate max-w-full">
                            <span className="truncate">{company.industry}</span>
                          </span>

                          <span className="text-xs sm:text-sm text-gray-500 truncate">
                            Registered: {formatDate(company.registrationDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats and Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-end lg:items-end gap-3 sm:gap-4 lg:gap-4">
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="text-right min-w-[80px]">
                        <div className="text-xs sm:text-sm text-gray-600">
                          Jobs Posted
                        </div>
                        <div className="text-base sm:text-lg font-semibold text-gray-900">
                          {company.jobsPosted}
                        </div>
                      </div>
                      <div className="text-right min-w-[100px]">
                        <div className="text-xs sm:text-sm text-gray-600">
                          Wallet Balance
                        </div>
                        <div className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                          {formatCurrency(company.walletBalance)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => viewCompanyDetails(company)}
                      className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm sm:text-base whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                      View Details
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
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

export default Companies;
