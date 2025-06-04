import React from 'react';

interface CreateNewFooterProps {
  backgroundColor?: string;
  textColor?: string;
  children?: React.ReactNode;
}

const CreateNewFooterComponent: React.FC<CreateNewFooterProps> = ({
  backgroundColor = 'bg-blue-500',
  textColor = 'text-white',
  children,
}) => {
  return (
    <footer
      className={`w-full py-6 px-4 ${backgroundColor} ${textColor} flex justify-center items-center`}
    >
      {children}
    </footer>
  );
};

export default CreateNewFooterComponent;