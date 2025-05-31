import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ContentDialog } from '../ContentDialog';
import { PriorityBadge, StatusBadge } from '../../../common/Badge';
import type { DialogSuggestion } from '../../../../types/suggestion.types';

interface SuggestionTableProps {
  suggestions: DialogSuggestion[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onStartProcess?: (suggestion: DialogSuggestion) => void;
}

export const SuggestionTable: React.FC<SuggestionTableProps> = ({
  suggestions = [],
  isLoading = false,
  onDelete,
  onStartProcess
}) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<DialogSuggestion | null>(null);

  const formatDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const handleRowClick = (suggestion: DialogSuggestion) => {
    setSelectedSuggestion(suggestion);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-gray-700/30 rounded-t-lg mb-4"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-700/30 mb-2"></div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Theme
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Priority
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Created
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {suggestions.map((suggestion) => (
              <tr
                key={suggestion._id}
                onClick={() => handleRowClick(suggestion)}
                className="hover:bg-gray-700/50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-100">{suggestion.theme}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-100 line-clamp-2">{suggestion.description}</div>
                </td>
                <td className="px-6 py-4">
                  <PriorityBadge priority={suggestion.priority} />
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={suggestion.status} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {formatDate(suggestion.createdAt)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(suggestion._id);
                      }}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSuggestion && (
        <ContentDialog
          suggestion={selectedSuggestion}
          isOpen={true}
          onClose={() => setSelectedSuggestion(null)}
          onStartProcess={(suggestion) => {
            onStartProcess?.(suggestion);
            setSelectedSuggestion(null);
          }}
        />
      )}
    </>
  );
};

export default SuggestionTable; 