'use client';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { MyContext } from '@/context/context'; // Import UserContext
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user'); // Default role
  const [error, setError] = useState('');
  const { customToast, setUser, user } = useContext(MyContext);
  const router = useRouter();


  useEffect(() => {
    if (user) {
      if(user?.role === 'admin'){router.push('/admin'); ;}
        else if(user?.role === 'user'){
          router.push('/customer');
          ;
        }else {
          router.push('/');
          ;
        }
    }
  }, [user, router]);


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate input before submission
    if (!email || !password || !name ) {
      customToast({ success: false, message: 'All fields are required.' });
      return;
    }
  
    // Clear any existing errors
    setError('');
  
    // Create a new AbortController instance
    const controller = new AbortController();
    const { signal } = controller;
  
    try {
      // Send a POST request with email, name, password, and role, including the abort signal
      const response = await axios.post('/api/register', { email, name, password, role }, {
        signal: signal, // Attach the abort signal here
      });
  
      if (response.data.user) {
        // If user data is returned, set it to the context state
        setUser(response.data.user);
        customToast(response.data);
        if (response?.data?.user?.role === 'admin') {
          router.push('/admin');
        } else if (response?.data?.user?.role === 'user') {
          router.push('/customer');
        }
      } else {
        customToast({ success: false, message: 'Something went wrong' });
      }
    } catch (err) {
      // Handle errors, including request cancellation
      if (err.name === 'AbortError') {
      } else {
        customToast(err.response?.data || { success: false, message: 'An error occurred' });
      }
    }
  
    // After successful submission, reset the fields
    setEmail('');
    setPassword('');
    setName('');
  
    // Optional: you could abort the request after a timeout or some other condition
    // controller.abort(); // This can be used to cancel the request if needed
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
            Create a new account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-none border-2 border-gray-300 focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D] sm:text-sm"
                  placeholder="Enter your name"
                />
              </div>
            </div>

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
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
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
              <label htmlFor="role" className="block text-sm font-medium text-gray-900">
                Role
              </label>
              <div className="mt-2">
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-none border-2 border-gray-300 focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D] sm:text-sm"
                >
                  <option value="user">Customer </option>
                  <option value="vendor">Vendor</option>
                  <option value="freelancer">Freelancer</option>
                </select>
              </div>
            </div>

            <div>
              <button
                onClick={handleSubmit}
                className="flex w-full justify-center rounded-md bg-[#446E6D] px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-[#345251] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#446E6D]"
              >
                Sign up
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/signin" className='font-semibold text-[#446E6D] hover:text-[#345251]'>Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
