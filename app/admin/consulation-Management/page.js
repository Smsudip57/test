"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import axios from "axios";
import ReusableTable from "@/components/ui/ReusableTable";
import PageHeader from "@/components/ui/PageHeader";
import {
  Calendar,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Edit,
  User,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import { MyContext } from "@/context/context";

const ConsultationManagement = () => {
  // States
  const [activeTab, setActiveTab] = useState("pending");
  const [bookings, setBookings] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const context = useContext(MyContext);

  // Fetch bookings
  const fetchBookings = useCallback(async (page = 1, search = "", status) => {
    setLoading(true);
    try {
      const params = {
        status: status,
        page: page.toString(),
        limit: "10",
      };

      if (search) params.search = search;

      const response = await axios.get("/api/admin/bookings", {
        params,
        withCredentials: true,
      });

      if (response.data.success) {
        setBookings(response.data.bookings);
        setPagination(response.data.pagination);
      } else {
        setBookings([]);
        setPagination(null);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch availability
  const fetchAvailability = useCallback(async () => {
    setAvailabilityLoading(true);
    try {
      const response = await axios.get("/api/admin/availability", {
        withCredentials: true,
      });

      if (response.data.success) {
        setAvailability(response.data.availability);
      } else {
        setAvailability([]);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      setAvailability([]);
    } finally {
      setAvailabilityLoading(false);
    }
  }, []);

  // Effect to fetch data
  useEffect(() => {
    fetchBookings(1, searchTerm, activeTab);
  }, [fetchBookings, activeTab, searchTerm]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  // Handlers
  const handleBookingAction = useCallback(
    async (bookingId, action, reason = null) => {
      try {
        const response = await axios.post(
          `/api/admin/bookings/${bookingId}/${action}`,
          reason ? { reason } : {},
          { withCredentials: true }
        );

        if (response.data.success) {
          const actionText =
            action === "confirm"
              ? "confirmed"
              : action === "cancel"
              ? "cancelled"
              : action;
          context?.customToast({
            success: true,
            message: `Booking ${actionText} successfully`,
          });

          fetchBookings(pagination?.currentPage || 1, searchTerm, activeTab);
        } else {
          context?.customToast({
            success: false,
            message: response.data.message || `Failed to ${action} booking`,
          });
        }
      } catch (error) {
        context?.customToast({
          success: false,
          message:
            error.response?.data?.message || `Error ${action}ing booking`,
        });
      }
    },
    [fetchBookings, pagination?.currentPage, searchTerm, activeTab, context]
  );

  const handleViewBooking = useCallback((booking) => {
    setSelectedBooking(booking);
    setIsBookingModalOpen(true);
  }, []);

  const handleCloseBookingModal = useCallback(() => {
    setIsBookingModalOpen(false);
    setSelectedBooking(null);
  }, []);

  const handleAddAvailability = useCallback(() => {
    setSelectedAvailability(null);
    setIsAvailabilityModalOpen(true);
  }, []);

  const handleEditAvailability = useCallback((availability) => {
    setSelectedAvailability(availability);
    setIsAvailabilityModalOpen(true);
  }, []);

  const handleCloseAvailabilityModal = useCallback(() => {
    setIsAvailabilityModalOpen(false);
    setSelectedAvailability(null);
  }, []);

  // Memoized data
  const tabs = useMemo(
    () => [
      {
        id: "pending",
        label: "Pending",
        icon: AlertCircle,
        color: "text-yellow-600",
      },
      {
        id: "confirmed",
        label: "Confirmed",
        icon: CheckCircle,
        color: "text-green-600",
      },
      {
        id: "canceled",
        label: "Cancelled",
        icon: XCircle,
        color: "text-red-600",
      },
      {
        id: "ended",
        label: "Completed",
        icon: CheckCircle,
        color: "text-blue-600",
      },
    ],
    []
  );

  const bookingColumns = useMemo(
    () => [
      {
        key: "name",
        label: "Client",
        render: (booking) => (
          <div>
            <div className="font-medium">{booking?.name}</div>
            <div className="text-sm text-gray-500">{booking?.email}</div>
          </div>
        ),
      },
      {
        key: "productId",
        label: "Service",
        render: (booking) => booking.productId?.Title || "N/A",
      },
      {
        key: "date",
        label: "Date & Time",
        render: (booking) => (
          <div>
            <div className="font-medium">
              {new Date(booking?.date).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-500">
              {booking?.startTime} - {booking?.endTime}
            </div>
          </div>
        ),
      },
      {
        key: "status",
        label: "Status",
        render: (booking) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              booking?.status === "confirmed"
                ? "bg-green-100 text-green-800"
                : booking?.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : booking?.status === "canceled"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {booking?.status?.charAt(0).toUpperCase() +
              booking?.status?.slice(1)}
          </span>
        ),
      },
      {
        key: "phoneNumber",
        label: "Phone",
        render: (booking) => booking?.phoneNumber || "-",
      },
      {
        key: "createdAt",
        label: "Requested",
        render: (booking) => new Date(booking?.createdAt).toLocaleDateString(),
      },
    ],
    []
  );

  const bookingActions = useMemo(() => {
    const actions = [
      {
        label: "View",
        onClick: handleViewBooking,
        className: "bg-[#446E6D]/10 text-[#446E6D] hover:bg-[#446E6D]/20",
        icon: <Eye className="w-3 h-3" />,
      },
    ];

    if (activeTab === "pending") {
      actions.push(
        {
          label: "Confirm",
          onClick: (booking) => handleBookingAction(booking?._id, "confirm"),
          className: "bg-green-100 text-green-800 hover:bg-green-200",
          icon: <CheckCircle className="w-3 h-3" />,
        },
        {
          label: "Cancel",
          onClick: (booking) => handleBookingAction(booking?._id, "cancel"),
          className: "bg-red-100 text-red-800 hover:bg-red-200",
          icon: <XCircle className="w-3 h-3" />,
        }
      );
    }

    if (activeTab === "confirmed") {
      actions.push({
        label: "Mark Complete",
        onClick: (booking) => handleBookingAction(booking?._id, "end"),
        className: "bg-blue-100 text-blue-800 hover:bg-blue-200 text-nowrap",
        icon: <CheckCircle className="w-3 h-3" />,
      });
    }

    return actions;
  }, [activeTab, handleBookingAction, handleViewBooking]);

  const availabilityColumns = useMemo(
    () => [
      {
        key: "type",
        label: "Type",
        render: (item) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              item?.isRecurring
                ? "bg-blue-100 text-blue-800"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            {item?.isRecurring ? "Recurring" : "Specific Date"}
          </span>
        ),
      },
      {
        key: "schedule",
        label: "Schedule",
        render: (item) => (
          <div>
            {item?.isRecurring ? (
              <div className="font-medium">{item?.dayName}</div>
            ) : (
              <div className="font-medium">
                {new Date(item?.specificDate).toLocaleDateString()}
              </div>
            )}
            <div className="text-sm text-gray-500">
              {item?.startTime} - {item?.endTime}
            </div>
          </div>
        ),
      },
      {
        key: "slotDuration",
        label: "Duration",
        render: (item) => `${item?.slotDuration} mins`,
      },
      {
        key: "totalSlots",
        label: "Total Slots",
        render: (item) => item?.totalSlots || 0,
      },
      {
        key: "isActive",
        label: "Status",
        render: (item) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              item?.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {item?.isActive ? "Active" : "Inactive"}
          </span>
        ),
      },
    ],
    []
  );

  const availabilityActions = useMemo(
    () => [
      {
        label: "Edit",
        onClick: handleEditAvailability,
        className: "bg-[#446E6D]/10 text-[#446E6D] hover:bg-[#446E6D]/20",
        icon: <Edit className="w-3 h-3" />,
      },
    ],
    [handleEditAvailability]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        <PageHeader
          title="Consultation Management"
          description="Manage your consultation bookings and availability"
        />

        <div className="bg-white rounded-lg shadow-sm">
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "bookings" ||
                  tabs.some((tab) => tab.id === activeTab)
                    ? "border-[#446E6D] text-[#446E6D]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Bookings
              </button>
              <button
                onClick={() => setActiveTab("availability")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "availability"
                    ? "border-[#446E6D] text-[#446E6D]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Clock className="w-4 h-4 inline mr-2" />
                Availability
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "availability" ? (
              // Availability Management
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Your Availability Schedule
                  </h2>
                  <button
                    onClick={handleAddAvailability}
                    className="bg-[#446E6D] text-white px-4 py-2 rounded-md hover:bg-[#446E6D]/90 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Availability
                  </button>
                </div>

                <ReusableTable
                  data={availability}
                  columns={availabilityColumns}
                  actions={availabilityActions}
                  loading={availabilityLoading}
                  emptyMessage="No availability slots configured yet."
                />
              </div>
            ) : (
              // Bookings Management
              <div>
                {/* Sub-tabs for booking statuses */}
                <div className="flex space-x-1 mb-6 p-1 bg-gray-100 rounded-lg w-fit">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <Icon className={`w-4 h-4 mr-2 ${tab.color}`} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <ReusableTable
                  data={bookings}
                  columns={bookingColumns}
                  actions={bookingActions}
                  loading={loading}
                  pagination={pagination}
                  onPageChange={(page) =>
                    fetchBookings(page, searchTerm, activeTab)
                  }
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  emptyMessage={`No ${activeTab} bookings found.`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Booking Details Modal */}
        {isBookingModalOpen && selectedBooking && (
          <BookingDetailsModal
            booking={selectedBooking}
            onClose={handleCloseBookingModal}
            onAction={handleBookingAction}
          />
        )}

        {/* Availability Modal */}
        {isAvailabilityModalOpen && (
          <AvailabilityModal
            availability={selectedAvailability}
            onClose={handleCloseAvailabilityModal}
            onSuccess={() => {
              fetchAvailability();
              handleCloseAvailabilityModal();
            }}
          />
        )}
      </div>
    </div>
  );
};

// Booking Details Modal Component
const BookingDetailsModal = ({ booking, onClose, onAction }) => {
  const [actionReason, setActionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (action) => {
    setIsProcessing(true);
    try {
      await onAction(booking?._id, action, actionReason || null);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Booking Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Client Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">
                Client Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Name:</span>
                  <span className="ml-2 font-medium">{booking?.name}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="ml-2 font-medium">{booking?.email}</span>
                </div>
                {booking?.phoneNumber && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span className="ml-2 font-medium">
                      {booking?.phoneNumber}
                    </span>
                  </div>
                )}
              </div>

              {/* User Details (if registered user) */}
              {booking?.userId && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Registered Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">User ID:</span>
                      <span className="ml-2 font-medium">
                        {typeof booking?.userId === "object"
                          ? booking?.userId?._id
                          : booking?.userId}
                      </span>
                    </div>
                    {booking?.userId?.profile?.name && (
                      <div>
                        <span className="text-sm text-gray-600">Name:</span>
                        <span className="ml-2 font-medium">
                          {booking?.userId?.profile?.name}
                        </span>
                      </div>
                    )}
                    {booking?.userId?.email && (
                      <div>
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="ml-2 font-medium">
                          {booking?.userId?.email}
                        </span>
                      </div>
                    )}
                    {booking?.userId?.profile?.phoneNumber && (
                      <div>
                        <span className="text-sm text-gray-600">Phone:</span>
                        <span className="ml-2 font-medium">
                          {booking?.userId?.profile?.phoneNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Booking Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">
                Booking Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Service:</span>
                  <span className="ml-2 font-medium">
                    {booking?.productId?.Title || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Date:</span>
                  <span className="ml-2 font-medium">
                    {new Date(booking?.date).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Time:</span>
                  <span className="ml-2 font-medium">
                    {booking?.startTime} - {booking?.endTime}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      booking?.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : booking?.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : booking?.status === "canceled"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {booking?.status?.charAt(0).toUpperCase() +
                      booking?.status?.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {booking?.notes && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Client Notes
                </h3>
                <p className="text-sm text-gray-700">{booking?.notes}</p>
              </div>
            )}

            {/* Action Reason (for cancellation) */}
            {booking?.status === "pending" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason (optional)
                </label>
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                  placeholder="Enter reason for action..."
                />
              </div>
            )}

            {/* Action Buttons */}
            {booking?.status === "pending" && (
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleAction("cancel")}
                  disabled={isProcessing}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 disabled:opacity-50"
                >
                  Cancel Booking
                </button>
                <button
                  onClick={() => handleAction("confirm")}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  Confirm Booking
                </button>
              </div>
            )}

            {booking?.status === "confirmed" && (
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleAction("end")}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Mark as Completed
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Availability Modal Component
const AvailabilityModal = ({ availability, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    isRecurring: availability?.isRecurring ?? true,
    dayOfWeek: availability?.dayOfWeek ?? 1,
    specificDate: availability?.specificDate
      ? new Date(availability?.specificDate).toISOString().split("T")[0]
      : "",
    startTime: availability?.startTime ?? "09:00",
    endTime: availability?.endTime ?? "17:00",
    slotDuration: availability?.slotDuration ?? 30,
    isActive: availability?.isActive ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = availability
        ? `/api/admin/availability/${availability?._id}`
        : "/api/admin/availability";

      const method = availability ? "PUT" : "POST";

      const response = await axios({
        method,
        url,
        data: formData,
        withCredentials: true,
      });

      if (response.data.success) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving availability:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const dayOptions = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {availability ? "Edit" : "Add"} Availability
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={formData.isRecurring}
                    onChange={() =>
                      setFormData({ ...formData, isRecurring: true })
                    }
                    className="mr-2"
                  />
                  Recurring (Weekly)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!formData.isRecurring}
                    onChange={() =>
                      setFormData({ ...formData, isRecurring: false })
                    }
                    className="mr-2"
                  />
                  Specific Date
                </label>
              </div>
            </div>

            {/* Day/Date Selection */}
            {formData.isRecurring ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Day of Week
                </label>
                <select
                  value={formData.dayOfWeek}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dayOfWeek: parseInt(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  {dayOptions.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specific Date
                </label>
                <input
                  type="date"
                  value={formData.specificDate}
                  onChange={(e) =>
                    setFormData({ ...formData, specificDate: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  min={new Date().toISOString().split("T")[0]}
                  required={!formData.isRecurring}
                />
              </div>
            )}

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
            </div>

            {/* Slot Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slot Duration (minutes)
              </label>
              <select
                value={formData.slotDuration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    slotDuration: parseInt(e.target.value),
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="mr-2"
                />
                Active
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#446E6D] text-white rounded-md hover:bg-[#446E6D]/90 disabled:opacity-50"
              >
                {isSubmitting
                  ? "Saving..."
                  : availability
                  ? "Update"
                  : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConsultationManagement;
