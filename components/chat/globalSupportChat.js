'use client'
import React,{useEffect, useState, useContext} from 'react'
import {MessagesSquare, Headset,SendHorizontal, CheckCheck  } from 'lucide-react'
import { MyContext } from '@/context/context';
import axios from 'axios';
import io from "socket.io-client";
import { usePathname } from 'next/navigation';

export default function Page() {
    const [chatmessages, setChatMessages] = useState([]);
      const [sessionProduct, setSessionProduct] = useState();
      const [socket, setSocket] = useState(null); 
      const [newMessage, setNewMessage] = useState('');
      const {user, loading, boxOpen, setChatBoxOpen} = useContext(MyContext);
      
      const [sessionActive, setSessionActive] = useState();
      const [greeting, setGreeting] = useState('');
      const [form, setForm] = useState({name:'',email:''});
      const [emptyForm, setEmptyForm] = useState({name:false,email:false});
      const [chatloading, setchatloading] = useState(false);
      const pathname = usePathname();

      if(pathname.startsWith('/admin')){return null}
      
      useEffect(() => {
        const hour = new Date().getHours();
    
        if (hour >= 0 && hour < 5) {
          setGreeting('Good Night');
        } else if (hour >= 5 && hour < 9) {
          setGreeting('Good Morning');
        } else if (hour >= 9 && hour < 12) {
          setGreeting('Good Day');
        } else if (hour >= 12 && hour < 15) {
          setGreeting('Good Afternoon');
        } else if (hour >= 15 && hour < 18) {
          setGreeting('Good Evening');
        } else if (hour >= 18 && hour < 21) {
          setGreeting('Good Night');
        } else {
          setGreeting('Good Evening');
        }
      }, []);


      const handleStartSession = async() => {
        if(!loading&&!user && (!form.name||!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))){
          if(!form.name && !form.email){
            setEmptyForm({name:true,email:true})
          }else if(!form.name){
            setEmptyForm({...emptyForm,name:true})
          }else if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            setEmptyForm({ ...emptyForm, email: true });
          }        
          return
        }
        if(!loading){
          setchatloading(true)
          try {
            const response =  await axios.post(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/start-session`,
              {
                userId: user? user?._id : null,
                type:'supportchat',
                ...form
              },
              {
                withCredentials: true
              }
            )
            if(response?.data?.sessionId){
              console.log(response.data.sessionId)
              setSessionActive(response?.data?.sessionId);
              setChatBoxOpen(true);
              if(response.status === 201 && socket){
                  socket.emit("newSessionCreated", response?.data?.sessionId);
                }
              return response?.data?.sessionId
            }
          } catch (error) {
            console.error('Error starting session:', error);
          }finally{
            setchatloading(false)
          }
        }
      }
    
    
      
      const sendMessage = async() => {
        // sessionActive || handleStartSession()
        // const getid = await handleStartSession();
        const messageData = {
          sessionId: sessionActive ,
          sender: 'user',
          message: newMessage.trim(),
          // timestamp: new Date().toISOString()
          isReadByUser : true
        };
        if (messageData.sessionId && messageData.message) {
          socket.emit("sendMessage", messageData);
          setNewMessage("");
          
        }
      };
    
    
      useEffect(() => {
        const fetchSessionStatus = async () => {
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/fetch-session`,
              {
                params: {
                  userid: user ? user._id : null
                },
                withCredentials: true
              }
            );
            if(response.data)
            {
              setSessionActive(response?.data.find((s)=> s.type === 'supportchat')?._id);
              setChatBoxOpen(response?.data.find((s)=> s.type === 'supportchat') ? true : false);
              setChatMessages(response?.data.find((s)=> s.type === 'supportchat')?.messages || []);
              // setSessionProduct(response?.data.find((s)=> s.type === 'booking')?.service);
            };
          } catch (error) {
            console.error('Error fetching session status:', error);
          }
        };
    
          fetchSessionStatus();
      }, [user]);


      useEffect(() => {
        const socketInstance = io(process.env.NEXT_PUBLIC_BASE_URL, {
          withCredentials: true, // Required for cross-origin cookies
        });
        setSocket(socketInstance);
    
        // Attach to the session room
        if (sessionActive) {
          console.log('sudip')
          socketInstance.emit("attachSession", sessionActive);
        }
    
        // Listen for incoming messages
        socketInstance.on("receiveMessage", (data) => {
          setChatMessages((prevMessages) => [...prevMessages, data]);
        });
        socketInstance.on("adminReadMessage", ( messageId ) => {
          setChatMessages((prevMessages) => {
            return prevMessages.map((message) => {
              if (message._id === messageId) {
                return { ...message, isReadByAdmin: true };
              }
              return message;
            });
          });
        });
    
        // Cleanup on unmount
        return () => {
          socketInstance.disconnect();
        };
      }, [sessionActive]);




  return (
    // <div className=''>
      <div className='right-8 fixed bottom-8 p-3 aspect-square bg-green-400 rounded-full  z-[9999999999999] flex items-center justify-center text-4xl cursor-pointer'>
            <div className='absolute bottom-[115%] right-0 text-base'>
            <div
            //   variants={slideInFromRight(0.6)}
            //   initial="hidden"
            //   animate="visible"
            //   exit="exit"
          className={` p-4 bg-white  border rounded-xl shadow overflow-hidden transition-all duration-500 ${boxOpen ? 'w-[340px] md:w-[400px] h-[calc(100vh-300px)] min-h-[450px]' : 'w-[0px] min-h-0 opacity-0 h-[0px]'}`}   >
            <div className='h-full w-full bg-[#] '>
              <div className={`h-14 gap-5 cursor-pointer pb-4 w-full ${sessionActive && 'border-b border-gray-300'} flex items-center justify-between`}>
                <span className='flex items-center gap-2 text-gray-700'>
                 { sessionActive &&<span className='bg-green-500 w-2 h-2 rounded-full'></span>}
                 <Headset /><span className='font-semibold'>Live Chat</span>
                {/* <div className='flex items-center gap-3'>
                <img src={sessionProduct?.image} alt='' className='h-[40px] rounded-md overflow-hidden border border-gray-300'/>
                <p className='text-gray-700 text-ellipsis pb- overflow-hidden text-wrap leading line-clamp-2 text-xs'>{sessionProduct?.Title}</p>
                </div> */}
                </span>
              </div>
              <div className={` h-[calc(100%-(2*3.5rem))] w-full overflow-y-auto ${sessionActive && 'border border-gray-300'} bg-[#F3F4F6]`}>
                {/* {true && <div className='h-full w-full flex items-center justify-center bg-white'><div className="loader"></div></div>} */}
                {!sessionActive ? <div className='h-full w-full flex flex-col items-center justify-center bg-white overflow-hidden'>
                  {
                    (!loading && !chatloading ) ? <>
                      <h1 className='text-gray-700 text-2xl w-full text-center'>Hello! {greeting}</h1>
                      {
                        !user ? <div className='w-full flex items-center justify-center flex-col gap-3 mt-4 px-2'>
                          {
                            (emptyForm?.name || emptyForm?.email) && <span className='text-red-500 text-sm'>Please enter your details correctly</span>}
                        <input type='text' placeholder='Full Name' className={`border py-2 px-3 rounded-md w-full ${emptyForm?.name && 'border-red-500' }`} value={form.name} onChange={(e) => {setEmptyForm({...emptyForm,name:false});setForm({...form, name: e.target.value})}}/>
                        <input type='text' placeholder='Email' className={`border py-2 px-3 rounded-md w-full ${emptyForm?.email && 'border-red-500' }`} value={form.email} onChange={(e) => {setEmptyForm({...emptyForm,email:false});setForm({...form, email: e.target.value})}}/>
                        <button className='bg-[#2ab6e4] text-white py-2 px-3 rounded-md w-full' onClick={handleStartSession}>Start Chat</button>
                      </div>:
                        <button className='bg-[#2ab6e4] text-white py-2 px-3 rounded-md w-full mt-4' onClick={handleStartSession}>Start Chat</button>
                      }
                    </> : <div className='h-full w-full flex items-center justify-center bg-white'><div className="loader"></div></div>
                  }
                  
                </div>:<div className='flex flex-col p-2 gap-2'>
                  {chatmessages.length > 0 && chatmessages.map((message, index) => (
                    <div className='flex justify-between items-end' key={index}>
                      {message.sender === 'admin' && <span className=' text-gray-500 text-[10px] flex flex-col '><span className='leading-none'>{new Date(message.timestamp).toLocaleString([], {
                      // weekday: 'short', 
                      year: 'numeric',  
                        month: 'short',    
                        day: 'numeric',    
                        
                      })} </span><span className='flex gap-1 items-end'>{new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })} </span></span>}
                    <span  className={`py-2 px-3  max-w-[80%]  whitespace-pre-line w-max text-wrap bg-white text-gray-700 ${message.sender ==='user' ? 'rounded-b-2xl rounded-tr-2xl':'rounded-b-2xl rounded-tl-2xl'} `}>
                    {message.message}
                    </span>
                    {message.sender === 'user' && <span className=' text-gray-500 text-[10px] flex flex-col'><span className='leading-none'>{new Date(message.timestamp).toLocaleString([], {
                      // weekday: 'short', 
                      year: 'numeric',  
                        month: 'short',    
                        day: 'numeric',    
                        
                      })} </span><span className='flex gap-1 items-end'>{new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })} <CheckCheck size={14} className={`${message.isReadByAdmin ? 'text-[#2ab6e4]' : ''}`}/></span></span>}
                    </div>
                  ))}
                </div>}
              </div>
             { sessionActive && <div className='h-14 bg- w-full border-x border-b border-gray-300  flex items-center'>
                <input
                  className='hidden'
                  type='file'
                  accept='image/*'
                  />
                <input
                className='w-full h-full text-black px-3 bg-inherit  outline-none' placeholder='Type' value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage();
                  }
                }}
                />
                <span className='h-full aspect-square bg-[#] text-[#436E6D] hover:opacity-80 active:opacity-50 flex items-center justify-center cursor-pointer' onClick={sendMessage}><SendHorizontal  /></span>
              </div>}
            </div>
          </div>
            </div>
            <MessagesSquare className='text-white' style={{width: '1em', height: '1em'}} onClick={()=> setChatBoxOpen(!boxOpen)}/>
      </div>
    // </div>
  )
}
