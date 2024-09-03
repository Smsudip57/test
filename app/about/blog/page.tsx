"use client"
import React,{useState} from 'react'
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import NewspaperIcon from '@mui/icons-material/Newspaper';

export default function page() {
  const blogData = [
    { 
      type:'Sports News',
      image:"/digital-trn1691529817.webp",
      title:"Navigating the Digital Frontier: Embracing the Power of the Digital Transformation",
      description:"The digital era has redefined the way we interact, communicate, and conduct business. From the way we shop to the way we work, digital technology has woven itself into the fabric of our lives. In this blog, we'll delve into the vast landscape of the digital realm, exploring its impact, opportunities, and the imperative for individuals and businesses to embrace the journey of digital transformation.",
      points:[
        {
          title:"1. The Digital Revolution Unveiled",
          Explaination:"The digital transformation represents a seismic shift in how we approach everything – from traditional business models to personal interactions. It encompasses the adoption of digital technologies to streamline processes, enhance efficiency, and create new avenues for growth. This transformation is not merely about technology; it's a mindset that places innovation and adaptation at the core of our endeavors."
        },
        {
          title:"2. Transforming Business Operations",
          Explaination:"For businesses, the digital transformation is a catalyst for evolution. It revolutionizes processes, enabling automation, data analysis, and real-time insights. From supply chain management to customer service, digital technologies optimize operations, leading to enhanced productivity and more agile decision-making."
        },
        {
          title:"4. Breaking Down Geographical Barriers",
          Explaination:"One of the most remarkable aspects of the digital transformation is its ability to transcend geographical boundaries. With just a few clicks, businesses can reach a global audience, and remote teams can collaborate seamlessly. This globalization expands markets, fosters diversity, and stimulates innovation by bringing together minds from different corners of the world."
        },
        {
          title:"5. Accelerating Innovation",
          Explaination:"Digital technologies are the engine of innovation. The availability of Big Data, Artificial Intelligence (AI), and Internet of Things (IoT) devices offers unprecedented opportunities for creativity. Businesses can analyze trends, predict consumer behaviors, and develop products or services that cater to emerging needs."
        },
        {
          title:"6. Enabling Flexibility and Agility",
          Explaination:"Adaptability is key in a rapidly changing landscape. Digital transformation equips businesses with the agility to pivot swiftly in response to market shifts. Remote work, cloud computing, and virtual collaboration tools ensure that businesses can thrive, even in uncertain times."
        },
        {
          title:"7. Enhancing Sustainability",
          Explaination:"The digital transformation contributes to a more sustainable future. It enables remote work, reducing the need for commuting and office spaces. Additionally, digital solutions promote paperless practices and more efficient resource utilization, minimizing environmental impact."
        },
        {
          title:"8. Challenges and Security",
          Explaination:"While the digital transformation offers immense benefits, it also comes with challenges. Cybersecurity becomes paramount, as businesses handle sensitive data. Striking a balance between innovation and security requires careful planning and robust measures to safeguard information."
        },
        {
          title:"Conclusion",
          Explaination:"The digital transformation is more than a trend; it's a journey that shapes the present and the future. From enhancing business processes to revolutionizing customer experiences, digital technology is the driving force behind this evolution. As individuals and organizations navigate the digital frontier, they must embrace change, foster innovation, and leverage the power of technology to achieve growth, efficiency, and a more connected world."
        },
        {
          title:"1. The Digital Revolution Unveiled",
          Explaination:"The digital transformation represents a seismic shift in how we approach everything – from traditional business models to personal interactions. It encompasses the adoption of digital technologies to streamline processes, enhance efficiency, and create new avenues for growth. This transformation is not merely about technology; it's a mindset that places innovation and adaptation at the core of our endeavors."
        },
      ]
    },
    {
      type:"Entertainment",
      image:"/branding-webme1689186925.webp",
      title:"The Power of Branding: A Necessity for Small Businesses",
      description:"In today's competitive business landscape, where attention spans are fleeting and choices are abundant, small businesses find themselves facing a critical challenge: how to stand out and make a lasting impression. The answer lies in the art and science of branding. In this blog, we will explore why branding is an absolute necessity for small businesses and how it can pave the way for success in a crowded market.",
      points:[
        {
          title:"1. Defining Your Identity",
          Explaination:"Branding goes beyond just having a catchy logo or a memorable tagline. It's about defining your business's unique identity, values, and personality. For small businesses, branding provides the opportunity to establish who you are and what you stand for. It shapes the perceptions that customers, partners, and stakeholders have about your business. A strong brand identity not only attracts attention but also builds trust and credibility."
        },
        {
          title:"2. Creating Recognition and Recall",
          Explaination:"Consider iconic brands like Apple, Nike, or Coca-Cola. Their logos alone trigger immediate recognition and associations. Effective branding creates a similar sense of recognition and recall for small businesses, albeit on a smaller scale. A consistent visual identity and messaging across all touchpoints – from your website and social media to packaging and marketing materials – helps engrain your business in the minds of your audience."
        },
        {
          title:"3. Setting You Apart from Competitors",
          Explaination:"In a market saturated with choices, differentiation is key. Effective branding allows you to stand out from your competitors. It highlights your unique value proposition, helping potential customers understand why they should choose you over others. By focusing on what makes you distinct, you create a compelling reason for customers to connect with your brand on an emotional level."
        },
        {
          title:"Building Trust and Loyalty",
          Explaination:"Trust is the cornerstone of customer relationships. A well-crafted brand strategy can help build trust by consistently delivering on promises and expectations. When customers have a positive experience with your brand, they are more likely to become loyal advocates, referring your business to others and returning for repeat purchases. Trust and loyalty, once established, can lead to long-term success."
        },
        {
          title:"5. Commanding Premium Pricing",
          Explaination:"Branding can shift the conversation from price to value. A strong brand allows you to command premium pricing because customers associate your offerings with quality, reliability, and uniqueness. Customers are often willing to pay more for a product or service they trust and feel connected to."
        },
        {
          title:"6. Facilitating Expansion and Growth",
          Explaination:"As small businesses grow, they often consider expanding into new markets or introducing new products/services. A solid brand foundation makes this expansion smoother. Your existing customers, familiar with your brand's quality and values, are more likely to explore your new offerings. Moreover, a consistent brand presence in new markets helps establish credibility and accelerates market penetration."
        },
        {
          title:"Conclusion",
          Explaination:"Branding is not a luxury; it's a necessity for small businesses looking to make a mark in a competitive world. It's the avenue through which you communicate your story, values, and offerings to the world. An effective brand strategy can set you apart, foster trust, and create lasting customer relationships. Whether you're just starting or looking to elevate your business to the next level, investing in branding is an investment in your future success."
        }
      ]
    },
    {
      type:"Entertainment",
      image:"/work-from-anywhere-webme1689186925.webp",
      title:"Embracing Freedom: Exploring the Cutting-Edge Work from Anywhere Technologies",
      description:"The traditional concept of work has undergone a remarkable evolution in recent times. Thanks to rapid technological advancements, the ability to work from anywhere has transitioned from a dream to a reality. In this blog, we'll delve into the exciting world of \"Work from Anywhere\" technologies that empower individuals and businesses to break free from the confines of traditional offices and embrace a more flexible and dynamic work environment.",
      points:[
        {
          title:"1. Cloud Computing: Unleashing Flexibility",
          Explaination:"Cloud computing has revolutionized the way we work by providing a virtual space to store, access, and share data and applications. Services like Microsoft 365, Google Workspace, and Dropbox enable seamless collaboration, allowing teams to work on projects simultaneously from different locations. With cloud computing, work becomes device-independent, enabling access to essential tools and documents from anywhere with an internet connection."
        },
        {
          title:"2. Video Conferencing and Collaboration Tools",
          Explaination:"Video conferencing tools like Zoom, Microsoft Teams, and Slack have become the cornerstone of remote work. These platforms offer real-time communication, screen sharing, and video meetings, fostering effective collaboration regardless of physical distance. They make it possible to conduct meetings, brainstorming sessions, and presentations as if everyone were in the same room."
        },
        {
          title:"3. Virtual Private Networks (VPNs) for Security",
          Explaination:"Security is a top concern for remote work. VPNs provide a secure connection to company networks, encrypting data transmissions and safeguarding sensitive information. This technology ensures that remote workers can access corporate resources without compromising the integrity of data, which is especially crucial when working with confidential information."
        },
        {
          title:"4. Project Management and Productivity Tools",
          Explaination:"Tools like Trello, Asana, and Monday.com keep teams organized and projects on track, irrespective of their physical locations. These platforms facilitate task assignment, progress tracking, and collaboration, providing a centralized hub where team members can stay aligned on goals and timelines."
        },
        {
          title:"5. Augmented Reality (AR) and Virtual Reality (VR)",
          Explaination:"As technology advances, AR and VR are emerging as transformative tools for remote work. AR applications overlay digital information onto the real world, facilitating tasks like remote technical assistance and training. VR, on the other hand, offers immersive experiences, making it possible for remote teams to collaborate in virtual environments that mimic physical meetings and interactions."
        },
        {
          title:"6. Mobile Work Apps",
          Explaination:"Mobile apps optimized for work on smartphones and tablets empower professionals to stay productive while on the move. These apps range from email and document editing tools to project management and communication platforms. The ubiquity of mobile devices ensures that work can happen anywhere, at any time."
        },
        {
          title:"7. AI-powered Automation",
          Explaination:"Artificial Intelligence (AI) is streamlining repetitive tasks and enhancing efficiency. Automation tools like chatbots and process automation software can handle routine inquiries, data entry, and other time-consuming tasks, freeing up employees to focus on higher-value activities regardless of their physical location."
        },
        {
          title:"Conclusion",
          Explaination:"The rise of \"Work from Anywhere\" technologies has transformed the way we approach work, granting us unprecedented flexibility and connectivity. From cloud computing to virtual reality, these technologies have dismantled the barriers of physical distance and enabled individuals and businesses to thrive in a decentralized work environment. As technology continues to evolve, the boundaries of work will continue to expand, making the concept of \"anywhere\" truly limitless. Embrace these technologies, and you'll find that work is no longer a place you go, but something you do – wherever you are."
        },
      ]
    },
    {
      type:"Entertainment",
      image:"/whatsapp-image-2023-07-22-at-2153411690496384.webp",
      title:"Navigating the Digital Landscape: The Crucial Role of IT Support Services",
      description:"In the modern age of technology, businesses are increasingly reliant on digital systems and networks to drive their operations. With this dependence comes the need for robust and reliable IT support services. In this blog, we'll dive into the world of IT support, exploring its significance, benefits, and how it ensures the smooth functioning of businesses in the digital landscape.",
      points:[
        {
          title:"1. The Foundation of IT Support Services",
          Explaination:"IT support services form the backbone of an organization's technological infrastructure. These services encompass a wide range of tasks, from troubleshooting technical issues to maintaining hardware and software systems. They ensure that technology operates seamlessly, empowering employees to work efficiently and providing customers with a seamless experience."
        },
        {
          title:"2. Immediate Issue Resolution",
          Explaination:"In the fast-paced business environment, downtime is a luxury most companies can't afford. IT support services offer swift issue resolution, minimizing disruptions caused by technical glitches, system crashes, or network failures. Experienced IT professionals are equipped to diagnose problems, implement solutions, and restore operations promptly, ensuring that business processes remain undisrupted."
        },
        {
          title:"3. Proactive Problem Prevention",
          Explaination:"The best IT support services go beyond reactive solutions. They adopt a proactive approach by implementing monitoring systems that identify potential issues before they escalate. By detecting early warning signs, IT experts can address underlying problems, preventing them from snowballing into major disruptions that impact productivity and customer satisfaction."
        },
        {
          title:"4. Expert Guidance and Consultation",
          Explaination:"Navigating the ever-evolving technology landscape can be daunting. IT support services provide businesses with expert guidance on technology upgrades, system enhancements, and cybersecurity measures. These professionals stay abreast of industry trends, enabling them to recommend strategies that align with business goals and ensure long-term growth."
        },
        {
          title:"5. Data Security and Recovery",
          Explaination:"Data breaches and loss can have devastating consequences for businesses. IT support services play a critical role in safeguarding sensitive information through the implementation of robust cybersecurity measures. Additionally, they establish data backup and recovery protocols, ensuring that critical data can be restored in the event of a disaster."
        },
        {
          title:"6. Tailored Solutions for Businesses",
          Explaination:"Every business is unique, with distinct technology needs. IT support services offer customized solutions that cater to the specific requirements of each organization. Whether it's setting up a network infrastructure, migrating to cloud services, or integrating new software, IT professionals tailor their services to match the goals and processes of the business."
        },
        {
          title:"7. Cost-Efficiency and Resource Optimization",
          Explaination:"While some businesses consider hiring full-time IT staff, outsourcing IT support services can often be more cost-effective. Outsourcing eliminates the need to maintain an in-house IT team, saving costs associated with salaries, benefits, and training. Additionally, businesses can access a broader range of expertise without the overhead expenses."
        },
        {
          title:"Conclusion",
          Explaination:"In an era where technology drives business success, IT support services emerge as invaluable allies. From maintaining day-to-day operations to steering businesses through digital transformations, these services ensure that technology remains a strategic asset rather than a hindrance. With their ability to swiftly address issues, offer expert guidance, and safeguard crucial data, IT support professionals are the unsung heroes of the modern business landscape, contributing significantly to the growth and prosperity of organizations around the world."
        }
      ]
    },
    {
      type:"Sports News",
      image:"/11691527193.webp",
      title:"Empowering Success: Embracing Modern Workplace Solutions",
      description:"The workplace is undergoing a profound transformation, driven by technological advancements that are reshaping how we work, collaborate, and thrive. The era of the modern workplace is upon us, offering innovative solutions that enhance productivity, engagement, and flexibility. In this blog, we'll explore the dynamic world of modern workplace solutions, uncovering the benefits they bring to businesses and employees alike.",
      points:[
        {
          title:"1. Defining the Modern Workplace",
          Explaination:"The modern workplace is more than just a physical location; it's a concept that integrates cutting-edge technology, flexible work arrangements, and a focus on employee well-being. It acknowledges that work can happen anywhere, anytime, and empowers individuals to be productive regardless of their geographical location."
        },
        {
          title:"2. Seamless Collaboration and Communication",
          Explaination:"Modern workplace solutions break down communication barriers by providing tools that facilitate real-time collaboration. Platforms like Microsoft Teams, Slack, and Zoom enable employees to connect, share ideas, and collaborate on projects effortlessly, transcending the constraints of time zones and office walls."
        },
        {
          title:"3. Flexibility and Remote Work",
          Explaination:"The ability to work remotely has become a defining feature of the modern workplace. Cloud-based technologies and mobile apps enable employees to access critical files and applications from any location, fostering a work-life balance that caters to individual needs."
        },
        {
          title:"4. Enhanced Productivity",
          Explaination:"Modern workplace solutions are designed to optimize productivity. Task management tools, virtual assistants, and automation streamline workflows, reducing time spent on repetitive tasks and freeing up employees to focus on high-value work."
        },
        {
          title:"5. Data Security and Compliance",
          Explaination:"As data breaches become more prevalent, modern workplace solutions prioritize data security. Advanced encryption, multi-factor authentication, and secure cloud storage systems ensure that sensitive information is safeguarded, addressing compliance concerns and building trust among clients and stakeholders."
        },
        {
          title:"6. Embracing Diversity and Inclusion",
          Explaination:"The modern workplace is inclusive by design, accommodating diverse work styles, abilities, and preferences. Technology aids in creating accessible environments, making it easier for all employees to contribute their best work."
        },
        {
          title:"7. Personalized Employee Experiences",
          Explaination:"Modern workplace solutions personalize the employee experience. From tailored learning paths to personalized communication, these solutions recognize that a one-size-fits-all approach doesn't resonate with the diverse workforce of today."
        },
        {
          title:"8. Analytics and Insights",
          Explaination:"Data-driven decision-making is at the core of the modern workplace. Analytics tools provide insights into employee performance, collaboration patterns, and workflow bottlenecks, allowing organizations to refine processes and optimize resource allocation."
        },
        {
          title:"9. Future-Proofing Business Operations",
          Explaination:"By embracing modern workplace solutions, businesses position themselves for future success. These solutions are scalable and adaptable, accommodating the inevitable changes in technology and work practices, ensuring that the organization remains agile and resilient."
        },
        {
          title:"Conclusion",
          Explaination:"The modern workplace is a realm of boundless possibilities, where technology meets human potential to drive innovation, growth, and well-being. From fostering seamless collaboration and boosting productivity to enhancing security and promoting diversity, modern workplace solutions are catalysts for positive change. As businesses embrace these solutions, they pave the way for a more agile, connected, and empowered workforce that is poised to navigate the challenges and opportunities of the digital age."
        }
      ]
    },
    {
      type:"Sports News",
      image:"/expertise-webme1689186925.webp",
      title:"The Rise of Expert Freelancers: Unleashing the Power of Specialized Skills",
      description:"The gig economy is experiencing a profound shift, as a new breed of professionals emerges onto the scene – expert freelancers. These individuals possess specialized skills and knowledge that cater to niche industries, offering businesses an invaluable resource for tackling complex projects. In this blog, we'll delve into the world of expert freelancers, exploring their unique strengths, benefits, and how they are transforming the way work gets done.",
      points:[
        {
          title:"1. The Evolution of Freelancing",
          Explaination:"Freelancing has evolved beyond a side gig or temporary work arrangement. Expert freelancers are professionals who have honed their skills over years of experience and have become masters in their respective fields. They offer an alternative to traditional hiring, providing specialized expertise without the long-term commitment."
        },
        {
          title:"2. Specialized Skills for Niche Demands",
          Explaination:"In today's fast-paced and ever-changing business landscape, many projects require specialized skills that may not be readily available in-house. Expert freelancers fill this gap, offering expertise that aligns with the specific needs of a project, from graphic design and content creation to data analysis and software development."
        },
        {
          title:"3. Flexibility and Scalability",
          Explaination:"Hiring expert freelancers provides businesses with the flexibility to scale their workforce according to project demands. Instead of maintaining a large in-house team, businesses can tap into the talent pool of freelancers when required, optimizing resource allocation and reducing overhead costs."
        },
        {
          title:"4. Efficiency and Expertise",
          Explaination:"Expert freelancers are known for their efficiency. They bring deep knowledge and experience to the table, allowing them to hit the ground running on projects. This expertise translates to faster project turnaround times, higher-quality deliverables, and ultimately, greater client satisfaction."
        },
        {
          title:"5. Cost-Effectiveness",
          Explaination:"For businesses, hiring expert freelancers can be a cost-effective solution. Instead of investing in full-time employees who may not be needed once a project is completed, businesses can engage freelancers on a project-by-project basis, saving on salaries, benefits, and other overhead expenses."
        },
        {
          title:"6. Global Access to Talent",
          Explaination:"The digital age has erased geographical boundaries, enabling businesses to collaborate with talent from around the world. Expert freelancers can be located anywhere, allowing businesses to access the best minds in their field, regardless of their physical location."
        },
        {
          title:"7. Diverse Perspectives and Innovation",
          Explaination:"Engaging expert freelancers brings diverse perspectives into the mix. Their exposure to various industries and projects equips them with a unique outlook that can spark innovative solutions and fresh ideas, contributing to the growth and evolution of a business."
        },
        {
          title:"8. Building Collaborative Networks",
          Explaination:"Expert freelancers often work on a variety of projects for different clients. This exposure allows them to build a vast network of contacts, which can be beneficial for businesses seeking introductions to other professionals, potential clients, or strategic partners."
        },
        {
          title:"Conclusion",
          Explaination:"Expert freelancers are shaping the future of work, offering businesses the chance to tap into specialized skills, enhance efficiency, and drive innovation. In a world where the demand for expertise is constantly evolving, these professionals provide a flexible and dynamic solution that complements traditional employment models. As the gig economy continues to thrive, expert freelancers are at the forefront, demonstrating that expertise, collaboration, and agility are the keys to success in the modern work landscape."
        }
      ]
    },
  ]
  const [category ,setCategory] = useState('')
  const [single ,setSingle] = useState<any>(null)
  interface point {
    title: string;
    Explaination: string;
  }




  return (
    <div className='pt-16' id="read more">
      <div className='w-full grid justify-center'>
        <p className='w-max text-4xl py-16 text-center text-[#446E6D] cursor-pointer hover:text-[#37c0bd] transition-colors duration-700  z-20' onClick={()=>{setCategory('');setSingle(null)}}>
        Blog
      </p>
        </div>
        <div className='w-[1320px] mx-auto flex items-start z-20 gap-7'>
            <div className='basis-2/3 bg- h-full z-20'>
            {
              !single &&
              blogData.filter((item)=>{
                if(category){
                  return item.type === category
                }
                return item
              }).map((item,In)=>(
                <div key={In}>
                 <img src={item.image}></img>
                 <div className='w-full flex items-center gap-6 mt-8 mb-6'>
                 <span className='text-sm font-medium text-[#446E6D] flex items-center gap-1'><CalendarMonthIcon fontSize='inherit'/><span className='text-gray-500'>23 Mar 2022</span> </span>
                 <span className='text-sm font-medium text-[#446E6D] flex items-center gap-1'><PersonIcon fontSize='inherit'/><span className='text-gray-500'>WEBME</span></span>
                 <span className='text-sm font-medium text-[#446E6D] flex items-center gap-1'><NewspaperIcon fontSize='inherit'/><span className='text-gray-500'>{item.type}</span></span>
                 </div>
                 <span className='text-4xl font-bold' style={{lineHeight:'46px'}}>
                  {item.title}
                 </span>
                 <p className='mt-3 text-gray-500'>
                  {item.description }
                 </p>
                 <a href='/about/blog#read more'><button className='text-md py-3 px-8 bg-[#446E6D] text-white transition-color duration-700 hover:bg-[#37c0bd] rounded-full mt-8 mb-[60px]' onClick={()=>{setSingle(item);setCategory('')}}>Read More</button></a>
                </div>
              ))
            }
            {
              !single && category && blogData.filter((item)=>{
                if(category){
                  return item.type === category
                }
                return item
              }).length === 0 && <p className='w-full text-center text-xl text-white py-3 bg-[#446E6D] z-20'>No Post Found in {category} Category</p>
            }
            {
              single && <div >
              <img src={single.image}></img>
              <div className='w-full flex items-center gap-6 mt-8 mb-6'>
                  <span className='text-sm font-medium text-[#446E6D] flex items-center gap-1'><CalendarMonthIcon fontSize='inherit'/><span className='text-gray-500'>23 Mar 2022</span> </span>
                 <span className='text-sm font-medium text-[#446E6D] flex items-center gap-1'><PersonIcon fontSize='inherit'/><span className='text-gray-500'>WEBME</span></span>
                 <span className='text-sm font-medium text-[#446E6D] flex items-center gap-1'><NewspaperIcon fontSize='inherit'/><span className='text-gray-500'>{single.type}</span></span>
              </div>
              <span className='text-4xl font-bold' style={{lineHeight:'46px'}}>
               {single.title}
              </span>
              <p className='mt-3 text-gray-500'>
               {single.description }
              </p>
              <div className='w-full p-6 text-gray-500 mt-8'>
                {
                  single.points.map((item:point,index:number)=>(
                    <div key={index}>
                      <span className='text-gray-700'>{item.title}</span>
                      <p className='my-6'>{item.Explaination}</p>
                    </div>

                  ))
                }
              </div>
             </div>
            }
            </div>
            <div className='basis-1/3 bg- h-full z-20'>
            <div className='w-full p-6 bg-[#F5F5F5] mb-6'>
              <div className='w-full max-w-[300px] flex border-2 border-gray-300 text-gray-500 rounded overflow-hidden text-md items-center'>
                <input className='w-full py-3 pl-4' name='search' placeholder='Search...'>
                </input>
                <div className='w-[65px] py-3 h-full grid justify-center items-center hover:bg-[#37c0bd] bg-[#446E6D] transition duration-700 cursor-pointer' style={{height:'100%'}}>
                <SearchIcon className="text-bold text-white"/>
                </div>
              </div>

            </div>
            <div className='w-full mb-6 p-6 bg-[#F5F5F5] text-[#0a1121]' style={{
              fontFamily:'Nunito,sans-serif'}}>
              <p className='mb-6 text-lg font-bold w-full '>Blog Categories</p>
              <p className='w-full mb-2 text-gray-500 flex items-center hover:text-[#37c0bd] transition-colors duration-700 cursor-pointer ' onClick={()=>{setCategory('Global');setSingle(null)}}><ArrowForwardIosIcon fontSize='inherit' className='font-semibold'/>Global </p>
              <p className='w-full mb-2 text-gray-500 flex items-center hover:text-[#37c0bd] transition-colors duration-700 cursor-pointer' onClick={()=>{setCategory('Entertainment');setSingle(null)}}><ArrowForwardIosIcon fontSize='inherit' className='font-semibold'/>Entertainment </p>
              <p className='w-full mb-2 text-gray-500 flex items-center hover:text-[#37c0bd] transition-colors duration-700 cursor-pointer' onClick={()=>{setCategory('Sports News');setSingle(null)}}><ArrowForwardIosIcon fontSize='inherit' className='font-semibold'/>Sports News </p>
              <p className='w-full mb-2 text-gray-500 flex items-center hover:text-[#37c0bd] transition-colors duration-700 cursor-pointer' onClick={()=>{setCategory('Digital Marketing');setSingle(null)}}><ArrowForwardIosIcon fontSize='inherit' className='font-semibold'/>Digital Marketing </p>
              <p className='w-full mb-2 text-gray-500 flex items-center hover:text-[#37c0bd] transition-colors duration-700 cursor-pointer' onClick={()=>{setCategory('Ecommerce');setSingle(null)}}><ArrowForwardIosIcon fontSize='inherit' className='font-semibold'/>Ecommerce </p>
              <p className='w-full mb-2 text-gray-500 flex items-center hover:text-[#37c0bd] transition-colors duration-700 cursor-pointer' onClick={()=>{setCategory('Startup Business');setSingle(null)}}><ArrowForwardIosIcon fontSize='inherit' className='font-semibold'/>Startup Business</p>
              
            </div>
            <div className='w-full mb-6 p-6 bg-[#F5F5F5] text-[#0a1121]' style={{
              fontFamily:'Nunito,sans-serif'}}>
              <p className='mb-6 text-lg font-bold w-full '>Related Posts</p>
              <div className='w-full mb-5  flex  hover:text-[#37c0bd] transition-colors duration-700 cursor-pointer gap-3'>
                <div className='w-[80px] min-w-[80px] aspect-square'>
                  <img src='/thumb-expertise-webme1689186925.webp' className='w-full'/>
                </div>
                <div className=''>
                <p className='mb-1 w-full font-medium  flex flex-col' style={{lineHeight:'20px'}}>
                The Rise of Expert Freelancers: Unleashing the Power of Specialized Skills
                </p>
                <span className='text-[12px] font-medium text-gray-500 flex items-center gap-1'><CalendarMonthIcon fontSize='inherit'/> 23 Mar 2022</span>
                </div>
              </div>
              <div className='w-full mb-5  flex  hover:text-[#37c0bd] transition-colors duration-700 cursor-pointer gap-3'>
                <div className='w-[80px] min-w-[80px] aspect-square'>
                  <img src='/thumb-11691527193.webp' className='w-full'/>
                </div>
                <div className=''>
                <p className='mb-1 w-full font-medium  flex flex-col' style={{lineHeight:'20px'}}>
                Empowering Success: Embracing Modern Workplace Solutions
                </p>
                <span className='text-[12px] font-medium text-gray-500 flex items-center gap-1'><CalendarMonthIcon fontSize='inherit'/> 23 Mar 2022</span>
                </div>
              </div>
              <div className='w-full mb-5  flex  hover:text-[#37c0bd] transition-colors duration-700 cursor-pointer gap-3'>
                <div className='w-[80px] min-w-[80px] aspect-square'>
                  <img src='/thumb-whatsapp-image-2023-07-22-at-2153411690496384.webp' className='w-full'/>
                </div>
                <div className=''>
                <p className='mb-1 w-full font-medium  flex flex-col' style={{lineHeight:'20px'}}>
                Navigating the Digital Landscape: The Crucial Role of IT Support Services
                </p>
                <span className='text-[12px] font-medium text-gray-500 flex items-center gap-1'><CalendarMonthIcon fontSize='inherit'/> 23 Mar 2022</span>
                </div>
              </div>
              <div className='w-full mb-5  flex  hover:text-[#37c0bd] transition-colors duration-700 cursor-pointer gap-3'>
                <div className='w-[80px] min-w-[80px] aspect-square'>
                  <img src='/thumb-work-from-anywhere-webme1689186925.webp' className='w-full'/>
                </div>
                <div className=''>
                <p className='mb-1 w-full font-medium  flex flex-col' style={{lineHeight:'20px'}}>
                Embracing Freedom: Exploring the Cutting-Edge Work from Anywhere Technologies
                </p>
                <span className='text-[12px] font-medium text-gray-500 flex items-center gap-1'><CalendarMonthIcon fontSize='inherit'/> 23 Mar 2022</span>
                </div>
              </div>
              <div className='w-full mb-5  flex  hover:text-[#37c0bd] transition-colors duration-700 cursor-pointer gap-3'>
                <div className='w-[80px] min-w-[80px] aspect-square'>
                  <img src='/thumb-branding-webme1689186925.webp' className='w-full'/>
                </div>
                <div className=''>
                <p className='mb-1 w-full font-medium  flex flex-col' style={{lineHeight:'20px'}}>
                The Power of Branding: A Necessity for Small Businesses
                </p>
                <span className='text-[12px] font-medium text-gray-500 flex items-center gap-1'><CalendarMonthIcon fontSize='inherit'/> 23 Mar 2022</span>
                </div>
              </div>
              
              
            </div>


            </div>

        </div>

    </div>
  )
}
