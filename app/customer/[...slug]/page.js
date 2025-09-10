import Adminnav from './customernav';
import Navbar from './navbar';
import Profile from './profile';
import Consultancy from './consultancy';
import Settings from './settings'
import { Nunito } from 'next/font/google';

const inter = Nunito({
  subsets: ['latin'],
  weight: ['400', '700'],
});


export default async function Page({params}) {
  let user = null;
  let login
  
   
  const slug = await params.slug;


  const renderContent = () => {
    if (!slug) {
        return (
          <div className='p-6 pt-24 h-[200vh]'>
          {user && user?.profile?.name && <h1 className='text-2xl font-bold'>Welcome, {user?.profile?.name}!</h1>}
          <p className='mt-4'>You are now logged in.</p>
        </div>
        )
    }
        
    switch (slug[0]) {
      case 'consultancy':
        return <Consultancy />
      case 'setting':
        return <Settings />
      case 'profile':
        return <Profile />
      default:
        return (
          <div className='p-6 pt-24 h-[200vh]'>
          {user && user?.profile?.name && <h1 className='text-2xl font-bold'>Welcome, {user?.profile?.name}!</h1>}
          <p className='mt-4'>You are now logged in.</p>
        </div>
        )
    }
    
  };


  return (
    <div className={`${inter.className} relative bg-[#F3F4F6] min-h-screen`}>
      <Adminnav user={user} login={login?.data?.loginOn}/>
      <div className='w-full relative flex'>
        <Navbar />
        <div className='p-6 pt-28 w-full'>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
