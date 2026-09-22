"use client";
import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";

interface AccordionItemProps {
  title: string;
  content: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`bg-slate-100 overflow-hidden transition-all  duration-500 ease-in-out ${
        isOpen ? "max-h-[50rem]" : "max-h-[5rem]"
      }   duration-300 ease-in group `}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-[5rem] w-full px-5 flex items-center justify-between"
      >
        <h2 className="font-bold text-xs sm:text-sm  md:text-lg xl:text-xl">
          {title}
        </h2>
        <span className="group-hover:text-blue-600 transition-color">
          {isOpen ? (
            <FaMinus className="text-2xl" />
          ) : (
            <FaPlus className="text-2xl" />
          )}
        </span>
      </button>
      {isOpen && <div className="px-5 py-5">{content}</div>}
    </div>
  );
};

interface IAccordionProps {
  items: { title: string; content: React.ReactNode }[];
}

const Accordion: React.FC<IAccordionProps> = ({ items }) => {
  return (
    <div className=" my-3  xl:my-5 space-y-2">
      {items.map((item, index) => (
        <AccordionItem key={index} title={item.title} content={item.content} />
      ))}
    </div>
  );
};

export default Accordion;
