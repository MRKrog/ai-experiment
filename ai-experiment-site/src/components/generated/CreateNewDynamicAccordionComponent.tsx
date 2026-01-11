import React, { useState, useEffect, useRef } from 'react';

interface CreateNewDynamicAccordionProps {
  title: string;
  content: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

const CreateNewDynamicAccordionComponent: React.FC<CreateNewDynamicAccordionProps> = ({
  title,
  content,
  isOpen = false,
  onToggle,
}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(isOpen);
  const accordionBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (accordionBodyRef.current) {
      accordionBodyRef.current.style.maxHeight = isAccordionOpen
        ? `${accordionBodyRef.current.scrollHeight}px`
        : '0px';
    }
  }, [isAccordionOpen]);

  const toggleAccordion = () => {
    setIsAccordionOpen((prevState) => !prevState);
    onToggle?.();
  };

  return (
    <div className="bg-white shadow-md rounded-md">
      <button
        className="flex items-center justify-between w-full px-4 py-3 text-lg font-medium text-gray-800 hover:bg-gray-100 focus:outline-none"
        onClick={toggleAccordion}
      >
        <span>{title}</span>
        <svg
          className={`h-6 w-6 transition-transform ${
            isAccordionOpen ? 'transform rotate-180' : ''
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div
        ref={accordionBodyRef}
        className="overflow-hidden transition-all duration-300"
      >
        <div className="px-4 py-3 text-gray-700">{content}</div>
      </div>
    </div>
  );
};

export default CreateNewDynamicAccordionComponent;