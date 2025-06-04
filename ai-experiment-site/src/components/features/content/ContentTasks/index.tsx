import React from 'react';
import TasksTable from '../../tasks/TasksTable';
import type { Task } from '../../../../types/task.types';

interface ContentTasksProps {
  tasks: Task[];
  loading?: boolean;
  error?: string | null;
  onDelete?: (taskId: string) => void;
  onStartProcess?: (task: Task) => void;
  onDeploy?: () => void;
}

export const ContentTasks: React.FC<ContentTasksProps> = ({
  tasks,
  loading = false,
  error,
  onDelete,
  onStartProcess,
  onDeploy
}) => {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-100 mb-4">Generation History</h2>
      <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 h-[80vh]">
        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center px-6 py-8 bg-red-900/20 rounded-lg border border-red-700/50">
              <p className="text-red-400 mb-2">⚠️ {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-sm text-red-300 hover:text-red-200 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : tasks.length > 0 || loading ? (
          <TasksTable 
            tasks={tasks} 
            isLoading={loading}
            onDelete={onDelete}
            onStartProcess={onStartProcess}
            onDeploy={onDeploy}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-400 mb-2">No tasks yet. Create your first one!</p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContentTasks; 