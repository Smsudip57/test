'use client';
import React, { useState } from "react";
import Image from "next/image";
import { User, Phone, Mail, FileText, Upload, Trash, Save } from "lucide-react"; // Import Lucide icons

export default function Settings() {
  const [profilePhoto, setProfilePhoto] = useState(null);

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1080px] pt-10">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
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

      <div className="grid grid-cols-5 gap-8">
        {/* Left Section - Personal Info */}
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-[10px] border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-800 dark:shadow-lg">
            <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">Personal Information</h3>
            </div>
            <div className="p-7">
              <form>
                {/* Full Name */}
                <div className="mb-5 flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300" size={20} />
                      <input
                        className="w-full rounded-md border px-12 py-2 text-dark focus:border-primary focus-visible:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        placeholder="John Doe"
                        type="text"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="w-full sm:w-1/2">
                    <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300" size={20} />
                      <input
                        className="w-full rounded-md border px-12 py-2 text-dark focus:border-primary focus-visible:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        placeholder="+990 3343 7865"
                        type="text"
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300" size={20} />
                    <input
                      className="w-full rounded-md border px-12 py-2 text-dark focus:border-primary focus-visible:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      placeholder="johndoe45@gmail.com"
                      type="email"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    BIO
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-5 text-gray-500 dark:text-gray-300" size={20} />
                    <textarea
                      className="w-full rounded-md border px-12 py-3 text-dark focus:border-primary focus-visible:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      rows={4}
                      placeholder="Write your bio here..."
                    ></textarea>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                  <button className="rounded-md border px-6 py-2 font-medium text-dark hover:shadow-md dark:border-gray-700 dark:text-white">
                    Cancel
                  </button>
                  <button className="flex items-center gap-2 rounded-md bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90">
                    <Save size={16} />
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Section - Profile Photo */}
        <div className="col-span-5 xl:col-span-2">
          <div className="rounded-[10px] border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-800 dark:shadow-lg">
            <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">Your Photo</h3>
            </div>
            <div className="p-7 text-center">
              <div className="mb-4 flex justify-center">
                <Image
                  src={profilePhoto || "/images/user-placeholder.png"}
                  alt="User"
                  width={80}
                  height={80}
                  className="rounded-full border shadow"
                />
              </div>

              <label className="cursor-pointer flex flex-col items-center justify-center border border-dashed p-4 rounded-lg hover:border-primary">
                <Upload className="text-gray-500 dark:text-gray-300" size={24} />
                <input type="file" className="hidden" onChange={handlePhotoUpload} />
                <span className="text-sm text-primary">Click to upload</span>
              </label>

              {/* Buttons */}
              <div className="mt-4 flex justify-center gap-3">
                <button className="text-sm text-red-500 hover:text-red-700 flex items-center gap-2">
                  <Trash size={16} />
                  Delete
                </button>
                <button className="text-sm text-primary hover:text-primary-dark">Update</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
