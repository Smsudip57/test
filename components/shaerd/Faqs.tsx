"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

// Define types for FAQ data structures
interface QuestionAnswer {
  question: string;
  answer: string;
}

interface FaqData {
  _id: string;
  title: string;
  questions: QuestionAnswer[];
  relatedServices?: string | string[];
  relatedIndustries?: string | string[];
  relatedProducts?: string | string[];
  relatedChikfdServices?: string | string[];
}

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleOpen: () => void;
}

interface FaqSectionProps {
  industry?: string;
  child?: string;
  product?: string;
  data: FaqData[];
}

const FaqItem: React.FC<FaqItemProps> = ({
  question,
  answer,
  isOpen,
  toggleOpen,
}) => {
  return (
    <div
      className={`w-full border-b-2 border-[#446e6d44]`}
      onClick={toggleOpen}
    >
      <button className="text-[#446E6D] text-lg lg:text-xl w-full flex justify-between items-center mb-6">
        <strong className="bg-white flex w-full text-left">{question}</strong>
        <span className="text-3xl p-[5px] rounded-full overflow-hidden bg-[#446e6d21]">
          {!isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13.54"
              height="13.54"
              fill="none"
              aria-hidden="true"
              className="fill-black accordion__icon accordion__icon--plus"
              viewBox="0 0 22 22"
            >
              <path
                fill="#000"
                fillRule="evenodd"
                d="M13 12.5h8.25c.4 0 .75-.35.75-.75v-1.5c0-.4-.35-.75-.75-.75H13c-.3 0-.5-.2-.5-.5V.75c0-.4-.35-.75-.75-.75h-1.5c-.4 0-.75.35-.75.75V9c0 .3-.2.5-.5.5H.75c-.4 0-.75.35-.75.75v1.5c0 .4.35.75.75.75H9c.3 0 .5.2.5.5v8.25c0 .4.35.75.75.75h1.5c.4 0 .75-.35.75-.75V13c0-.3.2-.5.5-.5Z"
                clipRule="evenodd"
              ></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14.77"
              height="14.77"
              fill="none"
              aria-hidden="true"
              className="fill-black accordion__icon accordion__icon--minus"
              viewBox="0 0 24 3"
            >
              <path
                fill="#000"
                fillRule="evenodd"
                d="M24 2.25c0 .4-.35.75-.75.75H.75C.35 3 0 2.65 0 2.25V.75C0 .35.35 0 .75 0h22.5c.4 0 .75.35.75.75v1.5Z"
                clipRule="evenodd"
              ></path>
            </svg>
          )}
        </span>
      </button>
      <p className={`${isOpen ? "block" : "hidden"} mb-6 text-left`}>{answer}</p>
    </div>
  );
};

// Default FAQs to use when no data is available
const defaultFaqs: QuestionAnswer[] = [
  {
    question: "What is a CRM for the automotive industry?",
    answer:
      "Customer relationship management for the automotive industry is a system for managing all of your company's interactions with current and potential customers, as well as critical information like driver, vehicle, retail, and automotive financial data.",
  },
  {
    question: "How do I choose the best automotive CRM for my business?",
    answer:
      "First, determine what you want an automotive CRM to solve. An automotive CRM should include functionality, such as vehicle and driver information, automotive lead management, partner performance management, inventory management, fleet management, embedded analytics and AI, and more.",
  },
  {
    question: "What are the benefits of using a CRM for automotive?",
    answer:
      "An automotive CRM can help you get 360-degree visibility into your customers and their households and vehicles, build a robust sales pipeline, intelligently manage your vehicle and parts product portfolio, and deliver meaningful service experiences for drivers and households.",
  },
  {
    question: "Does my business need an automotive CRM?",
    answer:
      "Consider an automotive CRM if you find that your customer-facing interactions are misguided, that you're missing upsell opportunities, or if you want to better serve drivers and their households. An automotive CRM like Automotive Cloud helps teams take action fast and delight every customer.",
  },
];

// Internal FAQ Section Component
const FaqSection: React.FC<FaqSectionProps> = ({
  industry,
  child,
  product,
  data
}) => {
  const [faqs, setFaqs] = useState<FaqData[]>([]);
  const [openFaqs, setOpenFaqs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        // Only append industry param if it exists
        const queryParam = industry ? `?industry=${industry}` : "";
        const response = await axios.get<{ faqs: FaqData[] }>(
          `/api/faq/get${queryParam}`
        );
        if (industry || child || product) {
          // Filter by related fields if provided
          const filteredArticles = response.data.faqs.filter(
            (item: FaqData) => {
              // Check if any of the relationships match
              let matchesIndustry = false;
              let matchesChild = false;
              let matchesProduct = false;

              // Check industry match
              if (industry && item.relatedIndustries) {
                if (Array.isArray(item.relatedIndustries)) {
                  // Check if populated (objects with _id) or just ID strings
                  matchesIndustry = item.relatedIndustries.some((ind:any) =>
                    typeof ind === "object"
                      ? ind._id === industry
                      : ind === industry
                  );
                } else {
                  matchesIndustry = item.relatedIndustries === industry;
                }
              }

              // Check child service match (stored in relatedProducts)
              if (child && item.relatedProducts) {
                if (Array.isArray(item.relatedProducts)) {
                  matchesChild = item.relatedProducts.some((prod:any) =>
                    typeof prod === "object"
                      ? prod._id === child
                      : prod === child
                  );
                } else {
                  matchesChild = item.relatedProducts === child;
                }
              }

              // Check product match (stored in relatedChikfdServices)
              if (product && item.relatedChikfdServices) {
                if (Array.isArray(item.relatedChikfdServices)) {
                  matchesProduct = item.relatedChikfdServices.some(
                    (childServ:any) =>
                      typeof childServ === "object"
                        ? childServ._id === product
                        : childServ === product
                  );
                } else {
                  matchesProduct = item.relatedChikfdServices === product;
                }
              }

              return matchesIndustry || matchesChild || matchesProduct;
            }
          );

          setFaqs(filteredArticles);
        } else {
          setFaqs(response.data.faqs);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };

    if (!data) {
    fetchFaqs();
    } else {
      setFaqs(data);
    }
  }, [industry, child, product]);

  const toggleFaq = (questionId: number) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Choose which FAQs to render - use first FAQ's questions or default
  const faqsToRender: QuestionAnswer[] =
    faqs.length > 0 && faqs[0]?.questions?.length > 0
      ? faqs[0].questions
      : defaultFaqs;

  return (
    <div className="relative bg-no-repeat bg-cover w-full bg-bottom">
      <div className="flex flex-col justify-center mt-[110px]">
        <div className="mx-auto text-center w-[90%] lg:w-[1000px] z-20">
          <span className="text-2xl lg:text-4xl">
            <strong>{faqs?.[0]?.title || "FAQ"}</strong>
          </span>
        </div>
        <div className="w-[90%] lg:w-[1000px] mx-auto mt-12 mb-52 z-20">
          <div className="flex flex-col gap-10 lg:mx-24">
            {faqsToRender.map((faqItem, index) => (
              <FaqItem
                key={index}
                question={faqItem.question}
                answer={faqItem.answer}
                isOpen={!!openFaqs[index]}
                toggleOpen={() => toggleFaq(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
