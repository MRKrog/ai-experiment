import { formatDistanceToNow } from 'date-fns';

const SuggestionTable = ({ suggestions }) => {
  const getPriorityBadgeClass = (priority) => {
    const classes = {
      low: 'badge-success',
      medium: 'badge-warning',
      high: 'badge-error'
    };
    return `badge ${classes[priority] || 'badge-ghost'}`;
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      pending: 'badge-info',
      approved: 'badge-success',
      rejected: 'badge-error'
    };
    return `badge ${classes[status] || 'badge-ghost'}`;
  };

  return (
    <div className="overflow-x-auto bg-base-200 rounded-lg shadow-xl">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Theme</th>
            <th>Description</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {suggestions.map((suggestion) => (
            <tr key={suggestion.id}>
              <td className="font-medium">{suggestion.theme}</td>
              <td className="max-w-md truncate">{suggestion.description}</td>
              <td>
                <span className={getPriorityBadgeClass(suggestion.priority)}>
                  {suggestion.priority}
                </span>
              </td>
              <td>
                <span className={getStatusBadgeClass(suggestion.status)}>
                  {suggestion.status}
                </span>
              </td>
              <td className="text-sm">
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