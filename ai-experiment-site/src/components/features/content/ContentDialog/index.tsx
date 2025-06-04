import React, { useState, useEffect } from 'react';
import type { Task } from '../../../../types/task.types';
import { TaskService } from '../../../../services/taskService';
import { XMarkIcon, DocumentDuplicateIcon, ArrowDownTrayIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ContentDialogProps {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
  onStartProcess?: (task: Task) => void;
}

export const ContentDialog: React.FC<ContentDialogProps> = ({
  taskId,
  isOpen,
  onClose,
  onStartProcess
}) => {
  const [task, setTask] = useState<Task | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showGeneratedContent, setShowGeneratedContent] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const foundTask = await TaskService.getTaskById(taskId);
        setTask(foundTask || null);
      } catch (error) {
        console.error('Error fetching task:', error);
        setTask(null);
      }
    };

    if (isOpen && taskId) {
      fetchTask();
    }
  }, [taskId, isOpen]);

  const handleCopyToClipboard = async () => {
    if (task?.generatedContent?.content) {
      try {
        await navigator.clipboard.writeText(task.generatedContent.content);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy content:', err);
      }
    }
  };

  const handleDownloadComponent = () => {
    if (task?.generatedContent?.content && task?.generatedContent?.filename) {
      const blob = new Blob([task.generatedContent.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = task.generatedContent.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-gray-100">Task Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title & Type */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-100">{task.title}</h3>
              <div className="mt-2">
                <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-purple-900/40 text-purple-200">
                  {task.type?.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Description</h4>
            <p className="text-gray-200">{task.description}</p>
          </div>

          {/* Metadata */}
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Metadata</h4>
            <div className="grid grid-cols-2 gap-4 bg-gray-900/50 p-4 rounded-lg">
              <div>
                <span className="text-sm text-gray-400">Category: </span>
                <span className="text-gray-200">{task.metadata?.category}</span>
              </div>
              <div>
                <span className="text-sm text-gray-400">Scenario: </span>
                <span className="text-gray-200">{task.metadata?.scenario?.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-sm text-gray-400">Component: </span>
                <span className="text-gray-200">{task.metadata?.component}</span>
              </div>
              <div>
                <span className="text-sm text-gray-400">New Component: </span>
                <span className="text-gray-200">{task.metadata?.isNewComponent ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Status</h4>
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              task.status === 'pending' ? 'bg-blue-900/40 text-blue-200' :
              task.status === 'in_progress' ? 'bg-yellow-900/40 text-yellow-200' :
              task.status === 'staged' ? 'bg-green-900/40 text-green-200' :
              task.status === 'deployed' ? 'bg-emerald-900/40 text-emerald-200' :
              'bg-red-900/40 text-red-200'
            }`}>
              {task.status}
            </span>
          </div>

          {/* Prompt */}
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Prompt</h4>
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <p className="text-gray-200 whitespace-pre-wrap">{task.prompt}</p>
            </div>
          </div>

          {/* Generated Content Accordion - Only show if task is staged/deployed and has content */}
          {(task.status === 'staged' || task.status === 'deployed') && task.generatedContent && (
            <div className="border border-gray-700 rounded-lg overflow-hidden">
              {/* Accordion Header */}
              <button
                onClick={() => setShowGeneratedContent(!showGeneratedContent)}
                className="w-full flex items-center justify-between p-4 bg-gray-900/30 hover:bg-gray-900/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {showGeneratedContent ? (
                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                  )}
                  <h4 className="text-sm font-medium text-gray-300">Generated Content</h4>
                  <span className="text-xs bg-green-900/40 text-green-200 px-2 py-1 rounded">
                    {task.generatedContent.filename}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyToClipboard();
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
                  >
                    <DocumentDuplicateIcon className="h-3 w-3" />
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadComponent();
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-green-700 hover:bg-green-600 text-white rounded transition-colors"
                  >
                    <ArrowDownTrayIcon className="h-3 w-3" />
                    Download
                  </button>
                </div>
              </button>

              {/* Accordion Content */}
              {showGeneratedContent && (
                <div className="p-4 border-t border-gray-700 bg-gray-900/20">
                  <div className="mb-3">
                    <span className="text-xs text-gray-400">Description: </span>
                    <span className="text-xs text-gray-300">{task.generatedContent.description}</span>
                  </div>
                  <div className="bg-black/50 p-4 rounded border border-gray-700 overflow-x-auto">
                    <pre className="text-sm text-gray-100 whitespace-pre-wrap">
                      <code>{task.generatedContent.content}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-300 transition-colors"
          >
            Close
          </button>
          {onStartProcess && (
            <button
              onClick={() => onStartProcess(task)}
              className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
                task.status === 'pending' 
                  ? 'bg-blue-600 text-white hover:bg-blue-500' 
                  : 'bg-purple-600 text-white hover:bg-purple-500'
              }`}
            >
              {task.status === 'pending' ? 'Start Generation' : 'Process Task'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentDialog; 