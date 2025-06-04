import React from 'react';

const CreateNewRedButtonComponent: React.FC = () => {
  return (
    <button
      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors duration-300"
    >
      Create New
    </button>
  );
};

export default CreateNewRedButtonComponent;