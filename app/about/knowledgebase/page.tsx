"use client"
import React,{useState} from 'react'
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import { title } from 'process';

export default function Page() {
  const blogData = [
    {
        about:'Digital',
    },
    {
        about:'Expertise',
    },
    {
        about:'Modern Workplace',
        articles:[
            {
                explain:'The concept of the workplace has transformed dramatically in recent years, ushering in a new era commonly referred to as the "modern workplace." This evolution is driven by technological advancements, changing employee expectations, and a shift in how businesses approach productivity and collaboration. In this article, we delve into the key characteristics of the modern workplace and explore how organizations are adapting to this transformative landscape.',
                title:'Embracing the Modern Workplace',
                points:[
                    {
                        title:'Defining the Modern Workplace',
                        explain:'The modern workplace is characterized by flexibility, digital integration, and a focus on employee well-being. It transcends traditional notions of a physical office and emphasizes outcomes over hours spent at a desk. Here are some essential components that define the modern workplace:',
                        points:[
                            {
                                title:'1. Remote and Flexible Work',
                                explain:'Remote work has become a cornerstone of the modern workplace. Advancements in technology have enabled employees to work from anywhere, breaking down geographical barriers and allowing for a more diverse and global workforce. Flexible work arrangements, such as hybrid models that combine in-person and remote work, empower employees to manage their schedules more effectively.',
                            },
                            {
                                title:'2. Technology Integration',
                                explain:'Digital transformation is at the heart of the modern workplace. Cloud-based tools, collaboration platforms, and communication apps facilitate seamless interactions among teams regardless of their physical locations. These technologies enable real-time collaboration, document sharing, and communication, fostering a more connected and productive work environment.',
                            },
                            {
                                title:'3. Emphasis on Well-Being',
                                explain:'Organizations are recognizing the importance of employee well-being. The modern workplace promotes a healthier work-life balance, offering benefits such as mental health resources, wellness programs, and flexible hours. Well-being initiatives contribute to increased job satisfaction, reduced burnout, and higher productivity.',
                            },
                            {
                                title:'4. Agile and Collaborative Culture',
                                explain:'The modern workplace embraces an agile mindset and encourages a collaborative culture. Cross-functional teams work together on projects, sharing diverse perspectives and skills. Hierarchical structures are often replaced with flatter, more accessible leadership models that foster open communication.',
                            },
                            {
                                title:'5. Data-Driven Decision-Making',
                                explain:'Data analytics play a pivotal role in the modern workplace. Organizations collect and analyze data on employee performance, engagement, and work patterns to inform decision-making. These insights enable businesses to tailor strategies for increased efficiency and employee satisfaction.',
                            },
                            {
                                title:'6. Lifelong Learning',
                                explain:'Continuous learning is essential in a rapidly evolving work landscape. The modern workplace supports ongoing skill development and provides opportunities for employees to upskill or reskill. This commitment to learning ensures that employees remain adaptable and relevant in their roles.',
                            },    
                        ],
                    },
                    {
                        title:'Adapting to the Modern Workplace',
                        explain:'Transitioning to the modern workplace requires strategic planning and a commitment to change. Here are some steps organizations can take to successfully adapt:',
                        points:[
                            {
                                title:'1. Embrace Technology',
                                explain:'Invest in digital tools that facilitate collaboration, communication, and remote work. Cloud-based platforms, project management software, and virtual meeting tools are essential for maintaining connectivity in a dispersed workforce.',
                            },
                            {
                                title:'2. Redefine Leadership',
                                explain:'Shift from traditional top-down leadership to a more approachable and collaborative leadership style. Leaders should act as facilitators, encouraging open dialogue and empowering teams to make decisions.',
                            },
                            {
                                title:'3. Prioritize Flexibility',
                                explain:'Offer flexible work arrangements that accommodate different preferences and lifestyles. This could involve implementing hybrid work models, flexible hours, and results-based performance assessments.',
                            },
                            {
                                title:'4. Foster a Positive Culture',
                                explain:'Promote a culture that values well-being, inclusivity, and diversity. Provide resources for mental health support, and create spaces for employees to connect and engage both professionally and socially.',
                            },
                            {
                                title:'5. Invest in Learning and Development',
                                explain:'Establish learning opportunities that help employees acquire new skills and stay updated on industry trends. This investment not only benefits individuals but also contributes to the organization\'s long-term growth.',
                            },
                            {
                                title:'6. Measure and Iterate',
                                explain:'Regularly assess the effectiveness of your modern workplace initiatives. Collect feedback from employees and use data to refine strategies for better outcomes.',
                            },
                        ],
                    },
                    {
                        title:'Conclusion',
                        explain:'The modern workplace is a dynamic and transformative environment that reflects the changing needs and expectations of today\'s workforce. By embracing flexibility, technology, employee well-being, collaboration, and data-driven insights, organizations can create a workplace that fosters innovation, engagement, and growth. Adapting to the modern workplace requires a holistic approach that values people, technology, and culture, ultimately leading to a more resilient and successful organization in the long run.',
                        points:[
                            {
                                title:'',
                                explain:'',
                            }
                        ],
                    },
                ],
            },
            {
                explain:'The modern workplace is a dynamic and evolving ecosystem, shaped by technological advancements, shifting demographics, and changing attitudes towards work. As organizations adapt to these changes, they are redefining the way work is done, fostering innovation, and placing a strong emphasis on collaboration and flexibility. In this article, we delve into the key characteristics of the modern workplace and how businesses can thrive in this new era.',
                title:'Navigating the Modern Workplace',
                points:[
                    {
                        title:'Characteristics of the Modern Workplace',
                        explain:'',
                        points:[
                            {
                                title:'1. Technology Integration',
                                explain:'Technology lies at the heart of the modern workplace. From cloud-based collaboration tools to remote work solutions, businesses are leveraging technology to enhance productivity, streamline processes, and facilitate communication. Mobile devices, video conferencing, and virtual reality are transforming how teams interact, allowing for seamless connectivity regardless of physical location.',
                            },
                            {
                                title:'2. Remote Work and Flexibility',
                                explain:'The concept of work has transcended the traditional office space. Remote work and flexible arrangements have gained traction, enabling employees to balance their personal and professional lives more effectively. This shift has been accelerated by the COVID-19 pandemic, demonstrating that many tasks can be accomplished remotely without compromising productivity.',
                            },
                            {
                                title:'3. Collaboration and Cross-Functional Teams',
                                explain:'Modern workplaces thrive on collaboration. Cross-functional teams bring together diverse skill sets to solve complex problems and drive innovation. Open communication channels, shared digital platforms, and project management tools empower teams to collaborate seamlessly, breaking down silos and fostering a culture of collective achievement.',
                            },
                            {
                                title:'4. Focus on Well-Being',
                                explain:'Employee well-being has become a central concern for organizations. The modern workplace acknowledges that a healthy and happy workforce is more productive and engaged. Companies are offering wellness programs, flexible schedules, mental health support, and ergonomic workspaces to prioritize the holistic well-being of their employees.',
                            },
                            {
                                title:'5. Embracing Diversity and Inclusion',
                                explain:'Diversity and inclusion are no longer just buzzwords – they are integral components of the modern workplace. Organizations recognize that a diverse workforce brings varied perspectives, leading to more innovative solutions and better decision-making. Inclusive practices create a sense of belonging and foster a positive work environment.',
                            },
                            {
                                title:'6. Lifelong Learning',
                                explain:'Continuous learning is essential in a rapidly changing world. The modern workplace encourages employees to upskill and reskill through training programs, workshops, and online courses. This commitment to learning not only benefits employees but also enhances the organization\'s adaptability and competitiveness.',
                            },
                        ],
                    },
                    {
                        title:'Thriving in the Modern Workplace',
                        explain:'To succeed in the modern workplace, businesses must adopt a forward-thinking approach. Here are some strategies to thrive in this dynamic environment:',
                        points:[
                            {
                                title:'1. Embrace Agility',
                                explain:'Flexibility and adaptability are crucial. Organizations need to be agile in responding to market changes, adopting new technologies, and accommodating evolving employee preferences.',
                            },
                            {
                                title:'2. Invest in Technology',
                                explain:'Make strategic investments in technology that enhance collaboration, streamline processes, and improve communication. Cloud-based solutions, project management tools, and automation can significantly boost efficiency.',
                            },
                            {
                                title:'3. Foster a Culture of Collaboration',
                                explain:'Encourage a collaborative mindset across the organization. Create spaces – both physical and digital – where employees can share ideas, collaborate on projects, and learn from one another.',
                            },
                            {
                                title:'4. Prioritize Employee Well-Being',
                                explain:'Recognize that employees are your most valuable asset. Implement well-being initiatives that support physical, mental, and emotional health. Flexible work arrangements and a supportive work environment contribute to overall job satisfaction.',
                            },
                            {
                                title:'5. Champion Diversity and Inclusion',
                                explain:'Cultivate a diverse and inclusive workforce where every voice is heard and valued. This not only drives innovation but also creates a more harmonious and empathetic workplace.',
                            },
                            {
                                title:'6. Foster a Learning Culture',
                                explain:'Encourage a culture of continuous learning and growth. Provide opportunities for employees to acquire new skills and knowledge, fostering their professional development and benefiting the organization.',
                            },
                        ],
                    },
                    {
                        title:'Conclusion',
                        explain:'The modern workplace is a dynamic landscape that requires organizations to adapt, innovate, and prioritize their most valuable asset – their employees. By embracing technology, encouraging collaboration, valuing diversity, and nurturing well-being, businesses can create a thriving and resilient workplace that not only meets the demands of the present but also paves the way for a successful future. As we navigate this ever-changing landscape, the modern workplace stands as a testament to our ability to evolve, connect, and drive meaningful progress.',
                    },
                ],
            }

        ]
    },
    {
        about:'Branding',
        articles:[
            {
                explain:'In today\'s competitive and rapidly evolving business landscape, standing out from the crowd has become more challenging than ever. As a result, the role of branding has gained paramount importance for businesses looking to establish a strong and memorable identity. Enter branding services – a strategic approach that goes beyond creating a logo and delves deep into crafting a holistic brand experience. In this article, we explore the significance of branding services and how they contribute to building a lasting and impactful brand identity.',
                title:'Understanding Branding Services',
                points:[
                    {
                        title:'Understanding Branding Services',
                        explain:'Branding services encompass a wide range of activities aimed at shaping and communicating a brand\'s essence, values, and personality. These services go beyond designing a visual identity; they focus on creating a coherent and consistent brand message that resonates with the target audience. From brand strategy development to visual design, messaging, and customer experience, branding services cover various aspects that contribute to a brand\'s perception in the market.',
                    }
                ],
            },
            {
                explain:'In today\'s competitive and rapidly evolving business landscape, standing out from the crowd has become more challenging than ever. As a result, the role of branding has gained paramount importance for businesses looking to establish a strong and memorable identity. Enter branding services – a strategic approach that goes beyond creating a logo and delves deep into crafting a holistic brand experience. In this article, we explore the significance of branding services and how they contribute to building a lasting and impactful brand identity.',
                title:'The Key Components of Branding Services',
                points:[
                    {
                        title:'The Key Components of Branding Services',
                        explain:'',
                        points:[
                            {
                                title:'Brand Strategy:',
                                explain:'This is the foundation of branding services. A brand strategy outlines the core values, mission, vision, and unique selling proposition of the business. It defines the brand\'s personality, target audience, and positioning in the market.',
                            },
                            {
                                title:'Visual Identity:',
                                explain:'A strong visual identity is crucial for brand recognition. This includes designing a logo, selecting a color palette, typography, and creating visual elements that consistently represent the brand across various platforms.',
                            },
                            {
                                title:'Messaging:',
                                explain:'Crafting compelling brand messages that communicate the brand\'s values, benefits, and story is essential. Consistent messaging helps in building a strong brand narrative that resonates with customers.',
                            },
                            {
                                title:'Customer Experience:',
                                explain:'How customers perceive a brand is greatly influenced by their interactions with it. Branding services work on enhancing the overall customer experience to create positive associations and long-lasting relationships.',
                            },
                            {
                                title:'Online Presence:',
                                explain:' In the digital age, a brand\'s online presence is of utmost importance. Branding services often include strategies for social media, website design, and other digital platforms to ensure a consistent and engaging online brand experience.',
                            },
                        ],
                    }
                ],
            },
            {
                explain:'In today\'s competitive and rapidly evolving business landscape, standing out from the crowd has become more challenging than ever. As a result, the role of branding has gained paramount importance for businesses looking to establish a strong and memorable identity. Enter branding services – a strategic approach that goes beyond creating a logo and delves deep into crafting a holistic brand experience. In this article, we explore the significance of branding services and how they contribute to building a lasting and impactful brand identity.',
                title:'The Significance of Branding Services',
                points:[
                    {
                        title:'',
                        explain:'',
                        points:[
                            {
                                title: "Differentiation:",
                                explain: "In a crowded marketplace, a distinct brand identity sets a business apart. Effective branding services help businesses stand out by highlighting their unique qualities and values."
                            },
                            {
                                title: "Trust and Credibility:",
                                explain: "A well-defined brand creates trust among customers. Consistency in branding signals professionalism and reliability, fostering credibility and loyalty."
                            },
                            {
                                title: "Emotional Connection:",
                                explain: "Successful branding services tap into emotions. Brands that resonate emotionally with customers can create a deeper and more lasting connection."
                            },
                            {
                                title: "Recognition:",
                                explain: "A memorable visual identity and consistent messaging contribute to easy recognition. Customers are more likely to remember and choose a brand they can easily identify."
                            },
                            {
                                title: "Perceived Value:",
                                explain: "A strong brand image can elevate a product or service's perceived value. Customers are often willing to pay a premium for brands they perceive as high-quality and reputable."
                            },
                            {
                                title: "Longevity:",
                                explain: "Trends come and go, but a well-established brand can withstand the test of time. Branding services focus on creating a timeless identity that remains relevant even as markets evolve."
                            }
                        ]
                        
                    }
                ],
            },
            {
                explain:'In today\'s competitive and rapidly evolving business landscape, standing out from the crowd has become more challenging than ever. As a result, the role of branding has gained paramount importance for businesses looking to establish a strong and memorable identity. Enter branding services – a strategic approach that goes beyond creating a logo and delves deep into crafting a holistic brand experience. In this article, we explore the significance of branding services and how they contribute to building a lasting and impactful brand identity.',
                title:'Choosing the Right Branding Service',
                points:[
                    {
                        title:'Choosing the Right Branding Service',
                        explain:'Selecting the right branding service provider is a crucial decision for any business. Here are a few factors to consider:',
                        points:[
                            {
                                title: "Experience and Portfolio:",
                                explain: "Review the agency's past work and ensure they have experience in your industry or a similar one."
                            },
                            {
                                title: "Understanding of Your Brand:",
                                explain: "The agency should take the time to understand your business, values, and goals before proposing a branding strategy."
                            },
                            {
                                title: "Collaboration:",
                                explain: "Look for an agency that is open to collaboration and values your input. The best results often come from a partnership between the agency's expertise and your business insights."
                            },
                            {
                                title: "Comprehensive Services:",
                                explain: "Choose an agency that offers a holistic approach to branding, covering various aspects such as strategy, design, messaging, and customer experience."
                            },
                            {
                                title: "Reputation and Reviews:",
                                explain: "Research the agency's reputation through client reviews and testimonials. A good track record is indicative of their capabilities."
                            }
                        ]                        
                    }
                ],
            },

        ]
    },
    {
        about:'Endless Support',
    },
    {
        about:'Work From Anywhere',
    },
    
  ]
  const [category ,setCategory] = useState('')
  const [single ,setSingle] = useState<any>(null)




  return (
    <div className='pt-16' id="read more">
      <div className='w-full grid justify-center'>
        <p className='w-max text-4xl py-16 text-center text-[#446E6D] cursor-pointer hover:text-[#37c0bd] transition-colors duration-700  z-20' onClick={()=>{setCategory('');setSingle(null)}}>
        Knowledgebase
      </p>
        </div>
        <div className='w-[1320px] mx-auto flex items-start z-20 gap-7'>
            <div className='basis-2/3 p-6 bg- h-full flex flex-col z-20'>
            <span className={`text-3xl text-[#446E6D] font-semibold mb-8 ${single && 'hidden'}`}>
            {category && category}
            {!category && !single && "Article Topics"}
            </span>
               {!category && !single && <div className='w-full flex flex-wrap'>
                  {
                    blogData.filter((item)=>item.articles).map((item,index)=>(
                        <div key={index} className='basis-1/2'>
                            <p className='text-lg pb-5 font-semibold cursor-pointer' onClick={()=>{setCategory(item.about);setSingle(null)}}>{item.about}</p>
                            <div className='w-full ml-5 flex flex-col text-gray-500'>
                                {
                                    item.articles && item.articles.map((articles,index)=>(
                                        <span className='mb-[10px] cursor-pointer' key={index} onClick={()=>{setSingle(articles);setCategory('')}}>{articles.title}</span>
                                    ))
                                }
                            </div>
                        </div>
                    ))}
                </div>
                }
                {
                    category && !single && <div className='w-full mb-16'>
                        {
                            blogData.filter((item)=>item.about===category).map((item,index)=>(
                                <div key={index} className='mb-5'>
                                     {
                                        item.articles ? (item.articles.map((articles,index)=>(
                                        <div className='border-b-2 border-gray-300 mb-5' key={index}>
                                            <p className='text-lg pb-5 font-semibold cursor-pointer' key={index} onClick={()=>{setSingle(articles);setCategory('')}}>{articles.title}</p>
                                            <p className='text-gray-500 line-clamp-3 mb-5'>{articles.explain}</p>
                                        </div>
                                        ))) :
                                        <p className="w-full text-center text-xl text-white py-3 bg-[#446E6D] z-20">No Article Found in {category} Topic</p>
                                     }
                                </div>
                            ))
                        }
                    </div>
                }
                {
                    single && !category && <div className='w-full'>
                        <p className='text-gray-500 line-clamp-3 mb-6'>{single.explain}</p>
                        {/* {single.title && <p className='text-lg pb-5 font-semibold cursor-pointer'>{single.title}</p>} */}
                        <div className='w-full wl-5'>
                        {
                            single.points && single.points.map((item: { title: string | React.ReactNode; explain: string | React.ReactNode; points: { title: string; explain: string }[] }, index: React.Key | null | undefined)=>(
                                <div key={index}>
                                    {item.title && <p className='text-xl pb-8 pt-3 font-semibold cursor-pointer'>{item.title}</p>}
                                    {item.explain && <p className='text-gray-500 line-clamp-3 mb-6'>{item.explain}</p>}
                                    {
                                        item.points && item.points.map((points,index)=>(
                                            <div key={index}>
                                                <p className='text-gray-800 line-clamp-3 mb-6 font-semibold'>{points.title}</p>
                                                <p className='text-gray-500 line-clamp-3 mb-6'>{points.explain}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            ))
                        }
                        </div>

                    </div>
                }
            </div>
            {/* {console.log(blogData.filter((item)=>item.about===category))} */}
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
              <p className='mb-6 text-lg font-bold w-full '>Topics</p>
              {
                blogData.map((item,index)=>(
                    <p className='w-full mb-2 text-gray-500 flex items-center hover:text-[#37c0bd] transition-colors duration-700 cursor-pointer ' onClick={()=>{setCategory(item.about);setSingle(null)}} key={index}><ArrowForwardIosIcon fontSize='inherit' className='font-semibold'/>{item.about} </p>
                ))
              }
            </div>
            </div>
        </div>

    </div>
  )
}
