// Mock component data for testing without expensive API calls

const mockComponents = {
  headerComponent: {
    filename: 'HeaderComponent.tsx',
    content: `import React from 'react';

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
    <header className={\`bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-4 \${className}\`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        {subtitle && (
          <p className="text-xl opacity-90">{subtitle}</p>
        )}
      </div>
    </header>
  );
};

export default HeaderComponent;`,
    description: 'A modern gradient header component with title and optional subtitle'
  },
  
  buttonComponent: {
    filename: 'ButtonComponent.tsx',
    content: `import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const ButtonComponent: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = ''
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={\`\${baseClasses} \${variantClasses[variant]} \${sizeClasses[size]} \${className} \${disabled ? 'opacity-50 cursor-not-allowed' : ''}\`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ButtonComponent;`,
    description: 'A versatile button component with multiple variants and sizes'
  },
  
  cardComponent: {
    filename: 'CardComponent.tsx',
    content: `import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export const CardComponent: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  shadow = 'md'
}) => {
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };
  
  return (
    <div className={\`bg-white rounded-lg border border-gray-200 \${shadowClasses[shadow]} \${className}\`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="px-6 py-4">
        {children}
      </div>
    </div>
  );
};

export default CardComponent;`,
    description: 'A clean card component with optional title and configurable shadow'
  }
};

export function getMockComponent(componentType) {
  const component = mockComponents[componentType] || mockComponents.headerComponent;
  return {
    filename: component.filename,
    content: component.content,
    description: component.description
  };
}

export function createMockGeneratedContent(componentType) {
  return {
    tokensUsed: Math.floor(Math.random() * 500) + 200, // Random between 200-700
    model: 'claude-3-5-sonnet-20241022',
    generatedAt: new Date().toISOString(),
    type: 'component',
    componentType: componentType
  };
} 