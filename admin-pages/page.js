'use client';

import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/App.css";
import "@/responsive.css";
import Dashboard from "@/admin-pages/Dashboard";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import React, { createContext, useEffect, useState, useRef } from "react";
import Login from "@/admin-pages/Login";
import SignUp from "@/admin-pages/SignUp";
import Products from "@/admin-pages/Products";
import Category from "@/admin-pages/Category/categoryList";
import ProductDetails from "@/admin-pages/ProductDetails";
import ProductUpload from "@/admin-pages/Products/addProduct";
import EditProduct from "@/admin-pages/Products/editProduct";
import CategoryAdd from "@/admin-pages/Category/addCategory";
import EditCategory from "@/admin-pages/Category/editCategory";
import SubCatAdd from "@/admin-pages/Category/addSubCat";
import SubCatList from "@/admin-pages/Category/subCategoryList";
import AddProductRAMS from "@/admin-pages/Products/addProductRAMS";
import ProductWeight from "@/admin-pages/Products/addProductWeight";
import ProductSize from "@/admin-pages/Products/addProductSize";
import Orders from "@/admin-pages/Orders";
import AddHomeBannerSlide from "@/admin-pages/HomeBanner/addHomeSlide";
import HomeBannerSlideList from "@/admin-pages/HomeBanner/homeSlideList";
import EditHomeBannerSlide from "@/admin-pages/HomeBanner/editSlide";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import LoadingBar from "react-top-loading-bar";
import { fetchDataFromApi } from "@/utils/api";

import axios from "axios";
import BannersList from "@/admin-pages/Banners/bannerList";
import AddBanner from "@/admin-pages/Banners/addHomeBanner";
import EditBanner from "@/admin-pages/Banners/editHomeBanner";

const MyContext = createContext();

function App() {
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isHideSidebarAndHeader, setisHideSidebarAndHeader] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
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

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token !== "" && token !== undefined && token !== null) {
      setIsLogin(true);

      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
      // console.log(userData);
    } else {
      setIsLogin(false);
    }
  }, [isLogin, localStorage.getItem("user")]);

  useEffect(() => {
    getCountry("https://countriesnow.space/api/v0.1/countries/");
  }, []);

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
    setIsOpenNav
  };

  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
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
        <div className="main d-flex">
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
            <Routes>
              <Route path="/secret-location/admin/" exact={true} element={<Dashboard />} />
              <Route path="/secret-location/admin/dashboard" exact={true} element={<Dashboard />} />
              <Route path="/secret-location/admin/login" exact={true} element={<Login />} />
              <Route path="/secret-location/admin/signUp" exact={true} element={<SignUp />} />
              <Route path="/secret-location/admin/products" exact={true} element={<Products />} />
              <Route
                path="/secret-location/admin/product/details/:id"
                exact={true}
                element={<ProductDetails />}
              />
              <Route
                path="/secret-location/admin/product/upload"
                exact={true}
                element={<ProductUpload />}
              />
              <Route
                path="/secret-location/admin/product/edit/:id"
                exact={true}
                element={<EditProduct />}
              />
              <Route path="/secret-location/admin/category" exact={true} element={<Category />} />
              <Route
                path="/secret-location/admin/category/add"
                exact={true}
                element={<CategoryAdd />}
              />
              <Route
                path="/secret-location/admin/category/edit/:id"
                exact={true}
                element={<EditCategory />}
              />
              <Route
                path="/secret-location/admin/subCategory/"
                exact={true}
                element={<SubCatList />}
              />
              <Route
                path="/secret-location/admin/subCategory/add"
                exact={true}
                element={<SubCatAdd />}
              />
              <Route
                path="/secret-location/admin/productRAMS/add"
                exact={true}
                element={<AddProductRAMS />}
              />
              <Route
                path="/secret-location/admin/productWEIGHT/add"
                exact={true}
                element={<ProductWeight />}
              />
              <Route
                path="/secret-location/admin/productSIZE/add"
                exact={true}
                element={<ProductSize />}
              />
              <Route path="/secret-location/admin/orders/" exact={true} element={<Orders />} />
              <Route
                path="/secret-location/admin/homeBannerSlide/add"
                exact={true}
                element={<AddHomeBannerSlide />}
              />
              <Route
                path="/secret-location/admin/homeBannerSlide/list"
                exact={true}
                element={<HomeBannerSlideList />}
              />
              <Route
                path="/secret-location/admin/homeBannerSlide/edit/:id"
                exact={true}
                element={<EditHomeBannerSlide />}
              />

              <Route path="/secret-location/admin/banners" exact={true} element={<BannersList />} />
              <Route path="/secret-location/admin/banners/add" exact={true} element={<AddBanner />} />
              <Route
                path="/secret-location/admin/banners/edit/:id"
                exact={true}
                element={<EditBanner />}
              />
            </Routes>
          </div>
        </div>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
export { MyContext };
