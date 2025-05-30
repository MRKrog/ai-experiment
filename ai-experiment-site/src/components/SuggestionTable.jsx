import { formatDistanceToNow } from 'date-fns';

const SuggestionTable = ({ suggestions }) => {
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

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Theme</th>
            <th className="text-left py-4 px-6 text-sm font-medium text-gray-300 w-28">Status</th>
            <th className="text-left py-4 px-6 text-sm font-medium text-gray-300 w-28">Priority</th>
            <th className="text-left py-4 px-6 text-sm font-medium text-gray-300 w-36">When</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
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
                {formatDistanceToNow(new Date(suggestion.createdAt), { addSuffix: true })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SuggestionTable; 