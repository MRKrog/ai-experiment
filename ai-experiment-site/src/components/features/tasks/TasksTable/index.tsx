import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ContentDialog } from '../../content/ContentDialog';
import type { DialogSuggestion } from '../../../../types/suggestion.types';

interface Task extends DialogSuggestion {
  _id: string;
  title: string;
  type: 'code_generation' | 'image_generation' | 'text_generation';
  createdAt: string | Date;
}

interface TasksTableProps {
  tasks?: Task[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onStartProcess?: (task: Task) => void;
}

const TasksTable: React.FC<TasksTableProps> = ({ tasks = [], isLoading = false, onDelete, onStartProcess }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const getStatusBadgeClass = (status: string) => {
    const classes = {
      pending: 'bg-blue-900/40 text-blue-200',
      in_progress: 'bg-yellow-900/40 text-yellow-200',
      completed: 'bg-green-900/40 text-green-200',
      failed: 'bg-red-900/40 text-red-200'
    };
    return `px-2.5 py-1 rounded-full text-xs font-medium ${classes[status as keyof typeof classes] || 'bg-gray-700 text-gray-300'}`;
  };

  const getTypeBadgeClass = (type: string) => {
    const classes = {
      code_generation: 'bg-purple-900/40 text-purple-200',
      image_generation: 'bg-indigo-900/40 text-indigo-200',
      text_generation: 'bg-teal-900/40 text-teal-200'
    };
    return `px-2.5 py-1 rounded-full text-xs font-medium ${classes[type as keyof typeof classes] || 'bg-gray-700 text-gray-300'}`;
  };

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

  const handleRowClick = (task: Task) => {
    setSelectedTask(task);
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
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Type
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
            {tasks.map((task) => (
              <tr
                key={task._id}
                onClick={() => handleRowClick(task)}
                className="hover:bg-gray-700/50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-100">{task.title}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={getTypeBadgeClass(task.type)}>{task.type}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={getStatusBadgeClass(task.status)}>{task.status}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {formatDate(task.createdAt)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(task._id);
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

      {selectedTask && (
        <ContentDialog
          suggestion={selectedTask}
          isOpen={true}
          onClose={() => setSelectedTask(null)}
          onStartProcess={(task) => {
            onStartProcess?.(task as Task);
            setSelectedTask(null);
          }}
        />
      )}
    </>
  );
};

export default TasksTable; 