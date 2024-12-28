"use client";
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { fetchDataFromApi } from "@/utils/api";

const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isHideSidebarAndHeader, setisHideSidebarAndHeader] = useState(false);
  const [theme, setTheme] = useState("light");
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
      const storedTheme = localStorage.getItem("theme");
      setTheme(storedTheme ? storedTheme : "light");
    }
  }, []);
  useEffect(() => {
    // Check if the code is running in the browser
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
  
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
  
      // Cleanup event listener on component unmount
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  // Handle login state from localStorage
 useEffect(() => {
  // Ensure the code only runs on the client side
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogin(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    } else {
      setIsLogin(false);
    }
  }
}, []);  // Run this effect once, similar to componentDidMount


  // Fetch countries list
  useEffect(() => {
    getCountry("https://countriesnow.space/api/v0.1/countries/");
  }, []);

  const getCountry = async (url) => {
    const response = await axios.get(url);
    setCountryList(response.data.data);
  };

  // Fetch categories
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setProgress(20);
    // fetchCategory();
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

  const values = {
    isToggleSidebar,
    setIsToggleSidebar,
    isLogin,
    setIsLogin,
    isHideSidebarAndHeader,
    setisHideSidebarAndHeader,
    theme,
    setTheme,
    alertBox,
    setAlertBox,
    setProgress,
    baseUrl,
    catData,
    fetchCategory,
    setUser,
    user,
    countryList,
    selectedCountry,
    setselectedCountry,
    windowWidth,
    openNav,
    setIsOpenNav,
  };

  return <MyContext.Provider value={values}>{children}</MyContext.Provider>;
};

export { MyContext };
