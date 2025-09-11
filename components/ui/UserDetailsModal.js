import React, { useState, useContext } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  Shield,
  Key,
  Ban,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import { MyContext } from "@/context/context";

const UserDetailsModal = ({ user, isOpen, onClose, onUpdate }) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const context = useContext(MyContext);

  if (!isOpen || !user) return null;

  const handleToggleSuspension = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setLoading(true);
      const response = await axios.post(
        `/api/admin/users/${user._id}/toggle-suspension`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        context?.customToast({
          success: true,
          message: `User ${user.isSuspended ? 'unsuspended' : 'suspended'} successfully`,
        });
        onUpdate();
        onClose();
      } else {
        context?.customToast({
          success: false,
          message: response.data.message || "Failed to update suspension status",
        });
      }
    } catch (error) {
      console.error("Error toggling suspension:", error);
      context?.customToast({
        success: false,
        message: error.response?.data?.message || "Error updating suspension status",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!newPassword || newPassword.length < 6) {
      context?.customToast({
        success: false,
        message: "Password must be at least 6 characters long",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `/api/admin/users/${user._id}/reset-password`,
        { newPassword },
        { withCredentials: true }
      );

      if (response.data.success) {
        context?.customToast({
          success: true,
          message: "Password reset successfully",
        });
        setNewPassword("");
        setIsChangingPassword(false);
      } else {
        context?.customToast({
          success: false,
          message: response.data.message || "Failed to reset password",
        });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      context?.customToast({
        success: false,
        message: error.response?.data?.message || "Error resetting password",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "vendor":
        return "bg-blue-100 text-blue-800";
      case "freelancer":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Avatar and Basic Info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              {user.profile?.avatarUrl &&
              user.profile.avatarUrl !== "https://default-avatar-url.com" &&
              user.profile.avatarUrl !== "/default-avatar.png" ? (
                <img
                  src={user.profile.avatarUrl}
                  alt={user.profile?.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user.profile?.name || "N/A"}
              </h3>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                    user.role
                  )}`}
                >
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    user.isApproved
                  )}`}
                >
                  {user.isApproved?.charAt(0).toUpperCase() +
                    user.isApproved?.slice(1)}
                </span>
                {user.isSuspended && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Suspended
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Contact Information</h4>

              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{user.email}</span>
              </div>

              {user.profile?.phoneNumber && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {user.profile.phoneNumber}
                  </span>
                </div>
              )}

              {user.profile?.address && (
                <div className="flex items-start space-x-3">
                  <Building className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-600">
                    {user.profile.address}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Company Information</h4>

              {user.profile?.companyName && (
                <div className="flex items-center space-x-3">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {user.profile.companyName}
                  </span>
                </div>
              )}

              {user.profile?.companyRole && (
                <div className="flex items-start space-x-3">
                  <Shield className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-600">
                    {user.profile.companyRole}
                  </span>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Joined {formatDate(user.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Password Reset Section */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-medium text-gray-900 mb-3">
              Password Management
            </h4>
            {!isChangingPassword ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsChangingPassword(true);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-[#446E6D] text-white rounded-lg hover:bg-[#3a5c5b] transition-colors"
              >
                <Key className="w-4 h-4" />
                <span>Reset Password</span>
              </button>
            ) : (
              <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
                <div className="space-y-3">
                  {/* Hidden dummy fields to confuse autofill */}
                  <input
                    type="text"
                    style={{ display: "none" }}
                    autoComplete="off"
                    tabIndex="-1"
                  />
                  <input
                    type="password"
                    style={{ display: "none" }}
                    autoComplete="off"
                    tabIndex="-1"
                  />
                  <input
                    type="password"
                    placeholder="Enter new password (min 6 characters)"
                    value={newPassword}
                    onChange={(e) => {
                      e.stopPropagation();
                      setNewPassword(e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    name="admin-reset-password-field"
                    data-form-type="other"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
                  />
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handlePasswordReset}
                      disabled={loading || !newPassword}
                      className="px-4 py-2 bg-[#446E6D] text-white rounded-lg hover:bg-[#3a5c5b] transition-colors disabled:opacity-50"
                    >
                      {loading ? "Resetting..." : "Reset Password"}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsChangingPassword(false);
                        setNewPassword("");
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 flex justify-between">
          <button
            onClick={handleToggleSuspension}
            disabled={loading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              user.isSuspended
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-red-100 text-red-800 hover:bg-red-200"
            }`}
          >
            {user.isSuspended ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Unban User</span>
              </>
            ) : (
              <>
                <Ban className="w-4 h-4" />
                <span>Ban User</span>
              </>
            )}
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
