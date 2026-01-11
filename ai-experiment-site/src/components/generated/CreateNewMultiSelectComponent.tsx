import React, { useState } from 'react';

interface Option {
  label: string;
  value: string;
}

interface CreateNewMultiSelectComponentProps {
  label?: string;
  options: Option[];
  defaultValues?: string[];
  onSubmit: (selectedValues: string[]) => void;
  isLoading?: boolean;
  error?: string;
}

const CreateNewMultiSelectComponent: React.FC<CreateNewMultiSelectComponentProps> = ({
  label = 'Select options',
  options,
  defaultValues = [],
  onSubmit,
  isLoading = false,
  error = '',
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValues);

  const handleOptionClick = (option: Option) => {
    if (selectedValues.includes(option.value)) {
      setSelectedValues(selectedValues.filter((value) => value !== option.value));
    } else {
      setSelectedValues([...selectedValues, option.value]);
    }
  };

  const handleSubmit = () => {
    onSubmit(selectedValues);
  };

  return (
    <div className="w-full max-w-md">
      {label && (
        <label htmlFor="multi-select" className="block mb-2 font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <ul
          id="multi-select"
          className="absolute z-10 w-full mt-2 overflow-auto bg-white border rounded-md shadow-lg max-h-60"
        >
          {options.map((option) => (
            <li
              key={option.value}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                selectedValues.includes(option.value) ? 'bg-gray-200' : ''
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full px-4 py-2 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
        {error && (
          <div className="mt-2 text-red-500 font-medium">{error}</div>
        )}
      </div>
    </div>
  );
};

export default CreateNewMultiSelectComponent;