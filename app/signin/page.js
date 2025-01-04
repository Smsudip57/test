'use client';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { MyContext } from '@/context/context';  // Import UserContext
import { useRouter } from 'next/navigation';

export default function Example() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser, customToast } = useContext(MyContext); 
  const router = useRouter();
  const context = useContext(MyContext);


  useEffect(() => {
    if (context?.user) {
      if(context?.user?.role === 'admin'){router.push('/admin'); window.location.reload();}
        else if(context?.user?.role === 'user'){
          router.push('/customer');
          window.location.reload();
        }else {
          router.push('/');
          window.location.reload();
        }
    }
  }, [context?.user, router]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      customToast({success:false, message:'Email and password are required.'});
      return;
    }

    // Clear any existing errors
    setError('');

    try {
      // Send a POST request with email and password
      const response = await axios.post('/api/login', { email, password });

      if (response.data.user) {
        // If user data is returned, set it to the context state
        setUser(response.data.user);
        customToast(response.data);
        if(response?.data?.user?.role === 'admin'){router.push('/admin'); window.location.reload();}
        else if(response?.data?.user?.role === 'user'){
          router.push('/customer');
          window.location.reload();
        }
      } else {
        customToast({success:false, message:'Something went wrong'});
      }
    } catch (err) {
        customToast(err.response.data);
    }

    // After successful submission, reset the fields
    setEmail('');
    setPassword('');
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 relative">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="/logo.svg"
            className="mx-auto h-16 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-none border-2 border-gray-300 focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D] sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-[#446E6D] hover:text-[#345251]">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-none border-2 border-gray-300 focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D] sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                onClick={handleSubmit}
                className="flex w-full justify-center rounded-md bg-[#446E6D] px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-[#345251] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#446E6D]"
              >
                Sign in
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link href="/signup" className='font-semibold text-[#446E6D] hover:text-[#345251]'>Sign up</Link>
          </p>
        </div>
      </div>
    </>
  );
}
