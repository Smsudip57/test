"use client";
import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";  
import Button from "@mui/material/Button";
import { MdMenuOpen, MdOutlineMenu, MdOutlineLightMode, MdNightlightRound } from "react-icons/md";
import { FaRegBell } from "react-icons/fa";
import { IoMenu, IoCartOutline } from "react-icons/io5";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Logout from "@mui/icons-material/Logout";
import Divider from "@mui/material/Divider";
import { MyContext } from "@/context/context"; 
import UserAvatarImgComponent from "../userAvatarImg";
import { useRouter } from "next/navigation";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpennotificationDrop, setIsOpennotificationDrop] = useState(false);
  const openMyAcc = Boolean(anchorEl);
  const openNotifications = Boolean(isOpennotificationDrop);

  const context = useContext(MyContext);
  const [isClient, setIsClient] = useState(false); 
  const router = useRouter();

  const handleOpenMyAccDrop = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMyAccDrop = () => {
    setAnchorEl(null);
  };

  const handleOpenNotificationsDrop = () => {
    setIsOpennotificationDrop(true);
  };

  const handleCloseNotificationsDrop = () => {
    setIsOpennotificationDrop(false);
  };

  const changeTheme = () => {
    context.setTheme(context.theme === "dark" ? "light" : "dark");
  };

  const logout = () => {
    localStorage.clear();
    setAnchorEl(null);

    context.setAlertBox({
      open: true,
      error: false,
      msg: "Logout successful",
    });

    setTimeout(() => {
      router.push("/admin/dashboard/login");
    }, 2000);
  };

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const handleResize = () => {
        context.setWindowWidth(window.innerWidth);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [context]);

  // if (context) {
  //   return <div>{console.log(context)}</div>; // Show loading state if context is not yet available
  // }

  return (
    <header className="d-flex align-items-center">
      <div className="container-fluid w-100">
        <div className="row d-flex align-items-center w-100">
          {/* Logo Wrapper */}
          <div className="col-sm-2 part1 pr-0">
            <Link href="/" passHref>
              <span className="d-flex align-items-center logo">
                <Image src="/mysql.png" alt="Logo" width={40} height={40} />
                <span className="ml-2">ECOMMERCE</span>
              </span>
            </Link>
          </div>

          {context.windowWidth > 992 && (
            <div className="col-sm-3 d-flex align-items-center part2">
              <Button
                className="rounded-circle mr-3"
                onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}
              >
                {context.isToggleSidebar === false ? <MdMenuOpen /> : <MdOutlineMenu />}
              </Button>
              {/* SearchBox Component */}
              {/* <SearchBox /> */}
            </div>
          )}

          <div className="col-sm-7 d-flex align-items-center justify-content-end part3">
            <Button className="rounded-circle mr-3" onClick={changeTheme}>
              {context.theme === "light" ? <MdNightlightRound /> : <MdOutlineLightMode />}
            </Button>

            <div className="dropdownWrapper position-relative">
              <Button className="rounded-circle mr-3" onClick={handleOpenNotificationsDrop}>
                <FaRegBell />
              </Button>

              {context.windowWidth < 992 && (
                <Button className="rounded-circle mr-3" onClick={() => context.openNav()}>
                  <IoMenu />
                </Button>
              )}

              {/* Notifications Menu */}
              <Menu
                anchorEl={isOpennotificationDrop}
                className="notifications dropdown_list"
                open={openNotifications}
                onClose={handleCloseNotificationsDrop}
                onClick={handleCloseNotificationsDrop}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <div className="head pl-3 pb-0">
                  <h4>Orders (12)</h4>
                </div>
                <Divider className="mb-1" />
                <div className="scroll">
                  {/* Add Notification Items Here */}
                </div>

                <div className="pl-3 pr-3 w-100 pt-2 pb-1">
                  <Button className="btn-blue w-100">View all notifications</Button>
                </div>
              </Menu>
            </div>

            {context.isLogin !== true ? (
              <Link href="/admin/login" >
                <Button className="btn-blue btn-lg btn-round">Sign In</Button>
              </Link>
            ) : (
              <div className="myAccWrapper">
                <Button
                  className="myAcc d-flex align-items-center"
                  onClick={handleOpenMyAccDrop}
                >
                  <div className="userImg">
                    <span className="rounded-circle">
                      {context.user?.name?.charAt(0)}
                    </span>
                  </div>

                  <div className="userInfo res-hide">
                    <h4>{context.user?.name}</h4>
                    <p className="mb-0 text-lowercase">{context.user?.email}</p>
                  </div>
                </Button>

                {/* User Account Menu */}
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={openMyAcc}
                  onClose={handleCloseMyAccDrop}
                  onClick={handleCloseMyAccDrop}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={handleCloseMyAccDrop}>
                    <ListItemIcon>
                      <PersonAdd fontSize="small" />
                    </ListItemIcon>
                    My Account
                  </MenuItem>
                  <MenuItem onClick={handleCloseMyAccDrop}>
                    <ListItemIcon>
                      {/* <IoShieldHalfSharp /> */}
                    </ListItemIcon>
                    Reset Password
                  </MenuItem>
                  <MenuItem onClick={logout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
