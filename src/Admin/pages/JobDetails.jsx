import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Mail,
  Phone,
  FileText,
} from "lucide-react";

const MySwal = withReactContent(Swal);

const JobDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialJob = location.state?.job;
  const [job, setJob] = useState(initialJob);

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Job not found</p>
          <button
            onClick={() => navigate("/requirements")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        icon: <CheckCircle className="h-5 w-5" />,
        text: "Active",
        color: "bg-green-100 text-green-800 border-green-200",
        iconColor: "text-green-500",
      },
      paused: {
        icon: <Clock className="h-5 w-5" />,
        text: "Paused",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        iconColor: "text-yellow-500",
      },
      closed: {
        icon: <XCircle className="h-5 w-5" />,
        text: "Closed",
        color: "bg-red-100 text-red-800 border-red-200",
        iconColor: "text-red-500",
      },
    };

    const config = statusConfig[status];
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
    if (newStatus === job.status) return;

    setJob((prev) => ({
      ...prev,
      status: newStatus,
    }));

    MySwal.fire({
      icon: "success",
      title: "Status Updated",
      text: `Job marked as ${
        newStatus === "active"
          ? "Active"
          : newStatus === "paused"
          ? "Paused"
          : "Closed"
      }`,
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
        onClick={() => navigate("/jobs")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 cursor-pointer"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Jobs
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {job.title}
              </h1>
              <div className="mb-3">{getStatusBadge(job.status)}</div>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {job.company}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  {job.salary}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {job.type}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {job.experience}
                </span>
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div className="w-full md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Status
            </label>
            <select
              value={job.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Job Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Job Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Detail label="Company" value={job.company} />
              <Detail
                label="Location"
                value={
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {job.location}
                  </span>
                }
              />
              <Detail label="Job Type" value={job.type} />
              <Detail
                label="Salary"
                value={
                  <span className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    {job.salary}
                  </span>
                }
              />
              <Detail label="Experience Required" value={job.experience} />
              <Detail
                label="Posted Date"
                value={
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {formatDate(job.postedDate)}
                  </span>
                }
              />
              <Detail
                label="Status"
                value={
                  job.status === "active"
                    ? "Active"
                    : job.status === "paused"
                    ? "Paused"
                    : "Closed"
                }
              />
              <Detail
                label="Total Applicants"
                value={
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    {job.applicants}
                  </span>
                }
              />
            </div>

            {/* Requirements */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Technical Requirements
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed">
                  {job.requirements}
                </p>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Job Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {job.description ||
                  "This is a detailed job description that outlines the responsibilities, qualifications, and expectations for this position. The role requires the candidate to demonstrate expertise in the mentioned technical requirements and contribute to the company's objectives."}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: Stats & Actions */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-800">Applicants</h3>
                <p className="text-3xl font-bold text-blue-900">
                  {job.applicants}
                </p>
              </div>
            </div>
            <p className="text-sm text-blue-700">
              Total number of candidates who applied
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-green-800">Days Active</h3>
                <p className="text-3xl font-bold text-green-900">
                  {Math.floor(
                    (new Date() - new Date(job.postedDate)) /
                      (1000 * 60 * 60 * 24)
                  )}
                </p>
              </div>
            </div>
            <p className="text-sm text-green-700">Days since job was posted</p>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-medium text-gray-900 mb-4">Quick Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">
                  jobs@{job.company.toLowerCase().replace(/\s+/g, "")}.com
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">+91 98765 43210</span>
              </div>
            </div>
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

export default JobDetails;
