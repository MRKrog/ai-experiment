import React, { useState, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ContentDialog } from '../../content/ContentDialog';
import { Tooltip } from '../../../common/Tooltip';
import type { Task } from '../../../../types/task.types';
import { TrashIcon } from '@heroicons/react/24/outline';

interface TasksTableProps {
  tasks?: Task[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onStartProcess?: (task: Task) => void;
}

const TasksTable: React.FC<TasksTableProps> = ({ tasks = [], isLoading = false, onDelete, onStartProcess }) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

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
    setSelectedTaskId(task._id);
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
                        onDelete(task._id);
                      }}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-full hover:bg-red-400/10"
                      title="Delete task"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedTaskId && (
        <ContentDialog
          taskId={selectedTaskId}
          isOpen={true}
          onClose={() => setSelectedTaskId(null)}
          onStartProcess={(task) => {
            onStartProcess?.(task);
            setSelectedTaskId(null);
          }}
        />
      )}
    </>
  );
};

export default TasksTable; 