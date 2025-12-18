import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Eye,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  Phone,
  Mail,
} from "lucide-react";

// Sample data - Replace with your actual API data
import { initialCandidates } from "../utils/initialCandidates";

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

const Candidates = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [candidates, setCandidates] = useState(initialCandidates);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");

  // Get unique values for filters
  const locations = ["all", ...new Set(candidates.map((c) => c.location))];
  const experiences = ["all", "1-2 years", "3-5 years", "5+ years"];
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "Verified", label: "Verified" }, // Changed from "available"
    { value: "Not Verified", label: "Not Verified" }, // Changed from "shortlisted"
  ];

  // Filter and sort candidates
  const filteredCandidates = candidates
    .filter((candidate) => {
      const matchesSearch =
        !searchTerm ||
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        statusFilter === "all" || candidate.status === statusFilter;

      const matchesLocation =
        locationFilter === "all" || candidate.location === locationFilter;

      const matchesExperience =
        experienceFilter === "all" ||
        (experienceFilter === "1-2 years" &&
          candidate.experience.includes("1") &&
          !candidate.experience.includes("5")) ||
        (experienceFilter === "3-5 years" &&
          candidate.experience.includes("3")) ||
        (experienceFilter === "5+ years" &&
          (candidate.experience.includes("5") ||
            candidate.experience.includes("6") ||
            candidate.experience.includes("7") ||
            candidate.experience.includes("8")));

      return (
        matchesSearch && matchesStatus && matchesLocation && matchesExperience
      );
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.lastActive) - new Date(a.lastActive);
      } else if (sortBy === "oldest") {
        return new Date(a.lastActive) - new Date(b.lastActive);
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else {
        // experience
        return (
          parseInt(b.experience) - parseInt(a.experience) ||
          a.experience.localeCompare(b.experience)
        );
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
    setStatusFilter("all");
    setLocationFilter("all");
    setExperienceFilter("all");
    setSearchTerm("");
    setSortBy("newest");
  };

  const getStatusBadge = (status) => {
    // Convert status to lowercase for comparison
    const statusLower = status.toLowerCase();

    const statusConfig = {
      verified: {
        // Changed from "available"
        icon: <CheckCircle className="h-4 w-4" />,
        text: "Verified",
        color: "bg-green-100 text-green-800 border-green-200",
        iconColor: "text-green-500",
      },
      "not verified": {
        // Changed from "shortlisted"
        icon: <XCircle className="h-4 w-4" />,
        text: "Not Verified",
        color: "bg-red-100 text-red-800 border-red-200",
        iconColor: "text-red-500",
      },
    };

    // Use the status config or default to "not verified"
    const config = statusConfig[statusLower] || statusConfig["not verified"];

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

  const viewCandidateDetails = (candidate) => {
    // Navigate to candidate details page
    navigate(`/admin/candidates/${candidate.id}`, { state: { candidate } });
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
            All Candidates
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage and view all registered candidates
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
                  placeholder="Search candidates by name, skills, or email..."
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

              {(statusFilter !== "all" ||
                locationFilter !== "all" ||
                experienceFilter !== "all" ||
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

                {/* Location Filter */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Location
                  </label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none cursor-pointer text-sm"
                  >
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location === "all" ? "All Locations" : location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Experience Filter */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Experience
                  </label>
                  <select
                    value={experienceFilter}
                    onChange={(e) => setExperienceFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none cursor-pointer text-sm"
                  >
                    {experiences.map((experience) => (
                      <option key={experience} value={experience}>
                        {experience === "all" ? "All Experience" : experience}
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
                    <option value="newest">Recently Active</option>
                    <option value="oldest">Oldest Active</option>
                    <option value="name">Name A-Z</option>
                    <option value="experience">Experience (High to Low)</option>
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
                {filteredCandidates.length}
              </span>{" "}
              candidates
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

      {/* Candidates List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3 sm:space-y-4"
      >
        {filteredCandidates.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 text-center"
          >
            <User className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2">
              No candidates found
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
            {filteredCandidates.map((candidate) => (
              <motion.div
                key={candidate.id}
                layout
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -10 }}
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Candidate Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {candidate.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(candidate.status)}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1 truncate">
                            <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="truncate">{candidate.email}</span>
                          </span>
                          <span className="flex items-center gap-1 truncate">
                            <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="truncate">{candidate.phone}</span>
                          </span>
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="truncate">
                              {candidate.location}
                            </span>
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-800 rounded-full text-xs sm:text-sm truncate max-w-full">
                            <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                            <span className="truncate">
                              {candidate.experience}
                            </span>
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-800 rounded-full text-xs sm:text-sm truncate max-w-full">
                            <GraduationCap className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                            <span className="truncate">
                              {candidate.education}
                            </span>
                          </span>
                          <span className="text-xs sm:text-sm text-gray-500 truncate">
                            Last active: {formatDate(candidate.lastActive)}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {candidate.skills.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 3 && (
                            <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              +{candidate.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats and Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-end lg:items-end gap-3 sm:gap-4 lg:gap-4">
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="text-right min-w-[80px]">
                        <div className="text-xs sm:text-sm text-gray-600">
                          Applied Jobs
                        </div>
                        <div className="text-base sm:text-lg font-semibold text-gray-900">
                          {candidate.appliedJobs}
                        </div>
                      </div>
                      <div className="text-right min-w-[100px]">
                        <div className="text-xs sm:text-sm text-gray-600">
                          Skills
                        </div>
                        <div className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                          {candidate.skills.length}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => viewCandidateDetails(candidate)}
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

export default Candidates;
