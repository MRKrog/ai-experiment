import React, { useState, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ContentDialog } from '../../content/ContentDialog';
import { Tooltip } from '../../../common/Tooltip';
import type { Task } from '../../../../types/task.types';
import { TrashIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface TasksTableProps {
  tasks?: Task[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onStartProcess?: (task: Task) => void;
  onDeploy?: () => void;
}

const TasksTable: React.FC<TasksTableProps> = ({ tasks = [], isLoading = false, onDelete, onStartProcess, onDeploy }) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const getStatusBadgeClass = (status: string) => {
    const classes = {
      pending: 'bg-blue-900/40 text-blue-200',
      in_progress: 'bg-yellow-900/40 text-yellow-200',
      staged: 'bg-green-900/40 text-green-200',
      deploying: 'bg-purple-900/40 text-purple-200',
      live: 'bg-emerald-900/40 text-emerald-200',
      deployed: 'bg-emerald-900/40 text-emerald-200',
      deploy_failed: 'bg-orange-900/40 text-orange-200',
      failed: 'bg-red-900/40 text-red-200'
    };
    return `inline-flex px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${classes[status as keyof typeof classes] || 'bg-gray-700 text-gray-300'}`;
  };

  const getTypeBadgeClass = (type: string) => {
    const classes = {
      code_generation: 'bg-purple-900/40 text-purple-200',
      image_generation: 'bg-indigo-900/40 text-indigo-200',
      text_generation: 'bg-teal-900/40 text-teal-200'
    };
    return `inline-flex px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${classes[type as keyof typeof classes] || 'bg-gray-700 text-gray-300'}`;
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
      <div className="space-y-4">
        <div className="h-12 bg-gray-700/30 rounded-lg animate-pulse"></div>
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="h-16 bg-gray-700/30 rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center"
      >
        <p className="text-gray-400 text-lg">No tasks found</p>
        <p className="text-gray-500 text-sm mt-2">Create your first task to get started</p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-xl">
        <div className="divide-y divide-gray-700">
          {/* Header */}
          <div className="bg-gray-900/50 grid grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_1fr)_120px] gap-6 px-6 py-4 text-xs text-gray-400 tracking-wider font-medium">
            <div className="truncate">Title</div>
            <div className="truncate">Type</div>
            <div className="truncate">Status</div>
            <div className="truncate">Created</div>
            <div className="text-right">Actions</div>
          </div>

          {/* Body */}
          <div className="divide-y divide-gray-700">
            <AnimatePresence>
              {tasks.map((task) => (
                <div
                  key={task._id}
                  onClick={() => handleRowClick(task)}
                  className="flex items-center gap-x-4 px-6 py-4 cursor-pointer hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex-1 truncate">
                    <TruncatedTitle title={task.title} />
                  </div>
                  <span className={getTypeBadgeClass(task.type)}>
                    {task.type.replace(/_/g, ' ')}
                  </span>
                  <span className={getStatusBadgeClass(task.status)}>
                    {task.status}
                  </span>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {formatDate(task.createdAt)}
                  </span>
                  
                  <div className="flex items-center justify-end gap-2">
                    {/* Deploy Button - Only show for staged tasks */}
                    {task.status === 'staged' && onDeploy && (
                      <Tooltip content="Deploy component to live website">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeploy();
                          }}
                          className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded transition-colors"
                        >
                          <RocketLaunchIcon className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    )}
                    
                    {/* Live Indicator - Show for live tasks */}
                    {(task.status === 'live' || task.status === 'deployed') && (
                      <Tooltip content="Live on website">
                        <div className="p-1.5 text-emerald-400 rounded">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium">LIVE</span>
                          </div>
                        </div>
                      </Tooltip>
                    )}
                    
                    {/* Deploying Indicator - Show for deploying tasks */}
                    {task.status === 'deploying' && (
                      <Tooltip content="Deploying to website">
                        <div className="p-1.5 text-purple-400 rounded">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-spin"></div>
                            <span className="text-xs font-medium">DEPLOYING</span>
                          </div>
                        </div>
                      </Tooltip>
                    )}
                    
                    {/* Delete Button */}
                    {onDelete && (
                      <Tooltip content="Delete task">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(task._id);
                          }}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                          aria-label="Delete task"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </Tooltip>
                    )}
                  </div>
                </div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
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
      </AnimatePresence>
    </>
  );
};

export default TasksTable; 