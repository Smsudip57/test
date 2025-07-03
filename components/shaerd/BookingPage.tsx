import React, { useState, useEffect, useRef, FormEvent } from "react";
import Image from "next/image";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ERPConsultationPage: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form submitted:", formData);
      setSubmitSuccess(true);

      // Reset form after submission
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          name: "",
          phone: "",
          email: "",
          service: "",
        });
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
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
        className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
        >
          ✕
        </button>

        {/* Left Section */}
        <div className="md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ERP Systems for Small Business in UAE
          </h2>
          <p className="text-gray-600 mb-4">
            Streamline your operations with our customized ERP solutions.
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
        <div className="md:w-1/2 bg-orange-50 p-8 flex flex-col justify-center">
          <div className="relative w-full h-48 mb-6">
            {/* <Image
              src="/images/businessman.jpg"
              alt="Businessman"
              fill
              style={{ objectFit: "cover" }}
              className="rounded"
            /> */}
          </div>
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
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
                required
              >
                <option value="">Service Interested In</option>
                <option value="ERP Implementation">ERP Implementation</option>
                <option value="Support & Training">Support & Training</option>
                <option value="Custom Modules">Custom Modules</option>
              </select>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 rounded transition flex items-center justify-center ${
                  isSubmitting
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
  );
};

// Button component to open the modal
export const BookingModalTrigger: React.FC<{ onOpen: () => void }> = ({
  onOpen,
}) => {
  return (
    <button
      onClick={onOpen}
      className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded shadow transition duration-200"
    >
      Book a Consultation
    </button>
  );
};

// Modal wrapper with state management
export const BookingModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <BookingModalTrigger onOpen={openModal} />
      <ERPConsultationPage isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default ERPConsultationPage;
