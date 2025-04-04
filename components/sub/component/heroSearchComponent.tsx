import { SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function HeroComponent() {
  const data = "Your IT Solutions Galaxy";
  const data2 = "Search for Products, Services you wish to explore";
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [index, setIndex] = useState(0);
  const [isTypingData1, setIsTypingData1] = useState(true);
  useEffect(() => {
    const handleTyping = () => {
      const activeData = isTypingData1 ? data : data2;

      if (!deleting) {
        if (index < activeData.length) {
          setText((prev) => prev + activeData[index]);
          setIndex((prev) => prev + 1);
        } else {
          setTimeout(() => setDeleting(true), 1000);
        }
      } else {
        if (index > 0) {
          setText((prev) => prev.slice(0, -1));
          setIndex((prev) => prev - 1);
        } else {
          setDeleting(false);
          setIsTypingData1((prev) => !prev);
          setIndex(0);
        }
      }
    };

    const timeoutId = setTimeout(handleTyping, 100);
    return () => clearTimeout(timeoutId);
  }, [index, deleting, isTypingData1]);
  return (
    <div className="rounded-[70px] w-full  mx-auto border-[1.5px] gap-2 xs:gap-4 flex md:gap-5 border-[#0B2B20] p-1 justify-between bg-white border-box">
      <div className="flex gap-2.5 items-center">
        <img
          alt="search"
          loading="lazy"
          width="25"
          height="25"
          decoding="async"
          data-nimg="1"
          className="sm:ml-2 xs:w-6 xs:h-6 w-5 invisible sm:visible"
          style={{ color: "transparent" }}
          src="/search.svg"
        />
        <input
          placeholder={text}
          className="text-[#101513] text-base xs:text-base leading-7 focus:outline-none"
        />
      </div>
      <button className="bg-[#446E6D] font-medium text-white text-lg sm:text-base px-1.5 xs:px-3 md:px-[34px] py-2 md:py-[11.5px] font-graphik rounded-[39px] border-box">
        <span className="hidden sm:block">webmedigital</span>
        <span className="sm:hidden aspect-square p-2">
          <SearchIcon fontSize="inherit" />
        </span>
      </button>
    </div>
  );
}
