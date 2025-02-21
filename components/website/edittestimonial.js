import { useEffect, useState } from "react";
import axios from "axios";
import { UploadCloud } from "lucide-react";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    Testimonial: "",
    postedBy: "",
    role: "",
    image: null,
    video: null,
    relatedService: "",
    relatedIndustries: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [services, setServices] = useState([]);
  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    fetchTestimonials();
    fetchData();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/testimonial/get");
      if (res.data.success) setTestimonials(res.data.testimonials);
    } catch (err) {
      setError("Failed to fetch testimonials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const [serviceRes, industryRes] = await Promise.all([
        axios.get("/api/service/getservice"),
        axios.get("/api/industry/get"),
      ]);
      setServices(serviceRes.data.services || []);
      setIndustries(industryRes.data.industries || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEdit = (testimonial) => {
    setEditing(testimonial._id);
    setForm({
      ...testimonial,
      relatedService: testimonial.relatedService?._id || "",
      relatedIndustries: testimonial.relatedIndustries?._id || "",
    });
    setImagePreview(testimonial.image);
    setVideoPreview(testimonial.video);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { name } = e.target;
    if (!file) return;
    if (name === "image") {
      setImagePreview(URL.createObjectURL(file));
    } else if (name === "video") {
      setVideoPreview(URL.createObjectURL(file));
    }
    setForm((prev) => ({ ...prev, [name]: file }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
      formData.append("testimonialId", form._id);
      const res = await axios.post("/api/testimonial/edit", formData, {
        withCredentials: true,
      });
      if (res.data.success) {
        setTestimonials((prev) =>
          prev.map((t) => (t._id === form._id ? { ...form } : t))
        );
        setEditing(null); // Close the edit form after saving
      } else {
        setError("Failed to save changes. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while saving. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full mx-auto p-8 bg-white rounded-lg shadow-lg border">
      {editing ? (
        <div>
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Edit Testimonial
          </h1>

          {error && <p className="text-red-500 text-center">{error}</p>}
          {loading && <p className="text-center">Loading...</p>}

          <form onSubmit={(e) => e.preventDefault()} className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image Upload */}
            <div className="flex gap-4 items-center">
              <div className="relative max-w-64 w-full border rounded-lg">
                <img
                  src={imagePreview || form.image}
                  alt="Preview"
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer">
                  <UploadCloud className="h-12 w-12 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0"
                  />
                </label>
              </div>

              <div className="relative w-full h-max border rounded-lg">
                <video src={videoPreview || form.video} controls className="w-full h-48 object-cover rounded-lg" />
                <label className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer">
                  <UploadCloud className="h-12 w-12 text-white" />
                  <input
                    type="file"
                    accept="video/*"
                    name="video"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>

              
            <label className="font-medium"> Testimonial</label>
              <textarea
                name="Testimonial"
                value={form.Testimonial}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg  mt-2"
                rows="4"
                required
              /></div>
              <div className="flex gap-4">
                
                <div>
                <label className="font-medium"> Posted By</label>
                <input
                  type="text"
                  name="postedBy"
                  value={form.postedBy}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg mt-2"
                  required
                /></div><div>
                <label className="font-medium"> Role</label>
                <input
                  type="text"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg mt-2"
                  required
                /></div>
              </div>

              {/* Fix Dropdowns */}
              <div className="grid grid-cols-2 gap-4">
                
                <div>
                <label className="font-medium"> Related Service</label>
                <select
                  name="relatedService"
                  value={form.relatedService}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg  mt-2"
                >
                  <option value="">Select a Service</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.Title}
                    </option>
                  ))}
                </select></div><div>

                <label className="font-medium pb-6 ml-1"> Related Industry</label>
                <select
                  name="relatedIndustries"
                  value={form.relatedIndustries}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg mt-2"
                >
                  <option value="">Select an Industry</option>
                  {industries.map((industry) => (
                    <option key={industry._id} value={industry._id}>
                      {industry.Title}
                    </option>
                  ))}
                </select></div>
              </div>
            </div>
          </form>

          <button
            onClick={handleSave}
            className="bg-blue-500 text-white p-2 rounded w-full mt-4"
          >
            Save Testimonial
          </button>
        </div>
      ) : (
        <div>
          {/* Display Testimonials List */}
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Testimonials</h1>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <div className="grid  gap-4">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial._id}
                  className="flex items-center gap-4 p-4 border rounded-lg shadow-sm bg-gray-50"
                >
                  <img
                    src={testimonial.image}
                    alt="Testimonial"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-lg font-semibold">{testimonial.Testimonial}</p>
                    <p className="text-gray-600">{testimonial.postedBy} - {testimonial.role}</p>
                  </div>
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
