import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

function ContentNavbar() {
  const location = useLocation();
  
  return (
    <div className="bg-zinc-800 border-b border-zinc-700">
      <div className="max-w-[1400px] mx-auto px-8 w-full">
        <div className="flex justify-between h-16 items-center py-5">
          <div>
            <Link to="/" className="text-4xl font-semibold text-white hover:text-gray-200 font-['Barlow_Condensed'] flex items-center">
              <ArrowLeftIcon className="w-8 h-8" />
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <span className="bg-zinc-900/50 text-zinc-200 px-3 py-1 rounded-full text-sm font-medium">
              Content Mode
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentNavbar;