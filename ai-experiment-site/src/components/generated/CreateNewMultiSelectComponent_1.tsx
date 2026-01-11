import React, { useState, useEffect } from 'react';

interface Option {
  label: string;
  value: string;
}

interface CreateNewMultiSelectComponentProps {
  label?: string;
  options: Option[];
  defaultValue?: string[];
  isSearchable?: boolean;
  isMulti?: boolean;
  isDisabled?: boolean;
  onChange?: (values: string[]) => void;
}

const CreateNewMultiSelectComponent: React.FC<CreateNewMultiSelectComponentProps> = ({
  label,
  options,
  defaultValue = [],
  isSearchable = false,
  isMulti = true,
  isDisabled = false,
  onChange,
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValue);

  useEffect(() => {
    if (onChange) {
      onChange(selectedValues);
    }
  }, [selectedValues, onChange]);

  const handleOptionClick = (option: Option) => {
    if (isMulti) {
      setSelectedValues((prevValues) => {
        if (prevValues.includes(option.value)) {
          return prevValues.filter((value) => value !== option.value);
        } else {
          return [...prevValues, option.value];
        }
      });
    } else {
      setSelectedValues([option.value]);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block font-medium text-gray-700 mb-2">{label}</label>
      )}
      <div className="relative">
        <div
          className={`bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 flex items-center justify-between cursor-pointer ${
            isDisabled ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          <div className="flex flex-wrap gap-2">
            {selectedValues.map((value) => (
              <div
                key={value}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
              >
                {
                  options.find((option) => option.value === value)?.label ||
                  value
                }
              </div>
            ))}
          </div>
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                selectedValues.includes(option.value)
                  ? 'bg-blue-100 text-blue-800'
                  : ''
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateNewMultiSelectComponent;