import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  Building2,
  MapPin,
  CheckCircle,
  Clock,
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  DollarSign,
} from "lucide-react";

const MySwal = withReactContent(Swal);

const CompanyDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialCompany = location.state?.company;
  const [company, setCompany] = useState(initialCompany);

  if (!company) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Company not found</p>
          <button
            onClick={() => navigate("/companies")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Back to Companies
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      verified: {
        icon: <CheckCircle className="h-5 w-5" />,
        text: "Verified",
        color: "bg-green-100 text-green-800 border-green-200",
        iconColor: "text-green-500",
      },
      pending: {
        icon: <Clock className="h-5 w-5" />,
        text: "Pending",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        iconColor: "text-yellow-500",
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
    if (newStatus === company.status) return;

    setCompany((prev) => ({
      ...prev,
      status: newStatus,
    }));

    MySwal.fire({
      icon: "success",
      title: "Status Updated",
      text: `Company marked as ${
        newStatus === "verified" ? "Verified" : "Pending"
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

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-4 sm:p-6"
    >
      {/* Back */}
      <button
        onClick={() => navigate("/companies")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 cursor-pointer"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Companies
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {company.name}
              </h1>
              <div className="mb-3">{getStatusBadge(company.status)}</div>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {company.email}
                </span>
                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {company.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Status Management moved here */}
          <div className="w-full md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Status
            </label>
            <select
              value={company.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Company Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Company Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Detail label="Industry" value={company.industry} />
              <Detail
                label="Country"
                value={
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {company.country}
                  </span>
                }
              />
              <Detail
                label="Registration Date"
                value={
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {formatDate(company.registrationDate)}
                  </span>
                }
              />
              <Detail
                label="Status"
                value={
                  company.status === "verified"
                    ? "Verified"
                    : "Pending Verification"
                }
              />
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Company Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {company.description ||
                  "This company is registered on the platform and actively uses our services for hiring and recruitment. Detailed description can be updated later from admin panel."}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: Stats */}
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-800">Jobs Posted</h3>
                <p className="text-3xl font-bold text-blue-900">
                  {company.jobsPosted}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-green-800">Wallet Balance</h3>
                <p className="text-3xl font-bold text-green-900">
                  {formatCurrency(company.walletBalance)}
                </p>
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

export default CompanyDetails;
