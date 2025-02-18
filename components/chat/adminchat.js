'use client'
import React, { useState, useEffect,useRef, useContext } from 'react';
import {  AlertCircle, SendHorizontal,Image,User, User2,CircleX,Eye,Bookmark,X  } from 'lucide-react';
// import { data } from 'react-router-dom';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { MyContext } from '@/context/context';
import io from "socket.io-client";

const SupportChatting = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionActive, setSessionActive] = useState();
  const [chatmessages, setChatMessages] = useState([]);
  const [socket, setSocket] = useState(null); 
  const [newMessage, setNewMessage] = useState('');
  const [Sessions, setSessions] = useState([]);
  const endOfMessagesRef = useRef(null); 
  const endOfPageRef = useRef(null); 
  const [producStickOnTop, setProductStickOnTop] = useState(true);
  const [SearchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const {user} = useContext(MyContext);



  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
  };

  useEffect(() => {
    scrollToBottom();
    // window.scrollTo({
    //     top: document.body.scrollHeight,
    //     behavior: 'smooth',
    //   });
    
  }, [chatmessages]); 

  useEffect(() => {
    // if (endOfPageRef.current) {
    //     endOfPageRef.current.scrollIntoView({
    //       behavior: 'smooth',
    //       block: 'end',
    //     });
    //   } else {
        // Fallback: Use window.scrollTo
      setTimeout(() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
          });
      }, 1500);
    //   }
  }, []); 





  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/chat/all-sessions`, {
          params: { email: user?.email }
        });
        if(response.data){
            console.log(response.data[0])
            setSessions(response.data);
            setSessionActive(response.data[0]?._id);
            setChatMessages(response?.data?.find(session => session._id === response.data[0]?._id)?.messages || [])
            try {
                await axios.get(`/api/chat/seen`, {
                    params: {
                      sessionId: response.data[0]?._id
                    },
                    withCredentials: true
                  })
            } catch (error) {
                
            }
            
        }
        setLoading(false);
      } catch (error) {
        // setError(error);
        setLoading(false);
      }
    }
    if(user){
      fetchData();
    }
  }, [user]);
  



 const SelectACtiveSession = async(sessionId) => {
    setSessionActive(sessionId);
      setChatMessages(Sessions?.find(session => session._id === sessionId)?.messages || [])
      setSessions((prevSessions) =>
        prevSessions.map((session) =>
          session._id === sessionId
            ? {
                ...session,
                messages: session.messages.map((message) => ({
                  ...message,
                  isReadByAdmin: true
                })),
              }
            : session
        )
      );
      Sessions?.find(session => session._id === sessionId)?.messages?.forEach((message) => {
        if (message.isReadByAdmin) return;
        socket.emit("adminReadsMessage", sessionId, message._id);
    });
    try {
        await axios.get(`/api/chat/seen`, {
          params: {
            sessionId: sessionId
          },
          withCredentials: true
        })
    } catch (error) {
        
    }

  }


  useEffect(() => {
    let socketInstance
    if(Sessions?.length>0 && sessionActive){
      socketInstance = io(process.env.NEXT_PUBLIC_BASE_URL, {
      withCredentials: true,
    });
    setSocket(socketInstance);
  
    // Attach to all session rooms
    Sessions.forEach((session) => {
      socketInstance.emit("attachSession", session._id);
    });
  
    socketInstance.on("receiveMessage", (data) => {
      // Update chat messages only for the active session
      if (sessionActive === data.sessionId) {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { ...data, isReadByAdmin: true },
        ]);
        socketInstance.emit("adminReadsMessage", data.sessionId, data._id);
      }
  
      // Update sessions with the new message
      setSessions((prevSessions) =>
        prevSessions.map((session) =>
          session._id === data.sessionId
            ? {
                ...session,
                messages: [
                  ...session.messages,
                  {
                    ...data,
                    isReadByAdmin: sessionActive === data.sessionId,
                  },
                ],
              }
            : session
        )
      );
    });

  socketInstance.on("userReadMessage", ({ sessionId, messageId }) => {
    setSessions((prevSessions) =>
      prevSessions.map((session) =>
        session._id === sessionId
          ? {
              ...session,
              messages: session.messages.map((message) =>
                message._id === messageId
                  ? { ...message, isReadByUser: true }
                  : message
              ),
            }
          : session
      )
    );
    setChatMessages((prevMessages) => [
          ...prevMessages,
          { ...data, isReadByUser: true },
        ]);
      

  });

  socketInstance.on("new-session-started", async(session) => {
    try {
        setSessions((prevSessions) => [...prevSessions, session]);
    } catch (error) {
        
    }
  });
}
  
    // Cleanup on unmount
    return () => {
      if(socketInstance){
        socketInstance.disconnect();
      }
    };
  }, [Sessions, sessionActive]);
  


  const sendMessage = async() => {
    const messageData = {
      sessionId: sessionActive ,
      sender: 'admin',
      message: newMessage.trim(),
      isReadByAdmin : true
    };
    
    if (messageData.sessionId && messageData.message) {
      socket.emit("sendMessage", messageData);
      setNewMessage("");
    }
  };



const handleDelete = async () => {
    try {
        const response = await axios.post('/api/chat/delete', {
            sessionId: sessionActive
        })
        if(response.status === 200){
            setSessions((prevSessions) => prevSessions.filter((session) => session._id !== sessionActive))
            const newsession = Sessions.filter((session) => session._id !== sessionActive)[0]
            SelectACtiveSession(newsession?._id)
        }
    } catch (error) {
        
    }
}

// const setSearchTerm = (term) => {
    // const value = term.trim();
//     if(value === '' || (!isNaN(value) && parseFloat(value) >= 0)){
//         setChatMessages(Sessions.find(session => session._id === sessionActive)?.messages || [])
// }


  if (loading || error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-2 border-dashed rounded-full animate-spin border-gray-400"></div>
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto">
      {false && (
        <div className="p-4 mb-4 text-red-500 bg-red-100 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{'error'}</span>
          </div>
        </div>
      )}

        <div className='w-full h-full max-h-[calc(100vh-20px)] overflow-hidden p-4 bg-white border  rounded-lg shadow  flex relative'>
       
            <div className='absolute min-h-screen border-l border-gray-300 top-0 left-[23%]'></div>
            <div className='h-full w-[30%] pr-3 '>
            <div className='h-14 gap-5 pb-4 w-full border-b border-gray-300 flex items-center'>
                <input
                className='border outline-none border-gray-300 text-gray-700 py-2 px-4 mr-4 rounded-lg w-full'
                placeholder='Search by name'
                 onChange={(e) => setSearchTerm(e.target.value)}
                 onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      sendMessage();
                    }
                  }}
                />
            </div>
             <div className='w-full h-full pr-3 '>
            <div className='w-full h-[calc(100vh-90px)] bg-[#] overflow-y-auto flex-col 
             py-2 '> 
                {Sessions?.length > 0 ? Sessions.filter((session) => session?.user?.profile?.name?.toLowerCase().includes(SearchTerm.toLowerCase()) || session?.uid?.name?.toLowerCase().includes(SearchTerm.toLowerCase())).map((session, index) => (
                    <div className={`mx-1 flex justify-between items-end mb-2 cursor-pointer rounded-lg bg-white border ${session?._id !== sessionActive ? '':'border bg-gray-200'}`} key={index}
                    onClick={() => SelectACtiveSession(session?._id)}
                    >    
                    <span className='py-2 px-3 text-wrap bg-[#] text-black rounded-lg w-full flex items-center gap-2 relative'>
                       {session?.user?.profile?.avatarUrl === 'https://default-avatar-url.com' ? <User/> :session?.user?.profile?.avatarUrl?<img style={{width:'2em', height:'2em'}} className='border-2 border-gray-500 rounded-full' src={session?.user?.profile?.avatarUrl}/>: <User/>} 
                       <span className='grid'>
                       {session?.user?.profile?.name ? session?.user?.profile?.name : session?.uid?.name}
                       <span className='text-xs'>
                       {
                         !session?.user?.profile?.name && session?.uid?.email
                        }
                        </span>
                        </span>
                       {session?.messages?.filter((message)=>!message?.isReadByAdmin).length > 0 && <span className='bg-red-500 text-red-100 rounded-full text-xs  aspect-square px-1'>{session?.messages?.filter((message)=>!message?.isReadByAdmin).length}</span>}
                       {session?.type==='booking' && <span className=' rounded-full text-base text-green-700 absolute top-0 right-0' >
                        <Bookmark  style={{height:'1em' , width:'1em'}}/>
                    </span>}
                    {
                      session.type === 'supportchat' && <span className='px-2 pt-1 text-xs text-gray-600 absolute top-0 right-0' >
                        Guest
                      </span>
                    }
                    </span>
                    </div>
                )):<span className='text-gray-700 w-full text-center flex justify-center'>No messages</span>}
                </div>
            </div>
            </div>
        <div className='h-full w-full flex flex-col '>
            <div className='h-14 gap-5 pb-4 w-full  flex items-center justify-between'>
            {/* <span className='aspect-square'>
            <Crown className='text-gray-700'/>
            </span> */}
            <div className='flex items-center  text-gray-700 gap-3'>
            <span className='flex gap-3 items-center min-w-max px-2 text-gray-700'>
                    {Sessions?.find((s)=> s._id === sessionActive)?.user?.profile?.avatarUrl === 'https://default-avatar-url.com' ? <User2 className='border-[3px] text-gray-700 border-gray-500 rounded-full' style={{width:'2em', height:'2em'}}/>: <img style={{width:'3em', height:'3em'}} className={`${Sessions?.find((s)=> s._id === sessionActive)?.user?.profile?.avatarUrl ? 'border-2 cursor-pointer border-gray-500 rounded-full':'text-nowrap'}`} src={Sessions?.find((s)=> s._id === sessionActive)?.user?.profile?.avatarUrl} alt='Not Available'/>}</span>
            {sessionActive && <div className='flex flex-col items-start gap-1'>
                <p className='text-gray-700 text-ellipsis overflow-hidden text-wrap leading line-clamp-2 text-base'> {Sessions?.find((session) => session?._id === sessionActive)?.user?.profile?.name ?? 'No name available'}</p>
                <p className='text-gray-700 text-ellipsis overflow-hidden text-wrap leading line-clamp-2 text-sm'> {Sessions?.find((session) => session?._id === sessionActive)?.user?.email ?? 'No email available'}</p>
            </div>}
            </div>
            
            <div className='flex gap-5'>
            {!producStickOnTop && <button className='text-green-500 h-max bg-green-500/10 p-2 rounded-full text-xs hover:text-gray-300' onClick={() => setProductStickOnTop(true)}>
                        <Eye size={16}/>
                    </button>}
                    {sessionActive && (
                  <span className={`pr-5 pt-1 ${Sessions?.find((session) => session?._id === sessionActive)?.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                    {Sessions?.find((session) => session?._id === sessionActive)?.status}
                  </span>
                )}

            {sessionActive && <button className='text-red-500 bg-red-500/10 py-2 px-4 rounded-lg text-xs hover:text-gray-300' onClick={() => handleDelete(sessionActive)}>
                delete
            </button>}
            </div>
            </div>
            <div className='h-[calc(92vh-112px)] w-full overflow-y-auto border border-gray-300'>
            <div className='flex flex-col p-4 gap-2 relative'>
                {sessionActive && Sessions?.find((s)=> s._id === sessionActive )?.user?.booking?.length>0 && <div title='Query Product' className={`w-full flex gap-5 border-b border-gray-300  mb-3 ${producStickOnTop && 'sticky top-0 bg-white '}`}>
                <table className="table-auto w-full border-collapse text-sm">
                    <tbody>
                      {Sessions?.find((s)=> s._id === sessionActive )?.user?.booking?.map((service, index) => {
                        const item = service?.serviceDetails;
                        const session = true
                        const startedAt = service?.time
                          ? new Date(service?.time)
                          : null;

                        return (
                          <tr
                            key={index}
                            className={`cursor-pointer`}
                          >
                            <td className="px-4 py-2 flex items-center gap-5">
                              <img
                                src={item?.image}
                                alt=""
                                className="h-10 object-cover"
                              />
                              <p className="font-semibold">{item?.Title}</p>
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {startedAt &&
                                startedAt.toLocaleDateString([], {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {startedAt &&
                                startedAt.toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true,
                                })}
                            </td>
                            <td className="px-4 py-2">
                              {session ? (
                                <button className={`${false === item?._id? 'text-red-500' : 'text-green-500'} font-semibold text-sm py-1 px-3 rounded transition-colors duration-200 ease-in-out`}
                                >
                                  {'Booked'}
                                </button>
                              ) : (
                                <button
                                  className={` ${sessionProduct?._id === item?._id ? 'text-red-500' : 'text-[#446E6D]'}  font-semibold text-sm hover:opacity-80 active:opacity-50 py-2 px-3 rounded-md`}
                                  onClick={() => {
                                    if(sessionProduct?._id === item?._id ){
                                      setbookon()
                                      setSessionProduct()
                                    }else{
                                      setbookon(true)
                                      setSessionProduct(item);
                                    }
                                  }}
                                >
                                  {sessionProduct?._id === item?._id ? <span className=''><X style={{height:'1em', width:'1em'}}/></span>  : 'Book Now'}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {producStickOnTop && <button className='text-red-500 h-max bg-red-500/10 p-2 rounded-full text-xs hover:text-gray-300' onClick={() => setProductStickOnTop(false)}>
                        <CircleX size={16}/>
                    </button>}
                </div>}
                {chatmessages?.length > 0 &&
                chatmessages.map((message, index) => (
                    <div className='w-full flex justify-between items-end' key={index}>
                    {message?.sender === 'user' && (<span className='text-gray-700 text-xs flex flex-col'>
                        <span>
                            {new Date(message?.timestamp ?? Date.now()).toLocaleString([], {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            })}
                        </span>
                        {new Date(message?.timestamp ?? Date.now()).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                        })}
                        </span>
                    )}
                     <div useRef={endOfPageRef} className='hidden'/>
                    <span className='py-2 px-3 text-wrap bg-[#D4DDDD] text-black rounded-lg w-4/5'>
                        {message?.message ?? 'No message content'}
                    </span>
                    {message?.sender === 'admin' && (
                        <span className='text-gray-700 text-xs flex flex-col'>
                        <span>
                            {new Date(message?.timestamp ?? Date.now()).toLocaleString([], {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            })}
                        </span>
                        {new Date(message?.timestamp ?? Date.now()).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                        })}
                        </span>
                    )}
                    </div>
                ))}
                <div ref={endOfMessagesRef} />
            </div>
            </div>
            <div className='min-h-14 bg- w-full border border-gray-300 rounded-b-lg flex items-center'>
            <input
                className='hidden'
                type='file'
                accept='image/*'
            />
            <span className='h-full aspect-square text-[#2ab6e4] hover:text-[#a017c9] transition-colors  items-center justify-center cursor-pointer hidden'>
                <Image />
                
            </span>
            <input
                className='w-full h-full  text-gray-700 px-3 bg-inherit border-l  outline-none border-gray-300'
                placeholder='Type'
                value={newMessage ?? ''}
                onChange={(e) => setNewMessage(e.target.value)}
            />
            <span
                className='h-full aspect-square px-4 text-[#446E6D] flex items-center justify-center cursor-pointer'
                onClick={sendMessage}
            >
                <SendHorizontal />
            </span>
            </div>
            
        </div>
        </div>
        
       
    
    </div>
  );
};

export default SupportChatting;