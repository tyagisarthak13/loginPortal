import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  Star,
  Award,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
} from "lucide-react";

const MySwal = withReactContent(Swal);

const CandidateDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialCandidate = location.state?.candidate;
  const [candidate, setCandidate] = useState(initialCandidate);

  if (!candidate) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Candidate not found</p>
          <button
            onClick={() => navigate("/candidates")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Back to Candidates
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusLower = status.toLowerCase();

    const statusConfig = {
      verified: {
        icon: <CheckCircle className="h-5 w-5" />,
        text: "Verified",
        color: "bg-green-100 text-green-800 border-green-200",
        iconColor: "text-green-500",
      },
      "not verified": {
        icon: <XCircle className="h-5 w-5" />,
        text: "Not Verified",
        color: "bg-red-100 text-red-800 border-red-200",
        iconColor: "text-red-500",
      },
    };

    const config = statusConfig[statusLower] || statusConfig["not verified"];
    return (
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${config.color}`}
      >
        <span className={config.iconColor}>{config.icon}</span>
        <span className="font-medium">{config.text}</span>
      </div>
    );
  };

  const handleStatusChange = (newStatus) => {
    if (newStatus === candidate.status) return;

    setCandidate((prev) => ({
      ...prev,
      status: newStatus,
    }));

    MySwal.fire({
      icon: "success",
      title: "Status Updated",
      text: `Candidate marked as ${newStatus}`,
      timer: 1600,
      showConfirmButton: false,
    });
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-4 sm:p-6"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/candidates")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 cursor-pointer"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Candidates
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-blue-100 rounded-xl flex items-center justify-center">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {candidate.name}
              </h1>
              <div className="mb-3">{getStatusBadge(candidate.status)}</div>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {candidate.email}
                </span>
                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {candidate.phone}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {candidate.location}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  <Briefcase className="h-3 w-3" />
                  {candidate.experience}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  <GraduationCap className="h-3 w-3" />
                  {candidate.education}
                </span>
              </div>
            </div>
          </div>

          {/* Status Management & Actions */}
          <div className="w-full md:w-64 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Candidate Status
              </label>
              <select
                value={candidate.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Verified">Verified</option>
                <option value="Not Verified">Not Verified</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Candidate Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Detail label="Full Name" value={candidate.name} />
              <Detail
                label="Email"
                value={
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {candidate.email}
                  </span>
                }
              />
              <Detail
                label="Phone"
                value={
                  <span className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {candidate.phone}
                  </span>
                }
              />
              <Detail
                label="Location"
                value={
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {candidate.location}
                  </span>
                }
              />
              <Detail
                label="Experience"
                value={
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    {candidate.experience}
                  </span>
                }
              />
              <Detail
                label="Education"
                value={
                  <span className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                    {candidate.education}
                  </span>
                }
              />
              <Detail
                label="Last Active"
                value={
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {formatDate(candidate.lastActive)}
                  </span>
                }
              />
              <Detail label="Status" value={candidate.status} />
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Star className="h-5 w-5" />
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* About */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                About Candidate
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Experienced frontend developer with expertise in React.js,
                TypeScript, and modern web development practices. Passionate
                about creating responsive, accessible, and performant web
                applications. Strong problem-solving skills and ability to work
                in agile environments.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: Stats & Social */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-800">Applied Jobs</h3>
                <p className="text-3xl font-bold text-blue-900">
                  {candidate.appliedJobs}
                </p>
              </div>
            </div>
            <p className="text-sm text-blue-700">
              Total jobs applied by candidate
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-green-800">Skills</h3>
                <p className="text-3xl font-bold text-green-900">
                  {candidate.skills.length}
                </p>
              </div>
            </div>
            <p className="text-sm text-green-700">
              Total technical skills listed
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Detail = ({ label, value }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <div className="text-gray-900">{value}</div>
  </div>
);

export default CandidateDetails;
