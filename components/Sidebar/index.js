"use client";
import Button from '@mui/material/Button';
import { MdDashboard } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";
import { FaProductHunt } from "react-icons/fa";
import { FaCartArrowDown } from "react-icons/fa6";
import { MdMessage } from "react-icons/md";
import { FaBell } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import Link from 'next/link';
import { useContext, useState } from 'react';
import { IoMdLogOut } from "react-icons/io";
import { MyContext } from '@/context/context';
import { FaClipboardCheck } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BiSolidCategory } from "react-icons/bi";
import { TbSlideshow } from "react-icons/tb";

const Sidebar = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const context = useContext(MyContext);
    const [isClient, setIsClient] = useState(false); 
    const router =  useRouter()

    const isOpenSubmenu = (index) => {
        setActiveTab(index);
        setIsToggleSubmenu(!isToggleSubmenu);
    };

    // console.log(router);

    useEffect(() => {
        setIsClient(true);
        const token = localStorage.getItem("token");
        if (token !== "" && token !== undefined && token !== null) {
            setIsLogin(true);
        } else {
            // if(router)
            // router.push("/secret-location/admin/secret-location/admin/dashboard/login");
        }
    }, []);

    const logout = () => {
        localStorage.clear();
        context.setAlertBox({
            open: true,
            error: false,
            msg: "Logout successful"
        });

        setTimeout(() => {
            // if(router)
            // router.push("/secret-location/admin/secret-location/admin/dashboard/login");
        }, 2000);
    };

    // Manage active class based on the current route
    const getActiveClass = (path) => {
        if(router)
        return router.pathname === path ? 'active' : '';
    };

    return (
        <>
            <div className="sidebar">
                <ul>
                    <li>
                        <Link href="/secret-location/admin/" >
                            <Button className={`w-100 ${getActiveClass("/secret-location/admin/")}`} onClick={() => {
                                isOpenSubmenu(0);
                                context.setIsOpenNav(false);
                            }}>
                                <span className='icon'><MdDashboard /></span>
                                Dashboard
                            </Button>
                        </Link>
                    </li>

                    <li>
                        <Button className={`w-100 ${activeTab === 1 && isToggleSubmenu ? 'active' : ''}`} onClick={() => isOpenSubmenu(1)}>
                            <span className='icon'><TbSlideshow /></span>
                            Home Banner Slides
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 1 && isToggleSubmenu ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li>
                                    <Link href="/secret-location/admin/homeBannerSlide/add" >
                                        Add Home Banner Slide
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/secret-location/admin/homeBannerSlide/list" >
                                        Home Slides List
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li>
                        <Button className={`w-100 ${activeTab === 2 && isToggleSubmenu ? 'active' : ''}`} onClick={() => isOpenSubmenu(2)}>
                            <span className='icon'><BiSolidCategory /></span>
                            Category
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 2 && isToggleSubmenu ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li>
                                    <Link href="/secret-location/admin/category" >
                                        Category List
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/secret-location/admin/category/add" >
                                        Add a category
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/secret-location/admin/subCategory" >
                                        Sub Category List
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/secret-location/admin/subCategory/add" >
                                        Add a sub category
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li>
                        <Button className={`w-100 ${activeTab === 3 && isToggleSubmenu ? 'active' : ''}`} onClick={() => isOpenSubmenu(3)}>
                            <span className='icon'><FaProductHunt /></span>
                            Products
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 3 && isToggleSubmenu ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li>
                                    <Link href="/secret-location/admin/products" >
                                        Product List
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/secret-location/admin/product/upload" >
                                        Product Upload
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/secret-location/admin/productRAMS/add" >
                                        Add Product RAMS
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/secret-location/admin/productWEIGHT/add" >
                                        Add Product WEIGHT
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/secret-location/admin/productSIZE/add" >
                                        Add Product SIZE
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li>
                        <Link href="/secret-location/admin/orders" >
                            <Button className={`w-100 ${getActiveClass("/secret-location/admin/orders")}`} onClick={() => {
                                isOpenSubmenu(4);
                                context.setIsOpenNav(false);
                            }}>
                                <span className='icon'><FaClipboardCheck fontSize="small" /></span>
                                Orders
                            </Button>
                        </Link>
                    </li>

                    <li>
                        <Button className={`w-100 ${activeTab === 5 && isToggleSubmenu ? 'active' : ''}`} onClick={() => isOpenSubmenu(5)}>
                            <span className='icon'><TbSlideshow /></span>
                            Home Banners
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 5 && isToggleSubmenu ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li>
                                    <Link href="/secret-location/admin/banners" >
                                        Banners List
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/secret-location/admin/banners/add" >
                                        Banner Upload
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>

                <br />

                <div className='logoutWrapper'>
                    <div className='logoutBox'>
                        <Button variant="contained" onClick={() => {
                            logout();
                            context.setIsOpenNav(false);
                        }}>
                            <IoMdLogOut /> Logout
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
