"use client";
import { Socials } from "@/constants";
import Image from "next/image";
import React, { useState, useEffect, useRef, useContext, use } from "react";
import { MyContext } from "@/context/context";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { CircleUser, Crown, LogOut, User } from "lucide-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";
import path from "path";

const Navbar = () => {
  const [scrolled, setscrolled] = useState(false);
  const [animated, setAnimated] = useState("");
  const [completed, setCompleted] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [option, setoption] = useState("");
  // const industries = [
  //   "Automotive",
  //   "Construction",
  //   "Facility Management",
  //   "Legal & Administrative",
  //   "Mechanical & Engineering",
  //   "Healthcare and Pharmaceuticals",
  //   "Retail",
  //   "Logistics and Transportation",
  //   "Manufacturing",
  //   "Food & Agriculture",
  //   "Interior and Fitout",
  //   "Real Estate"
  // ];
  const [industries, setindustries] = useState<any>([]);
  const about = [
    "About WEBME",
    "Blog",
    "Knowledgebase",
    "FAQ",
    "Privacy Policy",
    "Terms & Conditions",
  ];
  const slider = useRef(null);
  const [anchorE2, setAnchorE2] = React.useState(null);
  const [anchorE3, setAnchorE3] = React.useState(null);
  // const [isAdminPath, setIsAdminPath] = useState(false);
  const [loaded, setloaded] = useState(false);
  const [profileopen, setprofileopen] = useState(false);
  const context = useContext(MyContext);
  const router = useRouter();
  const pathname = usePathname();

  const handleOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleOpen2 = (event: any) => {
    setAnchorE2(event.currentTarget);
  };
  const handleOpen3 = (event: any) => {
    setAnchorE3(event.currentTarget);
  };

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await axios.get("/api/industry/get");
        // console.log(response?.data?.industries);
        if (response?.data?.success) {
          const industries = response?.data?.industries?.map((element: any) => {
            const title = element?.Title;
            const capitalizedTitle = title
              .split(" ")
              .map(
                (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
              )
              .join(" ");
            return capitalizedTitle;
          });
          setindustries(industries);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchIndustries();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 65) {
        setscrolled(true);
      } else {
        setscrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // const open = Boolean(anchorEl);
  // const handleClick = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClose2 = () => {
    setAnchorE2(null);
  };
  const handleClose3 = () => {
    setAnchorE3(null);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get("/api/user/logout", {
        withCredentials: true,
      });
      if (response?.data?.success) {
        context?.setUser(null);
        context?.customToast(response?.data);
      }
    } catch (error) {
      context?.customToast({ success: false, message: "Something went wrong" });
    }
  };

  // Avoid rendering content if it's an admin path
  if (
    pathname.includes("/admin") ||
    pathname.includes("/signin") ||
    pathname.includes("/signup") ||
    pathname.includes("/forgot-password") ||
    (pathname.includes("/customer") &&
      !pathname.includes("/customer-success-stories"))
  ) {
    return null;
  }

  return (
    <div className="w-full relative xl:block ">
      <div
        className={`w-full h-[65px] fixed top-0 shadow-lg  ${scrolled ? "bg-white shadow-[#8cdcdd]/30" : ""
          } backdrop-blur-md z-50`}
        onMouseLeave={() => { }}
      >
        <div className="w-[90%] lg:w-[80%] h-full flex flex-row items-center justify-between m-auto">
          <a
            href="/#about-me"
            className="h-auto w-auto flex flex-row items-center"
          >
            <Image
              src="/logo.svg"
              alt="logo"
              width={17}
              height={17}
              className="cursor-pointer hover:animate-slowspin"
            />

            <span className="font-bold ml-[10px] md:block text-[#4E6D6D]">
              {/* WEBME */}
            </span>
          </a>

          <div className="h-full flex items-center justify-between gap-10 uppercase ">
            {/* <div className="flex items-center justify-between w-full h-auto mr-[15px] px-[20px] py-[10px] rounded-full text-black"> */}
            <a
              className="cursor-pointer hover:opacity-70 hidden lg:block"
              tabIndex={0}
              onClick={() => {
                setAnimated("leftslider1");
                setTimeout(() => {
                  setCompleted(true);
                }, 500);
                setClicked(true);
                setoption("about");
              }}
              onBlur={() => {
                if (animated && completed) {
                  setAnimated("leftslider2");
                  setCompleted(false);
                  setClicked(false);
                }
              }}
            >
              ABOUT
            </a>
            <a
              href="/#services"
              className="cursor-pointer hover:opacity-70 hidden lg:block"
            >
              Services
            </a>
            <a
              href="/customer-success-stories"
              className="cursor-pointer hover:opacity-70 hidden lg:block"
            >
              Customer Success Story
            </a>
            <a
              className="cursor-pointer hover:opacity-70 hidden 2xl:block"
              tabIndex={0}
              onClick={() => {
                setAnimated("leftslider1");
                setTimeout(() => {
                  setCompleted(true);
                }, 500);
                setClicked(true);
                setoption("industries");
              }}
              onBlur={() => {
                if (animated && completed) {
                  setAnimated("leftslider2");
                  setCompleted(false);
                  setClicked(false);
                }
              }}
              onFocus={() => console.log(true)}
            >
              Industries
            </a>
            <a
              href="/projects"
              className="cursor-pointer hover:opacity-70  hidden lg:block"
            >
              Projects
            </a>
            <a
              href="/"
              className="cursor-pointer hover:opacity-70  hidden lg:block"
              style={{ display: "none" }}
            >
              Products
            </a>
            <a
              href="/#pricing"
              className="cursor-pointer hover:opacity-70  hidden lg:block"
            >
              Pricing
            </a>
            <a
              href="https://store.webmedigital.com"
              className="cursor-pointer hover:opacity-70 hidden xl:block"
              target="_blank"
            >
              Store
            </a>
            <a
              href="tel:+971567295834"
              className="cursor-pointer hover:opacity-70  hidden lg:block"
              title="Call us at +971 56 729 5834"
            >
              Call
            </a>
            <div>
              <button onClick={handleOpen} className="lg:hidden text-[#446E6D]">
                <span className="font-semibold">Let&apos;s Go</span>{" "}
                <KeyboardArrowDownIcon fontSize="inherit" />
              </button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem>
                  <span onClick={handleOpen2} className="w-full">
                    About <KeyboardArrowDownIcon fontSize="inherit" />
                  </span>
                  <Menu
                    anchorEl={anchorE2}
                    open={Boolean(anchorE2)}
                    onClose={handleClose2}
                  >
                    {about.map((item, i) => (
                      <MenuItem
                        key={i}
                        onClick={() => {
                          window.location.href = `/about/${item
                            .split(" ")
                            .join("-")
                            .toLowerCase()}`;
                        }}
                      >
                        {item}
                      </MenuItem>
                    ))}
                  </Menu>
                </MenuItem>
                <MenuItem>
                  <a href="/#services">Services</a>
                </MenuItem>
                <MenuItem>
                  <a href="/customer-success-stories">Customer Success Story</a>
                </MenuItem>

                <MenuItem>
                  <span onClick={handleOpen3} className="w-full">
                    Industries <KeyboardArrowDownIcon fontSize="inherit" />
                  </span>
                  <Menu
                    anchorEl={anchorE3}
                    open={Boolean(anchorE3)}
                    onClose={handleClose3}
                  >
                    {industries.map((item: any, i: number) => (
                      <MenuItem
                        key={i}
                        onClick={() => {
                          window.location.href = `/industries/${item
                            // .split(" ")
                            // .join("-")
                            .toLowerCase()}`;
                        }}
                      >
                        {item}
                      </MenuItem>
                    ))}
                  </Menu>
                </MenuItem>
                <MenuItem>
                  <a href="/projects">Projects</a>
                </MenuItem>
                {/* <MenuItem><a href="/">Products</a></MenuItem> */}
                <MenuItem>
                  <a href="/#pricing">Pricing</a>
                </MenuItem>
                <MenuItem>
                  <a href="https://store.webmedigital.com/" target="_blank">Store</a>
                </MenuItem>
                <MenuItem>
                  <a href="tel:+971567295834"> Call</a>
                </MenuItem>
              </Menu>
            </div>
            {/* </div> */}
          </div>


          <div
            className="w-auto cursor-pointer text-left relative"
            onClick={() => setprofileopen(!profileopen)}
            onAbort={() => setprofileopen(false)}
            onBlur={() => setprofileopen(false)}
          >
            {context.user && !context.loading ? (
              <div>
                <p className="flex gap-2 font-bold items-center text-[#446E6D]">
                  <CircleUser size={20} />{" "}
                  {context?.user?.name?.split(" ")[0] ||
                    context?.user?.profile?.name?.split(" ")[0]}
                </p>
              </div>
            ) : (
              !context.loading && (
                <button
                  className=" lg:flex bg-[#446E6D] rounded py-3 px-7 font-semibold text-white text-sm "
                  onClick={() => {
                    router.push("/signin");
                  }}
                >
                  Connect<span className="invisible">-</span>
                  <span className="hidden lg:block"> WEBME</span>
                </button>
              )
            )}
            {context.loading && (
              <h1 className="w-20">
                <SkeletonTheme baseColor="transparent" highlightColor="#E7F7F6">
                  <Skeleton count={1} className="ladding-6" />
                </SkeletonTheme>
              </h1>
            )}
            {profileopen && context?.user && context?.user?.role && (
              <div
                className="absolute top-[200%] right-0 p-4 w-content bg-white rounded-lg overflow-hidden text-gray-600 flex flex-col gap-4 border-[3px] border-[#E7F7F6]/[70]
        shadow-sm shadow-[#E7F7F6]"
                onMouseLeave={() => setprofileopen(false)}
              >
                {
                  context.user &&
                  !context.loading &&
                  context.user?.role === "admin" && (
                    // <Link href="/admin">
                    <p
                      className="text-nowrap flex gap-3"
                      onClick={() => {
                        router.push("/admin/dashboard");
                      }}
                    >
                      <Crown /> Admin Dashboard
                    </p>
                  )
                  // </Link>
                }
                {
                  context.user &&
                  !context.loading &&
                  context.user?.role === "user" && (
                    // <Link href="/admin">
                    <p
                      className="text-nowrap flex gap-3"
                      onClick={() => {
                        router.push("/customer");
                      }}
                    >
                      <User /> Customer Dashboard
                    </p>
                  )
                  // </Link>
                }
                <p
                  className="text-nowrap flex gap-3"
                  onClick={() => handleLogout()}
                >
                  <LogOut /> logout
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={`w-[30%] max-w-[455px] min-h-screen max-h-screen fixed z-40 mt-[65px] overflow-y-auto bg-white boder-l-[1px] border-[#446E6D] ${animated ? "flex" : "hidden"
          }`}
        style={{ animation: `${animated} 0.5s ease-in-out forwards` }}
        onMouseEnter={() => {
          if (clicked) {
            setAnimated("leftslider1");
            setTimeout(() => {
              setCompleted(true);
            }, 500);
          }
        }}
        onMouseLeave={() => {
          if (animated && completed) {
            setAnimated("leftslider2");
            setCompleted(false);
            setClicked(false);
          }
        }}
        ref={slider}
      >
        <div className="w-full pl-[5vw] overflow-auto pb-48">
          <h1 className="mt-12 mb-4">
            <strong className="text-[40px] font-bold leading-[52px] font-mono">
              {option.toUpperCase()}
            </strong>
          </h1>
          {option === "industries" &&
            industries.map((item: any, i: number) => (
              <p
                className=" text-base text-nowrap font-semibold flex items-center text-[#747474] cursor-pointer hover:text-[#265353] pl-4 rounded-md py-3 hover:bg-[#e7f7f68f] justify-start gap-3 box-border opani"
                key={i}
                onClick={() => {
                  window.location.href = `/industries/${item
                    .split(" ")
                    .join(" ")
                    .toLowerCase()}`;
                }}
              >
                <AddReactionIcon fontSize="inherit" />
                {item}
              </p>
            ))}
          {option === "about" &&
            about.map((item, i) => (
              <p
                className=" text-base text-nowrap font-semibold flex items-center text-[#747474] cursor-pointer hover:text-[#265353] pl-4 rounded-md py-3 hover:bg-[#e7f7f68f] justify-start gap-3 box-border opani"
                key={i}
                onClick={() => {
                  window.location.href = `/about/${item
                    .split(" ")
                    .join("-")
                    .toLowerCase()}`;
                  // const url =
                }}
              >
                <AddReactionIcon fontSize="inherit" />
                {item}
              </p>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
