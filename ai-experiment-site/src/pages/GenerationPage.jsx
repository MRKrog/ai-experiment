import React, { useState, useEffect } from 'react';
import { TaskService } from '../services/taskService';
import { HeaderComponent, HeaderComponent_1 } from '../components/generated';
import { DocumentDuplicateIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

function GenerationPage() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(null);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const allTasks = await TaskService.getAllTasks();
        const completed = allTasks.filter(task => 
          task.status === 'completed' && 
          task.generatedContent &&
          task.generatedContent.content
        );
        setCompletedTasks(completed);
      } catch (error) {
        console.error('Error fetching completed tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedTasks();
  }, []);

  const handleCopyToClipboard = async (content, taskId) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(taskId);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy content:', err);
    }
  };

  const handleDownloadComponent = (task) => {
    if (task.generatedContent?.content && task.generatedContent?.filename) {
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

  if (loading) {
    return (
      <main className="flex-1 w-full overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full overflow-y-auto">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-white mb-2">Generated Components</h1>
          <p className="text-gray-300">
            {completedTasks.length > 0 
              ? `${completedTasks.length} component${completedTasks.length !== 1 ? 's' : ''} auto-deployed and ready to use`
              : 'No components generated yet. Create your first task to see the magic!'
            }
          </p>
        </div>

        {/* Live Component Preview Section */}
        {completedTasks.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">🎉 Live Component Preview</h2>
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="bg-white rounded-lg p-6 mb-4">
                <HeaderComponent 
                  title="🚀 Auto-Generated Component!" 
                  subtitle="This component was automatically created and deployed by AI"
                />
              </div>
              <p className="text-gray-400 text-sm">
                ↗️ This HeaderComponent was auto-generated from your task and is now live in your codebase!
              </p>
            </div>
          </div>
        )}

        {/* AUTO-GENERATED COMPONENTS APPEAR HERE */}
        {/* Auto-injected: Create New Hero Image */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">🎉 Create New Hero Image</h3>
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="bg-white rounded-lg p-6 mb-4">
              <HeaderComponent_1 
        title="Auto-Generated Header!" 
        subtitle="Create a new interactive UI component (e.g., dropdown, modal, carousel)" />
            </div>
            <p className="text-gray-400 text-sm">
              ↗️ Auto-generated: Create a new interactive UI component (e.g., dropdown, modal, carousel)
            </p>
          </div>
        </div>


        {completedTasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 max-w-md mx-auto">
              <h3 className="text-xl font-medium text-gray-100 mb-2">No Components Yet</h3>
              <p className="text-gray-400 mb-4">Generate your first component to see it here!</p>
              <a 
                href="/ai-experiment" 
                className="inline-flex px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
              >
                Create First Task
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-white">Component Gallery</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedTasks.map((task) => (
                <div key={task._id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-100">{task.title}</h3>
                      <span className="text-xs bg-green-900/40 text-green-200 px-2 py-1 rounded">
                        ✅ Deployed
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{task.description}</p>
                  </div>

                  {/* Component Info */}
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="text-xs text-gray-400 mb-1">Generated File:</div>
                      <div className="text-sm text-blue-300 font-mono bg-gray-900/50 px-2 py-1 rounded">
                        {task.generatedContent.filename}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-xs text-gray-400 mb-1">Description:</div>
                      <div className="text-sm text-gray-300">
                        {task.generatedContent.description}
                      </div>
                    </div>

                    {/* Deployment Status */}
                    {task.metadata?.deployment && (
                      <div className="mb-4 p-3 bg-green-900/20 border border-green-700/50 rounded">
                        <div className="text-xs font-medium text-green-200 mb-1">
                          🚀 Auto-Deployment Status:
                        </div>
                        <div className="text-xs text-green-300">
                          ✅ Local: {task.metadata.deployment.finalFilename}<br/>
                          ✅ Git: {task.metadata.deployment.productionDeployment?.deployed ? 'Committed & Pushed' : 'Local only'}<br/>
                          📅 Deployed: {new Date(task.metadata.deployment.deployedAt).toLocaleString()}
                        </div>
                      </div>
                    )}

                    {/* Code Preview */}
                    <div className="mb-4">
                      <div className="text-xs text-gray-400 mb-2">Code Preview:</div>
                      <div className="bg-black/50 p-3 rounded border border-gray-700 overflow-hidden">
                        <pre className="text-xs text-gray-100 whitespace-pre-wrap line-clamp-8">
                          <code>{task.generatedContent.content}</code>
                        </pre>
                      </div>
                    </div>

                    {/* Usage Example */}
                    <div className="mb-4">
                      <div className="text-xs text-gray-400 mb-2">Usage Example:</div>
                      <div className="bg-gray-900/50 p-3 rounded border border-gray-700">
                        <pre className="text-xs text-blue-300">
{`import { ${task.generatedContent.filename?.replace('.tsx', '')} } from './components/generated';

<${task.generatedContent.filename?.replace('.tsx', '')} 
  title="Your Title" 
/>`}
                        </pre>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleCopyToClipboard(task.generatedContent.content, task._id)}
                        className="flex items-center justify-center gap-1 px-3 py-2 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
                      >
                        <DocumentDuplicateIcon className="h-4 w-4" />
                        {copySuccess === task._id ? 'Copied!' : 'Copy Code'}
                      </button>
                      <button
                        onClick={() => handleDownloadComponent(task)}
                        className="flex items-center justify-center gap-1 px-3 py-2 text-xs bg-green-700 hover:bg-green-600 text-white rounded transition-colors"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        Download
                      </button>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 border-t border-gray-700 bg-gray-900/30">
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>Component: {task.metadata?.component}</span>
                      <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default GenerationPage; 