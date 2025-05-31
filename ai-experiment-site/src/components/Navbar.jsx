import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ suggestionsCount, loading }) {
  const location = useLocation();
  
  return (
    <div className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-[1400px] mx-auto px-8 w-full">
        <div className="flex justify-between h-16 items-center py-5">
          <div className="flex-1">
            <Link to="/" className="text-4xl font-semibold text-white hover:text-gray-200 font-['Barlow_Condensed']">
              AI Content Generator
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <nav className="flex gap-4 mr-4">
              <Link 
                to="/" 
                className={`text-sm font-medium ${
                  location.pathname === '/' 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Generate Content
              </Link>
              <Link 
                to="/content" 
                className={`text-sm font-medium ${
                  location.pathname === '/content' 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                View Content
              </Link>
            </nav>
            <span className="bg-blue-900/50 text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
              {suggestionsCount} Requests
            </span>
            {loading && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700/50 text-gray-200">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar; 