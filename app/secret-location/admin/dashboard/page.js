"use client"
import Dashboard from "@/admin-pages/Dashboard"
import "bootstrap/dist/css/bootstrap.min.css";
import "@/App.css";
import "@/responsive.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import React, { createContext, useEffect, useState, useRef } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import LoadingBar from "react-top-loading-bar";
import { fetchDataFromApi } from "@/utils/api";
import axios from "axios";
export default function Dashboardpage() {
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isHideSidebarAndHeader, setisHideSidebarAndHeader] = useState(false);
  const [theme, setTheme] = useState();
  const [windowWidth, setWindowWidth] = useState();
  const [catData, setCatData] = useState([]);
  const [user, setUser] = useState({
    name: "",
    email: "",
    userId: "",
  });

  const [isOpenNav, setIsOpenNav] = useState(false);

  const [baseUrl, setBaseUrl] = useState("http://localhost:4000");

  const [progress, setProgress] = useState(0);
  const [alertBox, setAlertBox] = useState({
    msg: "",
    error: false,
    open: false,
  });

  const [selectedLocation, setSelectedLocation] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setselectedCountry] = useState("");


  
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Set window width
      setWindowWidth(window.innerWidth);
  
      // Handle theme from localStorage
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        setTheme("light"); // Default theme
      }
  
      // Handle token and user from localStorage
      const token = localStorage.getItem("token");
      if (token) {
        setIsLogin(true);
        const userData = JSON.parse(localStorage.getItem("user"));
        setUser(userData);
      } else {
        setIsLogin(false);
      }
    }
  }, []); // Only run once when component mounts
  
  useEffect(() => {
    // Set the theme in the DOM and localStorage whenever it changes
    if (typeof window !== "undefined") {
      if (theme === "dark") {
        document.body.classList.add("dark");
        document.body.classList.remove("light");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.add("light");
        document.body.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, [theme]); // Run whenever the theme changes
  

  const getCountry = async (url) => {
    const responsive = await axios.get(url).then((res) => {
      setCountryList(res.data.data);
    });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertBox({
      open: false,
    });
  };

  useEffect(() => {
    setProgress(20);
    fetchCategory();
  }, []);

  const fetchCategory = () => {
    fetchDataFromApi("/api/category").then((res) => {
      setCatData(res);
      setProgress(100);
    });
  };

  const openNav = () => {
    setIsOpenNav(true);
  };



    return (
        <div className=" relative ">
            <LoadingBar
          color="#f11946"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
          className="topLoadingBar"
        />

        <Snackbar
          open={alertBox.open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            autoHideDuration={6000}
            severity={alertBox.error === false ? "success" : "error"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {alertBox.msg}
          </Alert>
        </Snackbar>
            {isHideSidebarAndHeader !== true && <Header />}
        <div className="main flex">
          {isHideSidebarAndHeader !== true && (
            <>
              <div
                className={`sidebarOverlay d-none ${
                  isOpenNav === true && "show"
                }`}
                onClick={() => setIsOpenNav(false)}
              ></div>
              <div
                className={`sidebarWrapper ${
                  isToggleSidebar === true ? "toggle" : ""
                } ${isOpenNav === true ? "open" : ""}`}
              >
                <Sidebar />
              </div>
            </>
          )}
          <div
            className={`content ${isHideSidebarAndHeader === true && "full"} ${
              isToggleSidebar === true ? "toggle" : ""
            }`}
          >

            <Dashboard />   
          </div>
          </div>

          
        </div>
    )
}