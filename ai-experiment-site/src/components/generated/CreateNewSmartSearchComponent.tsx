import React, { useState } from 'react';

interface CreateNewSmartSearchProps {
  /**
   * The placeholder text to display in the search input
   */
  placeholder?: string;
  /**
   * The initial search term to pre-populate the input with
   */
  initialSearchTerm?: string;
  /**
   * A callback function that is called when the search term changes
   * @param searchTerm - The current search term
   */
  onSearchTermChange?: (searchTerm: string) => void;
  /**
   * A callback function that is called when the user selects an autocomplete option
   * @param selectedOption - The selected autocomplete option
   */
  onOptionSelect?: (selectedOption: string) => void;
  /**
   * An array of autocomplete options to display
   */
  autocompleteOptions?: string[];
}

const CreateNewSmartSearchComponent: React.FC<CreateNewSmartSearchProps> = ({
  placeholder = 'Search...',
  initialSearchTerm = '',
  onSearchTermChange,
  onOptionSelect,
  autocompleteOptions = [],
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [isAutocompleteVisible, setIsAutocompleteVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    setIsAutocompleteVisible(newSearchTerm.length > 0);
    onSearchTermChange?.(newSearchTerm);
  };

  const handleOptionSelect = (option: string) => {
    setSearchTerm(option);
    setIsAutocompleteVisible(false);
    setSelectedOption(option);
    onOptionSelect?.(option);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchTermChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      {isAutocompleteVisible && autocompleteOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
          {autocompleteOptions.map((option, index) => (
            <div
              key={index}
              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                selectedOption === option ? 'bg-gray-100' : ''
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreateNewSmartSearchComponent;