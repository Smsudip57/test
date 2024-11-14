"use client"
import "bootstrap/dist/css/bootstrap.min.css";
import "@/App.css";
import "@/responsive.css";
import React, { createContext, useEffect, useState, useRef } from "react";
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
import Login from "@/admin-pages/Login";


export default function page() {
  return (
    <div><Login/></div>
  )
}
