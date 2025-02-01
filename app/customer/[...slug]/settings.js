'use client';
import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import { 
  User, Phone, Building2 ,UserPen , MapPinHouse, Upload, Trash, Save, Lock 
} from "lucide-react"; // Added Lock icon
import { MyContext } from "@/context/context";
import axios from "axios";

export default function Settings() {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);
  const { user, setUser, customToast } = useContext(MyContext);
  const [fields, setFields] = useState({});

  useEffect(() => {
    if (user?.profile) {
      const { ...rest } = user.profile; 
      setFields(rest);
    }
  }, [user]);

  const handleUserPhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const handleCompanyLogoPhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCompanyLogo(e.target.files[0]);
    }
  };

  const imagePreview = (file) => {
    if (typeof window !== "undefined" && file instanceof Blob) {
      return URL.createObjectURL(file);
    }
    return null;
};

  const handleChange = (e) => {
    try {
      e.preventDefault();
      const { name, value } = e.target;
      if (name === "phoneNumber" && !/^\+?[0-9]*$/.test(value)) {
        return;
      }
      setFields((prevFields) => ({
        ...prevFields,
        [name]: value,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      if((fields?.newPassword || fields?.confirmPassword) && (fields?.newPassword !== fields?.confirmPassword)) {
        customToast({success:false, message:'Passwords do not match!'});
        return;
      }
      const formdata = new FormData();
      for (const key in fields) {
        formdata.append(key, fields[key]);
      }
      if (profilePhoto) formdata.append("profilePhoto", profilePhoto);
      if (companyLogo) formdata.append("companyLogo", companyLogo);
      const response = await axios.put('/api/user/update', formdata, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUser(response.data.user);
        customToast(response.data);
      }
    } catch (error) {
      customToast(error?.response?.data);
    }
  };

  /* ✅ Profile Upload Component */
  const ProfileUpload = ({ title, imageSrc, handleUpload }) => (
    <div className="col-span-5 xl:col-span-2">
      <div className="w-full bg-white p-6 shadow border">
        <div className="border-b border-stroke px-3 py-4">
          <h3 className="font-medium text-dark">{title}</h3>
        </div>
        <div className="p-7 text-center">
          <div className=" flex justify-center relative cursor-pointer">
            <label className="absolute opacity-0 hover:opacity-100 transition-opacity duration-500 ease-in-out z-10 cursor-pointer flex flex-col items-center justify-center bg-primary/70 p-4 rounded-full h-full aspect-square">
              <Upload className="text-white" size={24} />
              <input type="file" className="hidden" onChange={handleUpload} />
              <span className="text-xs mt-2 text-white">Click to upload</span>
            </label>
            <img
              src={imageSrc}
              alt="unavailable"
              width={145}
              height={145}
              className="rounded-full aspect-square border shadow"
            />
          </div>
          <div className="mt-6 flex justify-center gap-3 hidden">
            <button className="text-sm text-red-500 hover:text-red-700 flex items-center gap-2">
              <Trash size={16} />
              Delete
            </button>
            <button className="text-sm text-primary text-normal hover:text-[#1a2928]">Update</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-center text-gray-700">
          Settings
        </h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <a className="font-medium text-gray-600 hover:text-primary" href="/">
                Dashboard /
              </a>
            </li>
            <li className="font-medium text-primary">Settings</li>
          </ol>
        </nav>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Left Section - Personal Info */}
        <div className="col-span-5 xl:col-span-3">
          <div className="w-full bg-white p-6 shadow border">
            <div className="border-b border-stroke mx-3 py-4">
              <h3 className="font-medium text-dark">Personal Information</h3>
            </div>
            <div className="py-7 px-3">
              <div>
                {/* Full Name & Phone */}
                <div className="mb-5 flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label className="mb-2 block text-sm font-medium text-dark">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        name="name"
                        value={fields?.name || ""}
                        onChange={handleChange}
                        className="w-full rounded-md border px-12 py-2 text-dark focus:border-primary focus-visible:outline-none dark:border-gray-700 dark:bg--900 dark:text-"
                        placeholder="Enter your full name"
                        autoComplete="new-password"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label className="mb-2 block text-sm font-medium text-dark">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        name="phoneNumber"
                        value={fields?.phoneNumber || ""}
                        onChange={handleChange}
                        className="w-full rounded-md border px-12 py-2 text-dark focus:border-primary focus-visible:outline-none dark:border-gray-700 dark:bg--900 dark:text-"
                        placeholder="Enter your phone number"
                        autoComplete="new-username"
                        type="text"
                      />
                    </div>
                  </div>
                  <input type="text" name="fake-email" autoComplete="username" style={{ display: "none" }} />
                </div>
                {/* Password Section */}
                <div className="mb-5 flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label className="mb-2 block text-sm font-medium text-dark">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        name="newPassword"
                        value={fields?.newPassword || ""}
                        onChange={handleChange}
                        className="w-full rounded-md border px-12 py-2 text-dark focus:border-primary focus-visible:outline-none dark:border-gray-700 dark:bg--900 dark:text-"
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        type="password"
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label className="mb-2 block text-sm font-medium text-dark">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        name="confirmPassword"
                        value={fields?.confirmPassword || ""}
                        onChange={handleChange}
                        className="w-full rounded-md border px-12 py-2 text-dark focus:border-primary focus-visible:outline-none dark:border-gray-700 dark:bg--900 dark:text-"
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                        type="password"
                      />
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div className="border-b border-stroke py-4">
                  <h3 className="font-medium text-dark">Company Information</h3>
                </div>
                
                {/* Company Name & Address */}
                <div className="my-5 flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label className="mb-2 block text-sm font-medium text-dark">Company Name</label>
                    <div className="relative">
                      <Building2  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        name="companyName"
                        value={fields?.companyName || ""}
                        onChange={handleChange}
                        className="w-full rounded-md border px-12 py-2 text-dark focus:border-primary focus-visible:outline-none dark:border-gray-700 dark:bg--900 dark:text-"
                        placeholder="Enter company name"
                        autoComplete="new-password"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label className="mb-2 block text-sm font-medium text-dark">Company Address</label>
                    <div className="relative">
                      <MapPinHouse  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        name="address"
                        value={fields?.address || ""}
                        onChange={handleChange}
                        className="w-full rounded-md border px-12 py-2 text-dark focus:border-primary focus-visible:outline-none dark:border-gray-700 dark:bg--900 dark:text-"
                        placeholder="Enter company address"
                        autoComplete="new-password"
                        type="text"
                      />
                    </div>
                  </div>
                </div>

                {/* Role & Old Password */}
                <div className="my-5 flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label className="mb-2 block text-sm font-medium text-dark">Role at Company</label>
                    <div className="relative">
                      <UserPen  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        name="companyRole"
                        value={fields?.companyRole || ""}
                        onChange={handleChange}
                        className="w-full rounded-md border px-12 py-2 text-dark focus:border-primary focus-visible:outline-none dark:border-gray-700 dark:bg--900 dark:text-"
                        placeholder="Enter your role"
                        autoComplete="off"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label className="mb-2 block text-sm font-medium text-dark">Old Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        name="oldPassword"
                        value={fields?.oldPassword || ""}
                        onChange={handleChange}
                        className="w-full rounded-md border px-12 py-2 text-dark focus:border-primary focus-visible:outline-none dark:border-gray-700 dark:bg--900 dark:text-"
                        placeholder="Enter old password"
                        autoComplete="current-password"
                        type="password"
                      />
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    className="flex items-center gap-2 rounded-md bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90"
                    onClick={handleSaveChanges}
                  >
                    <Save size={16} />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-5 xl:col-span-2 space-y-6">
          {/* Right Section - Profile Photo */} 
          <ProfileUpload
            title="Your Photo"
            imageSrc={imagePreview(profilePhoto) || user?.profile?.avatarUrl || ""}
            handleUpload={handleUserPhotoUpload}
          />

          <ProfileUpload
            title="Company Logo"
            imageSrc={imagePreview(companyLogo) || user?.profile?.companyImageUrl || ""}
            handleUpload={handleCompanyLogoPhotoUpload}
          />
        </div>
      </div>
    </div>
  );
}