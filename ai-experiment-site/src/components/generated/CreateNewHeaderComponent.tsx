import React, { useState } from 'react';

interface CreateNewHeaderProps {
  onClose: () => void;
}

const CreateNewHeaderComponent: React.FC<CreateNewHeaderProps> = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
        onClick={toggleModal}
      >
        Create New Header
      </button>

      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-red-500">Create New Header</h2>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={onClose}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <form>
                {/* Add your header creation form fields here */}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNewHeaderComponent;