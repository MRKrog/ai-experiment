import React from 'react';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Form: React.FC<FormProps> = ({ children, className = '', ...props }) => {
  return (
    <form className={`space-y-6 ${className}`} {...props}>
      {children}
    </form>
  );
};

export const FormLabel: React.FC<FormLabelProps> = ({ children, className = '', ...props }) => {
  return (
    <label
      className={`block text-sm font-medium text-gray-300 mb-1 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

export const FormInput: React.FC<FormInputProps> = ({ error, className = '', ...props }) => {
  return (
    <div>
      <input
        className={`w-full px-4 py-3 rounded-lg bg-gray-700 border-gray-600 text-gray-100 
          placeholder-gray-400 focus:bg-gray-600 focus:outline-none focus:ring-2 
          focus:ring-blue-500 focus:border-transparent transition-all
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export const FormTextarea: React.FC<FormTextareaProps> = ({ error, className = '', ...props }) => {
  return (
    <div>
      <textarea
        className={`w-full px-4 py-3 rounded-lg bg-gray-700 border-gray-600 text-gray-100 
          placeholder-gray-400 focus:bg-gray-600 focus:outline-none focus:ring-2 
          focus:ring-blue-500 focus:border-transparent transition-all resize-none
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export const FormGroup: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {children}
    </div>
  );
};

export default {
  Form,
  FormLabel,
  FormInput,
  FormTextarea,
  FormGroup
}; 