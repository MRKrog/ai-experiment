import React from 'react';

function ContentDialog({ suggestion, isOpen, onClose, onStartProcess }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="border-b border-gray-700 p-6">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-semibold text-gray-100">
              Generate Content
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Theme
            </label>
            <p className="text-gray-100">{suggestion.theme}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <p className="text-gray-100">{suggestion.description}</p>
          </div>

          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Priority
              </label>
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium
                ${suggestion.priority === 'high' ? 'bg-red-900/40 text-red-200' :
                  suggestion.priority === 'medium' ? 'bg-yellow-900/40 text-yellow-200' :
                    'bg-green-900/40 text-green-200'}`}>
                {suggestion.priority}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Status
              </label>
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium
                ${suggestion.status === 'pending' ? 'bg-blue-900/40 text-blue-200' :
                  suggestion.status === 'approved' ? 'bg-green-900/40 text-green-200' :
                    'bg-red-900/40 text-red-200'}`}>
                {suggestion.status}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onStartProcess(suggestion)}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              focus:ring-offset-gray-800 transition-colors"
          >
            Start Generation
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContentDialog; 