"use client";

import React, { createContext, useState, useEffect,useRef, } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import CircularProgress from '@mui/material/CircularProgress';

export const MyContext = createContext(); 

export const ThemeProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [login, setLogin] = useState(false);
  const [progress, setProgress] = useState(0);
  const fetchedOnce = useRef(false); 
  const router = useRouter();


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

        if (response.data.success) {
          setUser(response.data.data); 
        } else {
          setUser(null); 
          if(window.location.href.includes("dashboard")){
            router.push("/login");
            customToast({success:false, message:'Please log in.'});
          }
        }
      } catch (err) {
        customToast(err.response.data)
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
    <MyContext.Provider value={{ user, setUser,login,setLogin, loading, error, customToast }}>
      {children}
    </MyContext.Provider>
  );
};
