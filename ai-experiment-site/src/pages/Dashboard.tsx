import React from 'react';
import { ContentForm } from '../components/features/content/ContentForm';
import { ContentHistory } from '../components/features/content/ContentHistory';
import { ContentTasks } from '../components/features/content/ContentTasks';
import { fetchGitHubIssues, createContentRequest, deleteContentRequest } from '../utils/githubUtils.ts';
import type { DialogSuggestion, ContentFormData } from '../types/suggestion.types';
import type { Task, TaskFormData } from '../types/task.types';
import { mapGitHubIssueToSuggestion } from '../types/suggestion.types';
import { useTasks } from '../hooks/useTasks';

const Dashboard: React.FC = () => {
  const { 
    tasks, 
    loading, 
    error, 
    createTask, 
    deleteTask, 
    updateTaskStatus 
  } = useTasks();

  // Handle task submission
  const handleTaskSubmission = async (formData: TaskFormData) => {
    await createTask(formData);
  };

  // Handle task deletion
  const handleDelete = async (taskId: string) => {
    await deleteTask(taskId);
  };

  // Handle start processing task
  const handleStartProcess = async (task: Task) => {
    try {
      // Update task status to in_progress
      await updateTaskStatus(task._id, 'in_progress');

      // Simulate AI generation process
      setTimeout(async () => {
        // This would be where you'd call your AI generation service
        // For now, we'll just mark it as completed
        // await updateTaskStatus(task._id, 'completed');
      }, 3000);
      
    } catch (err) {
      console.error('Error starting task processing:', err);
    }
  };

  return (
    <main className="flex-1 w-full overflow-y-auto">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          <div className="grid grid-cols-2 gap-8">

            {/* Left column */}
            <div>
              <ContentForm onSubmit={handleTaskSubmission} />
            </div>
            
            {/* Right column */}
            <div>
              <ContentTasks
                tasks={tasks}
                loading={loading}
                error={error}
                onDelete={handleDelete}
                onStartProcess={handleStartProcess}
              />
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard; 