import React, {
  useState,
  useEffect,
  useRef,
  FormEvent,
  useContext,
} from "react";
import Image from "next/image";
import axios from "axios";
import { fetchMultiple } from "../../lib/client-fetch";
import { MyContext } from "../../context/context";
import consultImage from "../../asset/images/consult.jpeg";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  id?: string; // Optional service ID to pre-select
  coverImage?: string; // New prop for cover image
  title?: string; // Title from the section
  description?: string; // Description from the section
}

interface ChildService {
  _id: string;
  Title: string;
  detail?: string;
  parentService?: string;
}

interface BookingSlot {
  startTime: string;
  endTime: string;
  slotDuration: number;
  availableAdmins: {
    adminId: string;
    adminName: string;
    adminEmail: string;
  }[];
}

interface AvailableTimesResponse {
  success: boolean;
  message: string;
  availableSlots: BookingSlot[];
  individualSlots: any[];
  date: string;
  dayOfWeek: number;
  totalAvailableSlots: number;
}

const ERPConsultationPage: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  id,
  coverImage,
  title = "ERP Systems for Small Business in UAE",
  description = "Streamline your operations with our customized ERP solutions."
}) => {
  const { user, customToast } = useContext(MyContext);
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    date: "",
    timeSlot: "",
    notes: "",
  });
  const [childServices, setChildServices] = useState<ChildService[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ChildService | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // New state for booking times
  const [availableSlots, setAvailableSlots] = useState<BookingSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<string>("");
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const timeDropdownRef = useRef<HTMLDivElement>(null);

  // Notes state
  const [showNotesInput, setShowNotesInput] = useState(false);

  // Prefetch childServices when component mounts
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoadingServices(true);
      try {
        const data = await fetchMultiple(["childServices"]);
        const servicesData = data as any; // Type assertion for fetched data
        if (
          servicesData.childServices &&
          Array.isArray(servicesData.childServices)
        ) {
          setChildServices(servicesData.childServices);
        }
      } catch (error) {
        console.error("Error fetching child services:", error);
      } finally {
        setIsLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  // Auto-select service based on id prop when childServices are loaded
  useEffect(() => {
    if (id && childServices.length > 0 && !selectedService) {
      const matchingService = childServices.find((service) => {
        const serviceId = service?._id?.toString();
        const targetId = id?.toString();
        return serviceId === targetId;
      });

      if (matchingService) {
        setSelectedService(matchingService);
        setFormData((prev) => ({
          ...prev,
          service: matchingService._id,
        }));
      }
    }
  }, [id, childServices, selectedService]);

  // Prefill form data from user context
  useEffect(() => {
    if (user && isOpen) {
      setFormData((prev) => ({
        ...prev,
        name: user.profile?.name || prev.name,
        phone: user.profile?.phoneNumber || prev.phone,
        email: user.email || prev.email,
      }));
    }
  }, [user, isOpen]);

  // Fetch available booking times when date is selected
  const fetchAvailableSlots = async (selectedDate: string) => {
    if (!selectedDate) {
      setAvailableSlots([]);
      return;
    }

    setIsLoadingSlots(true);
    try {
      console.log("🕐 Fetching available slots for date:", selectedDate);

      const response = await axios.get(
        `/api/user/availablebookingtimes?date=${selectedDate}`,
        {
          withCredentials: true,
        }
      );

      const data: AvailableTimesResponse = response.data;

      if (data.success) {
        console.log("✅ Available slots fetched:", data.availableSlots);
        setAvailableSlots(data.availableSlots);
      } else {
        console.log("❌ No slots available:", data.message);
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error("❌ Error fetching available slots:", error);
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setFormData((prev) => ({
      ...prev,
      date: selectedDate,
      timeSlot: "", // Reset time slot when date changes
    }));
    setSelectedSlot(null);
    setSelectedAdmin("");

    // Fetch available slots for the new date
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    } else {
      setAvailableSlots([]);
    }
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (
    slot: BookingSlot,
    adminId?: string,
    adminName?: string
  ) => {
    setSelectedSlot(slot);
    setSelectedAdmin(adminId || slot.availableAdmins[0]?.adminId || "");
    setFormData((prev) => ({
      ...prev,
      timeSlot: `${slot.startTime} - ${slot.endTime}`,
    }));
    setIsTimeDropdownOpen(false);
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle service selection
  const handleServiceSelect = (service: ChildService) => {
    setSelectedService(service);
    setFormData((prev) => ({
      ...prev,
      service: service._id,
    }));
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }

      if (
        timeDropdownRef.current &&
        !timeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTimeDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
        setIsTimeDropdownOpen(false);
      }
    };

    if (isDropdownOpen || isTimeDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isDropdownOpen, isTimeDropdownOpen]);

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare booking data
      const bookingData = {
        productId: formData.service, // This is the selected service ID
        userId: user?._id || undefined, // Include userId if user is logged in
        name: formData.name.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phone.trim(),
        date: formData.date,
        startTime: selectedSlot?.startTime,
        endTime: selectedSlot?.endTime,
        notes:
          formData.notes.trim() ||
          `Booking for ${selectedService?.Title || "consultation"}${selectedAdmin ? ` with admin: ${selectedAdmin}` : ""
          }`,
      };

      console.log("📋 Booking data:", bookingData);

      const response = await axios.post("/api/user/book", bookingData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      if (data.success) {
        console.log("✅ Booking successful:", data);

        // Show success toast
        customToast({
          success: true,
          message:
            data.message ||
            "Booking created successfully! Waiting for admin approval.",
        });

        setSubmitSuccess(true);

        // Reset form after successful submission
        setTimeout(() => {
          setSubmitSuccess(false);
          setFormData({
            name: "",
            phone: "",
            email: "",
            service: "",
            date: "",
            timeSlot: "",
            notes: "",
          });
          setSelectedService(null);
          setSelectedSlot(null);
          setSelectedAdmin("");
          setAvailableSlots([]);
          onClose();
        }, 2000);
      } else {
        console.error("❌ Booking failed:", data.message);

        // Show error toast
        customToast({
          success: false,
          message: data.message || "Booking failed. Please try again.",
        });
      }
    } catch (error: any) {
      console.error("❌ Error submitting booking:", error);

      // Handle different types of errors with toast
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      customToast({
        success: false,
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row max-w-5xl w-full max-h-[90vh] overflow-y-auto relative"
        style={{ overflow: "visible" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-50 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
        >
          ✕
        </button>

        {/* Left Section */}
        <div className="md:w-1/2 p-8 md:rounded-l-2xl overflow-hidden">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {title}
          </h2>
          <p className="text-gray-600 mb-4">
            {description}
          </p>
          <div className="flex space-x-4 mb-6">
            <span className="flex items-center space-x-1 text-blue-600 font-semibold">
              <span>✔</span>
              <span>Improve Efficiency</span>
            </span>
            <span className="flex items-center space-x-1 text-blue-600 font-semibold">
              <span>✔</span>
              <span>Reduce Costs</span>
            </span>
          </div>

          <div className="flex items-center space-x-4 mb-6 opacity-70">
            <div className="relative h-6 w-16">
              {/* <Image
                src="/logos/square.svg"
                alt="Square"
                fill
                sizes="100%"
                style={{ objectFit: "contain" }}
              /> */}
            </div>
            <div className="relative h-6 w-16">
              {/* <Image
                src="/logos/adilet.svg"
                alt="Adilet"
                fill
                sizes="100%"
                style={{ objectFit: "contain" }}
              /> */}
            </div>
            <div className="relative h-6 w-16">
              {/* <Image
                src="/logos/fccgroup.svg"
                alt="FCC Group"
                fill
                sizes="100%"
                style={{ objectFit: "contain" }}
              /> */}
            </div>
            <div className="relative h-6 w-16">
              {/* <Image
                src="/logos/bridge.svg"
                alt="Bridge"
                fill
                sizes="100%"
                style={{ objectFit: "contain" }}
              /> */}
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            We reseve satisfied
          </h3>
          <ul className="text-blue-600 space-y-1 mb-6">
            <li>✔ Improve Efficiency</li>
            <li>✔ Reduce Costs</li>
            <li>✔ Gain Insights</li>
          </ul>

          <a
            href="https://wa.me/971567295834"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 text-white px-5 py-2 rounded shadow hover:bg-green-600 transition"
          >
            Talk to Us on WhatsApp
          </a>
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 bg-orange-50 flex flex-col justify-center overflow-visible md:rounded-r-2xl">
          <div className="relative w-full h-56">
            <Image
              src={coverImage ? coverImage : consultImage}
              alt="Businessman"
              fill
              style={{ objectFit: "cover" }}
              className="rounded md:rounded-tr-2xl"
            />
          </div>
          <div className=" p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Get Started with a Free Consultation
            </h3>

            {submitSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-center animate-pulse">
                <p className="font-medium">Thank you for your submission!</p>
                <p className="text-sm mt-1">We&apos;ll contact you shortly.</p>
              </div>
            ) : (
              <form className="space-y-3" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  required
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  required
                />
                {/* Simple working dropdown */}
                <div className="relative z-20" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    disabled={isLoadingServices}
                    className={`w-full border border-gray-300 rounded px-4 py-2 text-left bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 flex items-center justify-between ${isLoadingServices
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:border-gray-400"
                      }`}
                  >
                    <span
                      className={
                        selectedService ? "text-gray-900" : "text-gray-500"
                      }
                    >
                      {isLoadingServices
                        ? "Loading services..."
                        : selectedService
                          ? selectedService.Title
                          : "Select a service"}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Simple dropdown that works */}
                  {isDropdownOpen && !isLoadingServices && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto z-30">
                      {childServices.length === 0 ? (
                        <div className="px-4 py-2 text-gray-500 text-sm">
                          No services available
                        </div>
                      ) : (
                        childServices.map((service) => (
                          <button
                            key={service._id}
                            type="button"
                            onClick={() => handleServiceSelect(service)}
                            className={`w-full text-left px-4 py-2 hover:bg-orange-50 hover:text-orange-700 focus:outline-none focus:bg-orange-50 focus:text-orange-700 transition-colors duration-150 block ${selectedService?._id === service._id
                                ? "bg-orange-100 text-orange-800 font-medium"
                                : "text-gray-900"
                              }`}
                          >
                            <div className="text-sm font-medium">
                              {service.Title}
                            </div>
                            {service.detail && (
                              <div className="text-xs text-gray-500 mt-1 truncate">
                                {service.detail.length > 50
                                  ? `${service.detail.substring(0, 50)}...`
                                  : service.detail}
                              </div>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Date and Time in single row */}
                <div className="flex gap-3">
                  {/* Date Input */}
                  <div className="flex-1">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleDateChange}
                      min={new Date().toISOString().split("T")[0]} // Prevent past dates
                      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
                      required
                    />
                  </div>

                  {/* Time Slot Dropdown */}
                  {
                    <div className="flex-1 relative" ref={timeDropdownRef}>
                      <button
                        type="button"
                        onClick={() =>
                          setIsTimeDropdownOpen(!isTimeDropdownOpen)
                        }
                        disabled={isLoadingSlots || availableSlots.length === 0}
                        className={`w-full border border-gray-300 rounded px-4 py-2 text-left bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 flex items-center justify-between ${isLoadingSlots || availableSlots.length === 0
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer hover:border-gray-400"
                          }`}
                      >
                        <span
                          className={
                            selectedSlot ? "text-gray-900" : "text-gray-500"
                          }
                        >
                          {isLoadingSlots
                            ? "Loading..."
                            : availableSlots.length === 0
                              ? "No times"
                              : selectedSlot
                                ? `${selectedSlot.startTime} - ${selectedSlot.endTime}`
                                : "Select time"}
                        </span>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isTimeDropdownOpen ? "rotate-180" : ""
                            }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Time slots dropdown */}
                      {isTimeDropdownOpen &&
                        !isLoadingSlots &&
                        availableSlots.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto z-30">
                            {availableSlots.map((slot, index) => (
                              <div
                                key={index}
                                className="border-b border-gray-100 last:border-b-0"
                              >
                                {slot.availableAdmins.length === 1 ? (
                                  // Single admin - direct selection
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleTimeSlotSelect(
                                        slot,
                                        slot.availableAdmins[0].adminId
                                      )
                                    }
                                    className={`w-full text-left px-4 py-3 hover:bg-orange-50 hover:text-orange-700 focus:outline-none focus:bg-orange-50 focus:text-orange-700 transition-colors duration-150 block ${selectedSlot?.startTime ===
                                        slot.startTime &&
                                        selectedSlot?.endTime === slot.endTime
                                        ? "bg-orange-100 text-orange-800 font-medium"
                                        : "text-gray-900"
                                      }`}
                                  >
                                    <div className="text-sm font-medium">
                                      {slot.startTime} - {slot.endTime}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      with {slot.availableAdmins[0].adminName}
                                    </div>
                                  </button>
                                ) : (
                                  // Multiple admins - show expandable list
                                  <div className="px-4 py-2">
                                    <div className="text-sm font-medium text-gray-900 mb-2">
                                      {slot.startTime} - {slot.endTime}
                                    </div>
                                    {slot.availableAdmins.map((admin) => (
                                      <button
                                        key={admin.adminId}
                                        type="button"
                                        onClick={() =>
                                          handleTimeSlotSelect(
                                            slot,
                                            admin.adminId,
                                            admin.adminName
                                          )
                                        }
                                        className={`w-full text-left px-2 py-1 mb-1 rounded hover:bg-orange-50 hover:text-orange-700 focus:outline-none focus:bg-orange-50 focus:text-orange-700 transition-colors duration-150 block ${selectedSlot?.startTime ===
                                            slot.startTime &&
                                            selectedSlot?.endTime ===
                                            slot.endTime &&
                                            selectedAdmin === admin.adminId
                                            ? "bg-orange-100 text-orange-800 font-medium"
                                            : "text-gray-700"
                                          }`}
                                      >
                                        <div className="text-xs">
                                          with {admin.adminName}
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  }
                </div>

                {/* Notes Section */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowNotesInput(!showNotesInput)}
                    className="text-sm text-orange-600 hover:text-orange-700 underline transition-colors duration-150"
                  >
                    {showNotesInput ? "Hide notes" : "Have any notes?"}
                  </button>

                  {showNotesInput && (
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      placeholder="Add any additional notes or special requirements..."
                      rows={3}
                      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none text-sm"
                    />
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !selectedService || !selectedSlot}
                  className={`w-full py-2 rounded transition flex items-center justify-center ${isSubmitting || !selectedService || !selectedSlot
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Button component to open the modal
export const BookingModalTrigger: React.FC<{
  onOpen: () => void;
  children?: React.ReactNode;
}> = ({ onOpen, children = "Book a Consultation" }) => {
  return (
    <button
      onClick={onOpen}
      className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded shadow transition duration-200"
    >
      {children}
    </button>
  );
};

// Modal wrapper with state management
export const BookingModal: React.FC<{ id?: string }> = ({ id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <BookingModalTrigger onOpen={openModal} />
      <ERPConsultationPage isOpen={isModalOpen} onClose={closeModal} id={id} />
    </>
  );
};

export default ERPConsultationPage;
