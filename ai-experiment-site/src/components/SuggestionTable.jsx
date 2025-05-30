import { formatDistanceToNow } from 'date-fns';

const SuggestionTable = ({ suggestions, isLoading = false }) => {
  const getPriorityBadgeClass = (priority) => {
    const classes = {
      low: 'bg-green-900/40 text-green-200',
      medium: 'bg-yellow-900/40 text-yellow-200',
      high: 'bg-red-900/40 text-red-200'
    };
    return `px-2.5 py-1 rounded-full text-xs font-medium ${classes[priority] || 'bg-gray-700 text-gray-300'}`;
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      pending: 'bg-blue-900/40 text-blue-200',
      approved: 'bg-green-900/40 text-green-200',
      rejected: 'bg-red-900/40 text-red-200'
    };
    return `px-2.5 py-1 rounded-full text-xs font-medium ${classes[status] || 'bg-gray-700 text-gray-300'}`;
  };

  const formatDate = (dateString) => {
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

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700/50 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-700 bg-gray-800 px-6 py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Loading...</span>
            <button className="text-blue-400 hover:text-blue-300">
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <table className="w-full divide-y divide-gray-700">
          <thead className="bg-gray-800 sticky top-0">
            <tr>
              <th scope="col" className="py-4 px-6 text-left text-sm font-medium text-gray-300">Theme</th>
              <th scope="col" className="py-4 px-6 text-left text-sm font-medium text-gray-300 w-28">Status</th>
              <th scope="col" className="py-4 px-6 text-left text-sm font-medium text-gray-300 w-28">Priority</th>
              <th scope="col" className="py-4 px-6 text-left text-sm font-medium text-gray-300 w-36">When</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-800/50">
            {suggestions.map((suggestion) => (
              <tr 
                key={suggestion.id} 
                className="hover:bg-gray-700/50 transition-colors cursor-pointer"
              >
                <td className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-100">
                      {suggestion.theme}
                    </span>
                    <span className="text-sm text-gray-400 line-clamp-2 mt-0.5">
                      {suggestion.description}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={getStatusBadgeClass(suggestion.status)}>
                    {suggestion.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={getPriorityBadgeClass(suggestion.priority)}>
                    {suggestion.priority}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-gray-400">
                  {formatDate(suggestion.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-gray-700 bg-gray-800 px-6 py-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">
            Showing {suggestions.length} issue{suggestions.length !== 1 ? 's' : ''}
          </span>
          <button 
            onClick={() => window.location.reload()} 
            className="text-blue-400 hover:text-blue-300"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestionTable; 