"use client";
import React, { useState, useContext, useEffect } from "react";
// import img from "next/img";
import { Camera, Edit, Facebook, Twitter, Instagram, Linkedin, User, Phone, Building2 ,UserPen , MapPinHouse, Upload, Trash, Save, Lock  } from "lucide-react";
import { MyContext } from "@/context/context";

export default function ProfilePage() {
  const [profilePhoto, setProfilePhoto] = useState("/imgs/user/user-03.png");
  const [coverPhoto, setCoverPhoto] = useState("/imgs/cover/cover-01.png");
  const [fields, setFields] = useState({});
  const { user } = useContext(MyContext);

  useEffect(() => {
    if (user?.profile) {
      const { ...rest } = user.profile;
      setFields(rest);
    }
  },[user]);
  const handleProfilePhotoChange = () => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCoverPhotoChange = () => {
    if (e.target.files && e.target.files[0]) {
      setCoverPhoto(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleChange = (e) => {};
  const handleSaveChanges = () => {};

  return (
    <div className=" w-full">
       
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-center text-gray-700">
          Profile
        </h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <a className="font-medium text-gray-600 hover:text-primary" href="/">
                Dashboard /
              </a>
            </li>
            <li className="font-medium text-primary">Profile</li>
          </ol>
        </nav>
      </div> <div className=" bg-white mx-auto w-full">
      {/* Cover Photo */}
      <div className="overflow-hidden rounded-[10px] mx-auto shadow-1 dark:bg-gray-dark dark:shadow-card  max-w-[970px]">
        <div className="relative h-[350px] w-[350px] mt-10 mx-auto ">
          <img
            src={user?.profile?.companyImageUrl}
            alt="profile cover"
            width={970}
            height={260}
            className="h-full w-full rounded-full object-cover object-center"
          />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-[1] rounded-full bg-white/20 p-2">
          <img
                src={user?.profile?.avatarUrl}
                alt="profile"
                width={160}
                height={160}
                className="overflow-hidden rounded-full mx-auto"
              />
          </div>
        </div>


        <div className="px-4 py-6 text-center xl:pb-11.5">
          {/* User Info */}
          <div className="mt-4">
            <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
              {user?.profile?.name}
            </h3>
            <p className="font-medium">{user?.profile?.companyRole} at {user?.profile?.companyName}</p>
            <div className="w-full bg-white text-left">
            <div className="pt-12 pl-16">
              <div>
                {/* Full Name & Phone */}
                <div className="mb-5 flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label className="mb-2 block text-sm font-medium text-dark">Full Name -</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        readOnly
                        name="name"
                        value={fields?.name || ""}
                        onChange={handleChange}
                        className="w-full rounded-md  px-12 py-2  dark:bg--900 focus:outline-none text-gray-600"
                        placeholder="Enter your full name"
                        autoComplete="new-password"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label className="mb-2 block text-sm font-medium text-dark">Phone Number -</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        readOnly
                        name="phoneNumber"
                        value={fields?.phoneNumber || ""}
                        onChange={handleChange}
                        className="w-full rounded-md  px-12 py-2  dark:bg--900 focus:outline-none text-gray-600"
                        placeholder="Enter your phone number"
                        autoComplete="new-username"
                        type="text"
                      />
                    </div>
                  </div>
                  <input type="text" name="fake-email" autoComplete="username" style={{ display: "none" }} />
                </div>

                {/* Company Name & Address */}
                <div className="my-5 flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label className="mb-2 block text-sm font-medium text-dark">Company Name -</label>
                    <div className="relative">
                      <Building2  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        readOnly
                        name="companyName"
                        value={fields?.companyName || ""}
                        onChange={handleChange}
                        className="w-full rounded-md  px-12 py-2  dark:bg--900 focus:outline-none text-gray-600"
                        placeholder="Enter company name"
                        autoComplete="new-password"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label className="mb-2 block text-sm font-medium text-dark">Company Address -</label>
                    <div className="relative">
                      
                      <span
                        readOnly
                        name="address"
                        onChange={handleChange}
                        className="w-full rounded-md  px-12 py-2 flex items-center dark:bg--900 focus:outline-none text-gray-600"
                        placeholder="Enter company address"
                        autoComplete="new-password"
                        type="text"
                      ><MapPinHouse  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />{fields?.address || ""}</span>
                    </div>
                  </div>
                </div>

                {/* Role & Old Password */}
                <div className="my-5 flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label className="mb-2 block text-sm font-medium text-dark">Role at Company -</label>
                    <div className="relative">
                      <UserPen  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        readOnly
                        name="companyRole"
                        value={fields?.companyRole || ""}
                        onChange={handleChange}
                        className="w-full rounded-md  px-12 py-2  dark:bg--900 focus:outline-none text-gray-600"
                        placeholder="Enter your role"
                        autoComplete="off"
                        type="text"
                      />
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
            
          </div>
        </div>
      </div></div>
    </div>
  );
}
