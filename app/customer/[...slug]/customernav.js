"use client";
import React, { useState, useEffect, useRef } from "react";
import QuotationDialogue from "./quotationDialogue";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import axios from "axios";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import { MyContext } from "@/context/context";
import { User, User2 } from "lucide-react";

export default function Adminnav({ user, login }) {
  const [isOn, setIsOn] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const context = React.useContext(MyContext);
  const router = useRouter();
  const [loginout, setloginout] = useState(false);
  const [profileopen, setprofileopen] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef();

  // Fetch notifications
  useEffect(() => {
    if (context?.user) {
      axios
        .get("/api/user/notifications", { withCredentials: true })
        .then((res) => {
          const data = res.data;
          if (data.success && Array.isArray(data.notifications)) {
            setNotifications(data.notifications);
          } else {
            setNotifications([]);
          }
        })
        .catch(() => setNotifications([]));
    }
  }, [context?.user]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);

  const handleToggle = async () => {
    try {
      setisLoading(true);
      const response = await axios.post(
        `/api/setting/toggleLogin`,
        {
          loginOn: !isOn,
        },
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setIsOn((prev) => !prev);
      }
    } catch (error) {
    } finally {
      setisLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get("/api/user/logout", {
        withCredentials: true,
      });
      if (response?.data?.success) {
        router.push("/");
        setloginout(true);
        context?.setUser(null);
        context?.customToast(response?.data);
      }
    } catch (error) {
      context?.customToast({ success: false, message: "Something went wrong" });
    }
  };

  console.log(context?.user);

  return (
    <header className="bg-white w-full px-20 py-5 text-[#446E6D border-b-2 border-[#446e6d25] shadow-md fixed top-0 z-10">
      <div className=" w-full mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4 justify-center">
          <Link href={`/`}>
            <img
              alt="logo"
              width="17"
              height="17"
              className="cursor-pointer hover:animate-slowspin"
              src="/logo.svg"
            />
          </Link>
          <h1 className="text-[#446E6D] text-lg font-semibold">Webmedigital</h1>
        </div>
        <nav>
          <ul className="flex space-x-16 items-center">
            {/* Notification Bell */}
            {context?.user && (
              <li className="relative">
                <button
                  className="relative focus:outline-none"
                  onClick={() => setNotifOpen((prev) => !prev)}
                  aria-label="Show notifications"
                >
                  <NotificationsIcon
                    style={{ color: "#446E6D", fontSize: "1.7em" }}
                  />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div
                    ref={notifRef}
                    className="absolute right-0 mt-2 w-96 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  >
                    <div className="p-3 border-b font-semibold text-[#446E6D]">
                      Notifications
                    </div>
                    {notifications.length === 0 ? (
                      <div className="p-4 text-gray-500 text-center">
                        No notifications
                      </div>
                    ) : (
                      <ul>
                        {notifications.map((notif, idx) => {
                          if (notif.type === "quotation") {
                            const products = Array.isArray(notif.data?.products)
                              ? notif.data.products
                              : [];
                            return (
                              <li
                                key={idx}
                                className="p-3 border-b last:border-b-0 hover:bg-gray-50"
                              >
                                <QuotationDialogue
                                  odoo_id={notif.data?.odoo_id}
                                  products={products}
                                  trigger={
                                    <div className="cursor-pointer">
                                      <div className="font-bold">
                                        {notif.data?.name || "Quotation"}
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        {notif.message}
                                      </div>
                                    </div>
                                  }
                                />
                              </li>
                            );
                          } else {
                            return (
                              <li
                                key={idx}
                                className="p-3 border-b last:border-b-0 hover:bg-gray-50"
                              >
                                <div className="font-bold">
                                  {notif.data?.name ||
                                    notif.type ||
                                    "Notification"}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {notif.data?.message || "-"}
                                </div>
                              </li>
                            );
                          }
                        })}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            )}
            {/* <QuotationDialogue
              odoo_id={12345}
              body={{
                odoo_id: 12345,
                name: "QTN/2025/001",
                display_name: "QTN/2025/001",
                state: "draft",
                date_order: "2025-10-11",
                validity_date: "2025-10-20",
                amount_untaxed: 300,
                amount_tax: 20,
                amount_total: 320,
                currency_id: "AED",
                type_name: "Quotation",
                products: [
                  {
                    _id: "1",
                    odoo_id: 111,
                    title: "Sample Product 1",
                    quantity: 2,
                    price: 100,
                    total_amount: 200,
                    image: "/placeholder.png",
                  },
                  {
                    _id: "2",
                    odoo_id: 222,
                    title: "Sample Product 2",
                    quantity: 1,
                    price: 200,
                    total_amount: 200,
                    image: "/placeholder.png",
                  },
                ],
              }}
              products={[
                {
                  _id: "1",
                  odoo_id: 111,
                  title: "Sample Product 1",
                  quantity: 2,
                  price: 100,
                  total_amount: 200,
                  image: "/placeholder.png",
                },
                {
                  _id: "2",
                  odoo_id: 222,
                  title: "Sample Product 2",
                  quantity: 1,
                  price: 200,
                  total_amount: 200,
                  image: "/placeholder.png",
                },
              ]}
              trigger={<button>Open Quotation (Dev)</button>}
            /> */}
            {/* {user && <li className='flex items-center gap-5'>
              <h1 className='text-[#446E6D] text-balg font-bold'>{isOn ? 'Is' : 'Not'} visible to strangers</h1>
                <div
                  onClick={handleToggle}
                  className={`w-10 h-4 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                    isOn ? 'bg-[#446E6D]' : 'bg-gray-400'
                  }`}
                >
                <div
                  className={`w-3 h-3 realtive bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                    isOn ? 'translate-x-6' : 'translate-x-0'
                  }`}
                >
                 {isLoading && <div className="animate-spin border-4 border-t-4 border-transparent border-t-[#446E6D] border-b-[#446E6D] rounded-full  aspect-square"></div>}
                </div>
                </div>
                </li>} */}
            <li className="grid cursor-pointer">
              <h1 className="text-gray-500 text-md font-bold">
                {context?.user &&
                  !context?.loading &&
                  context?.user?.profile?.name && (
                    <span
                      className="flex gap-3 items-center relative"
                      onClick={() => setprofileopen(!profileopen)}
                      onAbort={() => setprofileopen(false)}
                      onBlur={() => setprofileopen(false)}
                    >
                      {context?.user?.profile?.avatarUrl ===
                      "https://default-avatar-url.com" ? (
                        <User2
                          className="border-2 border-gray-500 rounded-full"
                          style={{ width: "1.8em", height: "1.8em" }}
                        />
                      ) : (
                        <img
                          style={{ width: "1.8em", height: "1.8em" }}
                          className="border-2 border-gray-500 rounded-full"
                          src={
                            context?.user?.profile?.avatarUrl ||
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIEd2zxEc_4IQ1jHyniHLECu15zRjkHTBJzA&s"
                          }
                        />
                      )}
                      <span className="">{`${context?.user?.profile?.name}`}</span>

                      {profileopen && context?.user && context?.user?.role && (
                        <div
                          className="absolute top-[200%] right-0 p-3 w-content bg-white rounded-lg overflow-hidden text-gray-600 flex flex-col gap-2
                    shadow-lg"
                          onMouseLeave={() => setprofileopen(false)}
                        >
                          <span className="flex gap-3 items-center min-w-max border-b pb-3 px-2">
                            {context?.user?.profile?.avatarUrl ===
                            "https://default-avatar-url.com" ? (
                              <User2
                                className="border-2 border-gray-500 rounded-full"
                                style={{ width: "2em", height: "2em" }}
                              />
                            ) : (
                              <img
                                style={{ width: "2em", height: "2em" }}
                                className="border-2 border-gray-500 rounded-full"
                                src={
                                  context?.user?.profile?.avatarUrl ||
                                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIEd2zxEc_4IQ1jHyniHLECu15zRjkHTBJzA&s"
                                }
                              />
                            )}
                            <span className="flex flex-col min-w-max">
                              <span>{`${context?.user?.profile?.name}`}</span>
                              <span className="font-normal">{`${context?.user?.email}`}</span>
                            </span>
                          </span>

                          {/* {
                                  context.user && !context.loading && context.user?.role==='user' &&
                                    // <Link href="/admin">
                                  <p className="text-nowrap flex gap-3 cursor-pointer" onClick={()=>{router.push('/customer');}}>
                                    <User style={{width:'1em', height:'1em'}} /> Customer Dashboard
                                    </p>
                                    // </Link>
                                } */}
                          {
                            <p
                              title="Logout"
                              className="cursor-pointer text-inherit text-nowrap flex items-center gap-3 hover:bg-gray-100 px-2 py-2 rounded"
                              onClick={handleLogout}
                            >
                              <LogoutIcon
                                style={{ height: "1em", width: "1em" }}
                              />{" "}
                              Logout
                            </p>
                          }
                        </div>
                      )}
                    </span>
                  )}
                <Link href="/admin/login">
                  {!context?.user && !context?.loading && "Please log in!"}
                </Link>
              </h1>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
