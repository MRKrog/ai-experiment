import React, { useState, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ContentDialog } from '../../content/ContentDialog';
import { Tooltip } from '../../../common/Tooltip';
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
    return `inline-flex ml-2 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${classes[status as keyof typeof classes] || 'bg-gray-700 text-gray-300'}`;
  };

  const getTypeBadgeClass = (type: string) => {
    const classes = {
      code_generation: 'bg-purple-900/40 text-purple-200',
      image_generation: 'bg-indigo-900/40 text-indigo-200',
      text_generation: 'bg-teal-900/40 text-teal-200'
    };
    return `inline-flex mr-2 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${classes[type as keyof typeof classes] || 'bg-gray-700 text-gray-300'}`;
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

  const handleDelete = async (taskId: string) => {
    try {
      const response = await fetch(`https://ai-experiment-production.up.railway.app/api/tasks/${taskId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      onDelete?.(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const TruncatedTitle: React.FC<{ title: string }> = ({ title }) => {
    const titleRef = useRef<HTMLDivElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    React.useEffect(() => {
      if (titleRef.current) {
        setIsOverflowing(titleRef.current.scrollWidth > titleRef.current.clientWidth);
      }
    }, [title]);

    return (
      <div className="truncate">
        {isOverflowing ? (
          <Tooltip content={title}>
            <div ref={titleRef} className="text-sm font-medium text-gray-100 truncate max-w-[calc(100%-8px)]">
              {title}
            </div>
          </Tooltip>
        ) : (
          <div ref={titleRef} className="text-sm font-medium text-gray-100 truncate max-w-[calc(100%-8px)]">
            {title}
          </div>
        )}
      </div>
    );
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

  if (!tasks.length) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
        <p className="text-gray-400">No tasks found</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="divide-y divide-gray-700">
          {/* Header */}
          <div className="bg-gray-900/50 grid grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_1fr)_80px] gap-6 px-6 py-3 text-xs text-gray-400 tracking-wider">
            <div className="truncate">Title</div>
            <div className="truncate">Type</div>
            <div className="truncate">Status</div>
            <div className="truncate">Created</div>
            <div className="text-right">Actions</div>
          </div>

          {/* Body */}
          <div className="divide-y divide-gray-700">
            {tasks.map((task) => (
              <div
                key={task._id}
                onClick={() => handleRowClick(task)}
                className="grid grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_1fr)_80px] gap-6 px-6 py-4 hover:bg-gray-700/50 cursor-pointer transition-colors items-center"
              >
                <TruncatedTitle title={task.title} />
                <div className="flex items-center">
                  <span className={getTypeBadgeClass(task.type)}>
                    {task.type.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className={getStatusBadgeClass(task.status)}>
                    {task.status}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {formatDate(task.createdAt)}
                </div>
                <div className="text-right">
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(task._id);
                      }}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-full hover:bg-red-400/10"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span className="sr-only">Delete</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
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