import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const HeaderComponent: React.FC<HeaderProps> = ({ 
  title, 
  subtitle, 
  className = '' 
}) => {
  return (
    <header className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-4 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        {subtitle && (
          <p className="text-xl opacity-90">{subtitle}</p>
        )}
      </div>
    </header>
  );
};

export default HeaderComponent;