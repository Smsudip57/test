"use client";

import React, { createContext, useState, useEffect,useRef, } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { useRouter,notFound, usePathname } from "next/navigation";
import CircularProgress from '@mui/material/CircularProgress';


export const MyContext = createContext(); 

export const ThemeProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [login, setLogin] = useState(false);
  const fetchedOnce = useRef(false); 
  const router = useRouter();
  const pathname = usePathname();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmFunction, setConfirmFunction] = useState(null);
  const [boxOpen, setChatBoxOpen] = useState(false);
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_BASE_URL;


  const customToast = (value) => {
    if(value.success){
      toast.success(value.message);
    }else{
      toast.error(value.message);
    }
  }



  useEffect(() => {
    if (fetchedOnce.current) return; 
    fetchedOnce.current = true;
    const fetchUserData = async () => {
      setLogin(true);
      try {
        const response = await axios.get("/api/getuserinfo", {
          withCredentials: true,
        },
      );
        if (response.data) {
          setUser(response.data.user); 
        } else {
          setUser(null); 
          if(pathname.includes("/customer")){
            router.push("/login");
            customToast({success:false, message:'Please log in.'});
          }
        }
      } catch (err) {
        customToast(err?.response?.data)
        setError(err.message); 
        setUser(null); 
        if(window.location.href.includes("dashboard")){
          router.push("/login");
          customToast({success:false, message:'Please log in.'});
        }
      } finally {
        setLoading(false); 
      }
    };

    if(!user || user.length === 0 ){
    fetchUserData();
  }
  }, [])

 


  
  // progress && <CircularProgressWithLabel value={progress} />

  return (
    <MyContext.Provider value={{ user, setUser,login,setLogin, loading, error, customToast, showConfirm, setShowConfirm, confirmFunction, setConfirmFunction, boxOpen, setChatBoxOpen }}>
      {children}
    </MyContext.Provider>
  );
};
