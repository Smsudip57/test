import React from 'react'
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';

export default function Adminnav({user}) {
  return (
    <header className='bg-[#C1EBE7] w-full px-[10%] py-5 text-[#446E6D border-b-2 border-[#446e6d25] shadow-md fixed top-0 z-10'>
        <div className='container mx-auto flex justify-between items-center'>
        <div className='flex items-center space-x-4 justify-center'>
        <Link href={`/`}>
        <img alt="logo" width="17" height="17"  className="cursor-pointer hover:animate-slowspin"  src="/logo.svg"/>
        </Link>
        <h1 className='text-[#446E6D] text-xl font-bold'>Webmedigital Admin pannel</h1>
        </div>
            <nav>
            <ul className='flex space-x-16'>
                <li className='grid cursor-pointer'>
                 <h1 className='text-[#446E6D] text-xl font-bold'>
                  {user && user.name && `Welcome, ${user.name}!`}
                  <Link href='/secret-location/admin/login'>
                  {!user && 'Please log in!'}
                  </Link>
                    </h1>
                </li>
                <li title='Logout' className='cursor-pointer'>
                <Link href='/logout'><LogoutIcon className="text-[#446E6D]"/></Link>
                </li>
            </ul>
            </nav>
        </div>
    </header>
  )
}
