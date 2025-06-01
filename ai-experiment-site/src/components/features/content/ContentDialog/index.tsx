import React from 'react';
import type { DialogSuggestion } from '../../../../types/suggestion.types';

interface ContentDialogProps {
  suggestion: DialogSuggestion;
  isOpen: boolean;
  onClose: () => void;
  onStartProcess?: (suggestion: DialogSuggestion) => void;
}

export const ContentDialog: React.FC<ContentDialogProps> = ({
  suggestion,
  isOpen,
  onClose,
  onStartProcess,
}) => {
  if (!isOpen) return null;

  const getTypeBadgeClass = (type: string) => {
    const classes = {
      code_generation: 'bg-purple-900/40 text-purple-200',
      image_generation: 'bg-indigo-900/40 text-indigo-200',
      text_generation: 'bg-teal-900/40 text-teal-200'
    };
    return `inline-flex px-2 py-1 text-xs font-medium rounded-full ${classes[type as keyof typeof classes] || 'bg-gray-700 text-gray-300'}`;
  };

  const getStatusBadgeClass = (status: string) => {
    const classes = {
      pending: 'bg-blue-900/40 text-blue-200',
      in_progress: 'bg-yellow-900/40 text-yellow-200',
      completed: 'bg-green-900/40 text-green-200',
      failed: 'bg-red-900/40 text-red-200'
    };
    return `inline-flex px-2 py-1 text-xs font-medium rounded-full ${classes[status as keyof typeof classes] || 'bg-gray-700 text-gray-300'}`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-gray-800 rounded-lg shadow-xl border border-gray-700 w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-medium text-gray-100">Task Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700/50 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Title & Type */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
              <div className="text-gray-100 font-medium">{suggestion.title}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
              <span className={getTypeBadgeClass(suggestion.type)}>
                {suggestion.type.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <div className="text-gray-100 bg-gray-900/50 rounded-md p-3">{suggestion.description}</div>
          </div>

          {/* Metadata */}
          {suggestion.metadata && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Metadata</label>
              <div className="bg-gray-900/50 rounded-md p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <span className="ml-2 text-gray-100">{suggestion.metadata.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Scenario:</span>
                    <span className="ml-2 text-gray-100">{suggestion.metadata.scenario}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Component:</span>
                    <span className="ml-2 text-gray-100">{suggestion.metadata.component}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">New Component:</span>
                    <span className="ml-2 text-gray-100">{suggestion.metadata.isNewComponent ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
            <span className={getStatusBadgeClass(suggestion.status)}>
              {suggestion.status}
            </span>
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Prompt</label>
            <div className="text-gray-100 bg-gray-900/50 rounded-md p-3 whitespace-pre-wrap">
              {suggestion.prompt}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-300 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onStartProcess?.(suggestion)}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
          >
            Start Generation
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentDialog; 