'use client'
import { Nunito } from 'next/font/google';

const inter = Nunito({
  subsets: ['latin'],
  weight: ['400', '700'],
});
import React,{useState,useEffect,useContext, } from 'react'
import { useRouter } from 'next/navigation'
import { Search, CheckCheck , SendHorizontal , X } from 'lucide-react'
import axios from 'axios'
import { MyContext } from '@/context/context'
import io from "socket.io-client";
import { AnimatePresence, motion } from "framer-motion";
const slideInFromRight = (duration = 0.6) => ({
  hidden: { opacity: 0, x: '100%' },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    x: '100%',
    transition: { duration, ease: 'easeIn' },
  },
});
export default function Page() {
    const [service,setservice] = useState()
    const getLocalISO = (date) => {
      const tzOffset = date.getTimezoneOffset() * 60000; 
      return new Date(date - tzOffset).toISOString().slice(0, 16);
    };
    const [dateTime, setDateTime] = useState(
      getLocalISO(new Date())
    );
  const router = useRouter();
  const [sessionActive, setSessionActive] = useState();
  const [chatBoxOpen, setChatBoxOpen] = useState(true);
  const [chatmessages, setChatMessages] = useState([]);
  const [sessionProduct, setSessionProduct] = useState();
  const [socket, setSocket] = useState(null); 
  const [newMessage, setNewMessage] = useState('');
  const [bookon,setbookon] = useState(false)
  const [platform, setplatform] = useState('')
  const [cancelhover,setcancelhover] = useState()
  const { user, setUser } = useContext(MyContext);



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

  const booknow = async()=>{
    const isValidDateTime = (dateString) => {
      const date = new Date(dateString);
      return dateString && !isNaN(date.getTime());
    };
    if (!isValidDateTime(dateTime)) {
      console.error("Invalid date-time string");
      alert("Please select a valid date and time before booking.");
      return;
    }
    const utcDateTime = new Date(dateTime).toISOString();
    try{
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/book`,{
        serviceId:sessionProduct._id, 
        userId: user._id, 
        time:utcDateTime
      })
      if(response.data){
        setUser((prev)=> ({...prev , booking:[...prev.booking, {service:sessionProduct._id, time:new Date(utcDateTime)}]}))
        let getid 
        if(!sessionActive) { getid = await handleStartSession(sessionProduct._id);}
        const messageData = {
          sessionId: sessionActive || getid,
          sender: 'user',
          message: `Hey I've booked a${sessionActive ? 'nother' : ''} meeting.\nPrefered platform: ${platform}`,
          // timestamp: new Date().toISOString()
          isReadByUser : true
        };
        if (messageData.sessionId && messageData.message) {
          socket.emit("sendMessage", messageData);
          setNewMessage("");
        }
        setbookon(false)
      }
    }catch(e){

    }
    finally
    {
      setSessionProduct();
    }
  }
  
  const cancelbooking = async(id)=>{
    try{
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/cancelbook`,{
        serviceId:id, 
        userId: user._id,
      })
      if(response.data){
        setUser((prev)=> ({...prev , booking:prev.booking.filter((s)=> s.service !== id)}))
        if(user?.booking.filter((s)=> s.service !== id).length === 0){
          handleDelete()
        }
      }
    }catch(e){

    }
  }
  

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_BASE_URL, {
      withCredentials: true, // Required for cross-origin cookies
    });
    setSocket(socketInstance);

    // Attach to the session room
    if (sessionActive) {
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



  const handleDelete = async () => {
      try {
          const response = await axios.post('/api/chat/delete', {
              sessionId: sessionActive
          })
          if(response.status === 200){
            setChatMessages([]);
            setSessionActive();
            // setChatBoxOpen(false);
          }
      } catch (error) {
          
      }
  }


    useEffect(()=>{
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/service/getservice');
                // console.log(response.data);
                setservice(response?.data?.services);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    },[])

    const minDateTime = new Date().toISOString().slice(0, 16); 

  // Calculate the max date (6 months from today)
  const maxDateTime = new Date(
    new Date().setMonth(new Date().getMonth() + 6)
  )
    .toISOString()
    .slice(0, 16);

    const handleDateTimeChange = (event) => {
      const selectedDateTime = event.target.value;
      const month = new Date(selectedDateTime).getMonth(); 
      if ( selectedDateTime !== '') {
        setDateTime(selectedDateTime);
        console.log("Selected Date and Time:", selectedDateTime);
      } 
    };
    


  return (
    <div className='min-h-screen w-full'>
        <div className='w-full flex items-center justify-between relative mb-6'>
        <h2 className="text-xl font-semibold text-center text-gray-700">Book Consultaion</h2>
            <input type="text" placeholder='Search' className='border rounded-md px-3 py-2 outline-none outline-offset-0 focus:outline-[#446E6D] text-sm text-[#446E6D]'/>
            <Search className='absolute right-2 cursor-pointer active:opacity-50 text-[#446E6D]' style={{width: '1em', height: '1em'}}/>
        </div>


        <div className='w-full flex gap-6'>
        <AnimatePresence>
        <motion.div className='w-full bg-white p-6 shadow border'>
          
        {service?.length > 0 ? (
    <table className="table-auto w-full border-collapse ">
      <thead className={`${inter.className} text-sm text-gray-500`}>
        <tr className="border-b border-gray-200">
          <th className="px-4 py-2 text-left font-semibold">Service</th>
          {user?.booking.length>0 ?<th className="px-4 py-2 text-left font-semibold">Date</th>:<td></td>}
          {user?.booking.length>0 ? <th className="px-4 py-2 text-left font-semibold">Time</th>:<td></td>}
          <th className="pl-7 py-2 text-left font-semibold">Action</th>
        </tr>
      </thead>
      <tbody>
        {service?.map((item, index) => {
          const session = user?.booking?.find(
            (session) => session?.service === item?._id
          );
          const startedAt = session?.time
            ? new Date(session?.time)
            : null;

          return (
            <tr
              key={index}
              className={`cursor-pointer ${
                sessionProduct?._id === item?._id ? 'bg-gray-100' : ''
              }`}
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
                  <button className={`${cancelhover === item?._id? 'text-red-500' : 'text-green-500'} font-semibold text-sm py-1 px-3 rounded transition-colors duration-200 ease-in-out`}
                    onMouseEnter={()=>setcancelhover(item?._id)}
                    onMouseLeave={()=>setcancelhover()}
                    onClick={()=>cancelbooking(item?._id)}
                  >
                    {cancelhover === item?._id? 'Cancel' : 'Booked'}
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
  ) : (
    <div className="h-[80vh] flex items-center justify-center">
      <p className="text-gray-500">No Service Found</p>
    </div>
  )}
        </motion.div></AnimatePresence>









        { true &&
        // <div className=" right-10 z-20 bottom-10">
        <div className=''>
          { bookon && <AnimatePresence>
            <motion.div
              variants={slideInFromRight(0.6)}
              initial="hidden"
              animate="visible"
              exit="exit"
              className='w-[340px] md:w-[450px] h-[550px] flex flex-col gap-6'  >
              <div className='p-6 bg-white  border rounded shadow'>
                <h2 className={`${inter.className} text-sm text-gray-500 font-semibold text-center text-[#] border-b pb-3`}>Pick Your Time</h2>
                <input
                  type="datetime-local"
                  id="datetime"
                  value={dateTime}
                  onChange={handleDateTimeChange}
                  min={minDateTime}
                  max={maxDateTime}
                  className="outline-none text-sm px-4 py-2 w-full pt-4 focus:outline-none shadow-sm bg-white"
                />
              </div>
              <div className='p-6 bg-white h-full border rounded shadow'>
                <h2 className={`${inter.className} text-md font-semibold text-center text-sm text-gray-500 border-b pb-3 `}>Prefered Platform</h2>
                <div className='grid grid-rows-3 gap-2 pt-5'>
                <div className={` flex  items-center justify-center gap-5 ${platform === "Skype" && " border-gray-700"} border-2 rounded cursor-pointer text-xl`}
                  onClick={()=>setplatform('Skype')}
                >
                  <img src='https://media.hswstatic.com/eyJidWNrZXQiOiJjb250ZW50Lmhzd3N0YXRpYy5jb20iLCJrZXkiOiJnaWZcL2hvdy10by11c2Utc2t5cGUtMS5qcGciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjI5MH19fQ==' className=' h-[50px]'/>
                  {/* <span>
                    Skype
                  </span> */}
                </div>
                <div className={` flex px-5  items-center justify-center ${platform === "Google Meet" && " border-gray-700"} border-2 rounded cursor-pointer text-xl`}
                  onClick={()=>setplatform('Google Meet')}
                >
                  <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Google_Meet_text_logo_%282020%29.svg/2560px-Google_Meet_text_logo_%282020%29.svg.png' className=' h-[30px]'/>
                </div>
                <div className={` flex px-5 max-h-[70px] overflow-hidden items-center justify-center ${platform === "Microsoft Team" && "  border-gray-700"} rounded border-2 cursor-pointer text-xl`}
                  onClick={()=>setplatform('Microsoft Team')}
                >
                  <img src='https://varvid.com/wp-content/uploads/2021/03/teamsLogo.png' className=' h-[70px]'/>
                </div>

                <div className='flex gap-5 items-center w-full justify-center text-white'>
                <button className='bg-[#446E6D] mt-8 font-semibold text-sm shadow py-1 px-3 rounded'
                  onClick={()=>booknow()}
                  >
                  Book
                </button>
                  </div>
                </div>
              </div>
            </motion.div>
            </AnimatePresence>
          }
          {sessionActive && !bookon && 
          
          <AnimatePresence>
            <motion.div
              variants={slideInFromRight(0.6)}
              initial="hidden"
              animate="visible"
              exit="exit"
          className='w-[340px] md:w-[450px] h-[550px] p-4 bg-white  border rounded shadow'  >
            <div className='h-full w-full bg-[#] '>
              <div className='h-14 gap-5 pb-4 w-full border-b border-gray-300 flex items-center justify-between'>
                <span className='flex items-center gap-5 text-white'>
                 <span className='bg-green-500 w-2 h-2 rounded-full'></span>
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
                      {message.sender === 'admin' && <span className=' text-gray-700 text-sm'> 2:30 am </span>}
                    <span  className={`py-2 px-3 whitespace-pre-line w-max text-wrap bg-white text-gray-700 ${message.sender ==='user' ? 'rounded-b-2xl rounded-tr-2xl':'rounded-b-2xl rounded-tl-2xl'}  w-4/5 `}>
                    {message.message}
                    </span>
                    {message.sender === 'user' && <span className=' text-gray-700 text-xs flex flex-col'><span>{new Date(message.timestamp).toLocaleString([], {
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
          </motion.div></AnimatePresence>}
        </div>
        }
      </div>
    </div>
  )
}
