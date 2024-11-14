import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/public/mysql.png';
import patern from '@/public/mysql.png';
import googleIcon from '/public/mysql.png';
import { MyContext } from '@/context/context';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "@/connect/firebase";
import { postData } from '@/utils/api';

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const Login = () => {
    const [inputIndex, setInputIndex] = useState(null);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const router = useRouter();
    const context = useContext(MyContext);

    const [formFields, setFormFields] = useState({
        email: "",
        password: "",
        isAdmin: true
    });

    useEffect(() => {
        context.setisHideSidebarAndHeader(true);

        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token) {
                setIsLogin(true);
                router.push("/secret-location/admin/");
            }
        }
    }, [router, context]);

    const focusInput = (index) => setInputIndex(index);

    const onChangeInput = (e) => {
        setFormFields({
            ...formFields,
            [e.target.name]: e.target.value
        });
    };

    const signIn = async (e) => {
        e.preventDefault();

        if (formFields.email === "") {
            context.setAlertBox({ open: true, error: true, msg: "Email cannot be blank!" });
            return;
        }

        if (formFields.password === "") {
            context.setAlertBox({ open: true, error: true, msg: "Password cannot be blank!" });
            return;
        }

        setIsLoading(true);
        try {
            const res = await postData("/api/user/signin", formFields);

            if (res.error) {
                context.setAlertBox({ open: true, error: true, msg: res.msg });
            } else {
                localStorage.setItem("token", res.token);

                if (res.user?.isAdmin) {
                    const user = {
                        name: res.user.name,
                        email: res.user.email,
                        userId: res.user.id,
                        isAdmin: res.user.isAdmin
                    };
                    localStorage.setItem("user", JSON.stringify(user));
                    context.setAlertBox({ open: true, error: false, msg: "User Login Successfully!" });

                    setTimeout(() => {
                        context.setIsLogin(true);
                        router.push("/secret-location/admin/dashboard");
                    }, 2000);
                } else {
                    context.setAlertBox({ open: true, error: true, msg: "You are not an admin" });
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        if (typeof window !== "undefined") {
            try {
                const result = await signInWithPopup(auth, googleProvider);
                const user = result.user;

                const fields = {
                    name: user.providerData[0].displayName,
                    email: user.providerData[0].email,
                    password: null,
                    images: user.providerData[0].photoURL,
                    phone: user.providerData[0].phoneNumber,
                    isAdmin: true
                };

                const res = await postData("/api/user/authWithGoogle", fields);

                if (!res.error) {
                    localStorage.setItem("token", res.token);
                    const userData = {
                        name: res.user.name,
                        email: res.user.email,
                        userId: res.user.id
                    };
                    localStorage.setItem("user", JSON.stringify(userData));
                    context.setUser(userData);

                    context.setAlertBox({ open: true, error: false, msg: res.msg });
                    setTimeout(() => {
                        context.setIsLogin(true);
                        router.push("/secret-location/admin/dashboard");
                    }, 2000);
                } else {
                    context.setAlertBox({ open: true, error: true, msg: res.msg });
                }
            } catch (error) {
                context.setAlertBox({ open: true, error: true, msg: error.message });
            }
        }
    };

    return (
        <>
            <Image src={patern} className='loginPatern' alt="Pattern" />
            <section className="loginSection">
                <div className="loginBox">
                    <div className='logo text-center'>
                        <Image src={Logo} width="60" alt="Logo" />
                        <h5 className='font-weight-bold'>Login to Hotash</h5>
                    </div>

                    <div className='wrapper mt-3 card border'>
                        <form onSubmit={signIn}>
                            <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                                <span className='icon'><MdEmail /></span>
                                <input type='text' className='form-control' placeholder='Enter your email'
                                    onFocus={() => focusInput(0)} onBlur={() => setInputIndex(null)}
                                    name="email" onChange={onChangeInput} />
                            </div>

                            <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                                <span className='icon'><RiLockPasswordFill /></span>
                                <input type={isShowPassword ? 'text' : 'password'} className='form-control' placeholder='Enter your password'
                                    onFocus={() => focusInput(1)} onBlur={() => setInputIndex(null)}
                                    name="password" onChange={onChangeInput} />
                                <span className='toggleShowPassword' onClick={() => setIsShowPassword(!isShowPassword)}>
                                    {isShowPassword ? <IoMdEyeOff /> : <IoMdEye />}
                                </span>
                            </div>

                            <div className='form-group'>
                                <Button type='submit' className="btn-blue btn-lg w-100">
                                    {isLoading ? <CircularProgress /> : 'Sign In'}
                                </Button>
                            </div>

                            <div className='form-group text-center mb-0'>
                                <Link href="/forgot-password" className="link">FORGOT PASSWORD</Link>
                                <div className='d-flex align-items-center justify-content-center or mt-3 mb-3'>
                                    <span className='line'></span>
                                    <span className='txt'>or</span>
                                    <span className='line'></span>
                                </div>
                                <Button variant="outlined" className='w-100' onClick={signInWithGoogle}>
                                    <Image src={googleIcon} width="25" alt="Google Icon" /> &nbsp; Sign In with Google
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className='wrapper mt-3 card border footer p-3'>
                        <span className='text-center'>
                            Don't have an account?
                            <Link href="/signUp" className='link color ml-2'>Register</Link>
                        </span>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Login;
