'use client'
import React,{useEffect, useState, useContext} from 'react'
import {MessagesSquare, Headset,SendHorizontal } from 'lucide-react'
import { MyContext } from '@/context/context';

export default function Page() {
    const [chatmessages, setChatMessages] = useState([]);
      const [sessionProduct, setSessionProduct] = useState();
      const [socket, setSocket] = useState(null); 
      const [newMessage, setNewMessage] = useState('');
      const {user} = useContext(MyContext);


      const handleStartSession = async(id) => {
        if(user){
          try {
            const response =  await axios.post(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/start-session`,
              {
                userId: user?._id || null,
                serviceId: id,
                type:'booking'
              },
              {
                withCredentials: true
              }
            )
            if(response?.data?.sessionId){
              setSessionActive(response?.data?.sessionId);
              setChatBoxOpen(true);
              if(response.status === 201 && socket){
                  socket.emit("newSessionCreated", response?.data?.sessionId);
                }
              return response?.data?.sessionId
            }
          } catch (error) {
            console.error('Error starting session:', error);
          }
        }
      }
    
    
      
      const sendMessage = async() => {
        // sessionActive || handleStartSession()
        // const getid = await handleStartSession();
        const messageData = {
          sessionId: sessionActive || getid,
          sender: 'user',
          message: newMessage.trim(),
          // timestamp: new Date().toISOString()
          isReadByUser : true
        };
        if (messageData.sessionId && messageData.message) {
          // Emit the message to the server
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
                  userid: user?._id || null
                },
                withCredentials: true
              }
            );
            if(response.data)
            {
              console.log(response?.data)
              setSessionActive(response?.data.find((s)=> s.type === 'booking')?._id);
              setChatBoxOpen(true);
              setChatMessages(response?.data.find((s)=> s.type === 'booking')?.messages || []);
              // setSessionProduct(response?.data.find((s)=> s.type === 'booking')?.service);
            };
          } catch (error) {
            console.error('Error fetching session status:', error);
          }
        };
    
        if(user){
          fetchSessionStatus();
        }
      }, [user]);
  return (
    // <div className=''>
      <div className='right-8 fixed bottom-8 p-3 aspect-square bg-green-400 rounded-full  z-[9999999999999] flex items-center justify-center text-4xl'>
            <div className='absolute bottom-[115%] right-0 text-base'>
            <div
            //   variants={slideInFromRight(0.6)}
            //   initial="hidden"
            //   animate="visible"
            //   exit="exit"
          className='w-[340px] md:w-[400px] h-[calc(100vh-300px)] p-4 bg-white  border rounded-xl shadow overflow-hidden'  >
            <div className='h-full w-full bg-[#] '>
              <div className='h-14 gap-5 pb-4 w-full border-b border-gray-300 flex items-center justify-between'>
                <span className='flex items-center gap-2 text-gray-700'>
                 <span className='bg-green-500 w-2 h-2 rounded-full'></span>
                 <Headset /><span className='font-semibold'>Live Chat</span>
                {/* <div className='flex items-center gap-3'>
                <img src={sessionProduct?.image} alt='' className='h-[40px] rounded-md overflow-hidden border border-gray-300'/>
                <p className='text-gray-700 text-ellipsis pb- overflow-hidden text-wrap leading line-clamp-2 text-xs'>{sessionProduct?.Title}</p>
                </div> */}
                </span>
              </div>
              <div className='h-[calc(100%-(2*3.5rem))] w-full overflow-y-auto border border-gray-300 bg-[#F3F4F6]'>
                <div className='flex flex-col p-4 gap-2'>
                  {chatmessages.length > 0 && chatmessages.map((message, index) => (
                    <div className='flex justify-between items-end' key={index}>
                      {message.sender === 'admin' && <span className=' text-gray-500 text-[10px] flex flex-col'><span>{new Date(message.timestamp).toLocaleString([], {
                      // weekday: 'short', 
                      year: 'numeric',  
                        month: 'short',    
                        day: 'numeric',    
                        
                      })} </span><span className='flex gap-1 items-end'>{new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })} </span></span>}
                    <span  className={`py-2 px-3 whitespace-pre-line w-max text-wrap bg-white text-gray-700 ${message.sender ==='user' ? 'rounded-b-2xl rounded-tr-2xl':'rounded-b-2xl rounded-tl-2xl'}  w-4/5 `}>
                    {message.message}
                    </span>
                    {message.sender === 'user' && <span className=' text-gray-500 text-[10px] flex flex-col'><span>{new Date(message.timestamp).toLocaleString([], {
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
                </div>
              </div>
              <div className='h-14 bg- w-full border-x border-b border-gray-300  flex items-center'>
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
              </div>
            </div>
          </div>
            </div>
            <MessagesSquare className='text-white' style={{width: '1em', height: '1em'}}/>
      </div>
    // </div>
  )
}
