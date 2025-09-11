"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import ReusableTable from "@/components/ui/ReusableTable";
import PageHeader from "@/components/ui/PageHeader";
import UserDetailsModal from "@/components/ui/UserDetailsModal";
import { UserCheck, UserX, Clock, User, Eye } from "lucide-react";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("approved");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Stable image error handler
  const handleImageError = useCallback((e) => {
    e.target.src = "/default-avatar.png";
  }, []);

  // Fetch function with stable reference
  const fetchUsers = useCallback(
    async (page = 1, search = "", role = "", status) => {
      setLoading(true);
      try {
        const params = {
          status: status,
          page: page.toString(),
          limit: "10",
        };

        if (search) params.search = search;
        if (role) params.filterby = role;

        const response = await axios.get("/api/admin/users", {
          params,
          withCredentials: true,
        });

        if (response.data.success) {
          setUsers(response.data.users);
          setPagination(response.data.pagination);
        } else {
          setUsers([]);
          setPagination(null);
        }
      } catch (error) {
        setUsers([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    },
    []
  ); // Empty dependencies for stable reference

  // View user handler
  const handleViewUser = useCallback((user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  }, []);

  // Close modal handler
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUser(null);
  }, []);

  // Update handler for modal actions
  const handleUserUpdate = useCallback(() => {
    fetchUsers(pagination?.currentPage || 1, searchTerm, roleFilter, activeTab);
  }, [fetchUsers, pagination?.currentPage, searchTerm, roleFilter, activeTab]);

  // User action handler
  const handleUserAction = useCallback(
    async (userId, action) => {
      try {
        const response = await axios.post(
          `/api/admin/users/${userId}/${action}`,
          {},
          { withCredentials: true }
        );

        if (response.data.success) {
          // Pass current values as parameters
          fetchUsers(
            pagination?.currentPage || 1,
            searchTerm,
            roleFilter,
            activeTab
          );
        } else {
          // Silent fail for better UX
        }
      } catch (error) {
        // Silent fail for better UX
      }
    },
    [fetchUsers, pagination?.currentPage, searchTerm, roleFilter, activeTab]
  );

  // STABLE data
  const tabs = useMemo(
    () => [
      {
        id: "approved",
        label: "Approved",
        icon: UserCheck,
        color: "text-green-600",
      },
      {
        id: "pending",
        label: "Pending",
        icon: Clock,
        color: "text-yellow-600",
      },
      { id: "rejected", label: "Rejected", icon: UserX, color: "text-red-600" },
    ],
    []
  );

  const roleOptions = useMemo(
    () => [
      { value: "user", label: "User" },
      { value: "vendor", label: "Vendor" },
      { value: "freelancer", label: "Freelancer" },
      { value: "admin", label: "Admin" },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        key: "profile.name",
        label: "Name",
        render: (user) => {
          const avatarUrl = user?.profile?.avatarUrl;
          const hasValidAvatar =
            avatarUrl &&
            avatarUrl !== "https://default-avatar-url.com" &&
            avatarUrl !== "/default-avatar.png" &&
            avatarUrl.trim() !== "";

          return (
            <div className="flex items-center">
              {hasValidAvatar ? (
                <img
                  src={avatarUrl}
                  alt={user?.profile?.name}
                  className="w-8 h-8 rounded-full mr-3 object-cover"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-8 h-8 rounded-full mr-3 bg-gray-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
              )}
              <span className="font-medium">
                {user?.profile?.name || "N/A"}
              </span>
            </div>
          );
        },
      },
      { key: "email", label: "Email" },
      {
        key: "profile.phoneNumber",
        label: "Phone",
        render: (user) => user?.profile?.phoneNumber || "-",
      },
      {
        key: "role",
        label: "Role",
        render: (user) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              user.role === "admin"
                ? "bg-purple-100 text-purple-800"
                : user.role === "vendor"
                ? "bg-blue-100 text-blue-800"
                : user.role === "freelancer"
                ? "bg-orange-100 text-orange-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        ),
      },
      {
        key: "isApproved",
        label: "Approval",
        render: (user) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              user.isApproved === "approved"
                ? "bg-green-100 text-green-800"
                : user.isApproved === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {user.isApproved?.charAt(0).toUpperCase() +
              user.isApproved?.slice(1)}
          </span>
        ),
      },
      {
        key: "isSuspended",
        label: "Suspension",
        render: (user) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              user.isSuspended
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {user.isSuspended ? "Suspended" : "Active"}
          </span>
        ),
      },
      {
        key: "profile.companyName",
        label: "Company",
        render: (user) => user.profile?.companyName || "-",
      },
      {
        key: "createdAt",
        label: "Joined",
        render: (user) => new Date(user.createdAt).toLocaleDateString(),
      },
    ],
    [handleImageError]
  );

  const filters = useMemo(
    () => [{ key: "filterby", label: "Role", options: roleOptions }],
    [roleOptions]
  );

  const tableActions = useMemo(() => {
    const actions = [
      {
        label: "View",
        onClick: handleViewUser,
        className: "bg-[#446E6D]/10 text-[#446E6D] hover:bg-[#446E6D]/20",
        icon: <Eye className="w-3 h-3" />,
      },
    ];

    if (activeTab === "pending") {
      actions.push(
        {
          label: "Approve",
          onClick: (user) => handleUserAction(user._id, "approve"),
          className: "bg-green-100 text-green-800 hover:bg-green-200",
        },
        {
          label: "Reject",
          onClick: (user) => handleUserAction(user._id, "reject"),
          className: "bg-red-100 text-red-800 hover:bg-red-200",
        }
      );
    }

    return actions;
  }, [activeTab, handleUserAction, handleViewUser]);

  // STABLE handlers
  const handleSearch = useCallback(
    (search) => {
      setSearchTerm(search);
      fetchUsers(1, search, roleFilter, activeTab);
    },
    [fetchUsers, roleFilter, activeTab]
  );

  const handleFilter = useCallback(
    (filterValues) => {
      const role = filterValues.filterby || "";
      setRoleFilter(role);
      fetchUsers(1, searchTerm, role, activeTab);
    },
    [fetchUsers, searchTerm, activeTab]
  );

  const handlePageChange = useCallback(
    (page) => {
      fetchUsers(page, searchTerm, roleFilter, activeTab);
    },
    [fetchUsers, searchTerm, roleFilter, activeTab]
  );

  const stats = useMemo(
    () => ({
      approved: 0,
      pending: 0,
      rejected: 0,
    }),
    []
  );

  // Effect
  useEffect(() => {
    fetchUsers(1, searchTerm, roleFilter, activeTab);
  }, [activeTab]); // Only activeTab, not fetchUsers

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className=" mx-auto">
        <PageHeader
          title="User Management"
          description="Manage user accounts and approval status"
        />

        {/* Tabs */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <nav className="flex space-x-0 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-6 font-medium text-sm border-b-2 transition-colors min-w-max ${
                      isActive
                        ? "border-[#446E6D] text-[#446E6D] bg-[#446E6D]/5"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-[#446E6D]" : tab.color
                      }`}
                    />
                    {tab.label}
                    {stats[tab.id] > 0 && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isActive
                            ? "bg-[#446E6D]/10 text-[#446E6D]"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {stats[tab.id]}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Table */}
        <ReusableTable
          data={users}
          columns={columns}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onFilter={handleFilter}
          searchPlaceholder="Search by name, email, company, or phone..."
          filters={filters}
          actions={tableActions}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        />

        {/* User Details Modal */}
        <UserDetailsModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdate={handleUserUpdate}
        />
      </div>
    </div>
  );
};

export default UserManagement;
