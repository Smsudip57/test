import Adminnav from './adminnav';
import Navbar from './navbar';
import Editwebsite from '@/components/website/editwebsite';
import Chat from '@/components/chat/adminchat';


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
      case 'website':
        return <Editwebsite params={slug}/>
      case 'chat':
        return <Chat params={slug}/>
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
    <div className='relative bg-[#F3F4F6]'>
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
