import React, { useState, useEffect } from 'react';
import { ContentForm } from '../components/features/content/ContentForm';
import { ContentHistory } from '../components/features/content/ContentHistory';
import { ContentPreview } from '../components/features/content/ContentPreview';
import { ContentTasks } from '../components/features/content/ContentTasks';
import { fetchGitHubIssues, createContentRequest, deleteContentRequest } from '../utils/githubUtils.ts';
import type { DialogSuggestion, ContentFormData } from '../types/suggestion.types';
import { mapGitHubIssueToSuggestion } from '../types/suggestion.types';

interface Task extends DialogSuggestion {
  _id: string;
  title: string;
  type: 'code_generation' | 'image_generation' | 'text_generation';
  createdAt: string | Date;
}

declare global {
  interface ImportMeta {
    env: {
      VITE_GITHUB_TOKEN: string;
      VITE_GITHUB_OWNER: string;
      VITE_GITHUB_REPO: string;
    }
  }
}

const Dashboard: React.FC = () => {
  const [suggestions, setSuggestions] = useState<DialogSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = async () => {
    try {
      const response = await fetch(`https://ai-experiment-production.up.railway.app/api/tasks`);
      const data = await response.json();
      console.log('Loaded tasks:', data);
      setTasks(data.tasks);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const loadGitHubIssues = async (page = 1) => {
    try {
      setLoading(true);
      const newIssues = await fetchGitHubIssues(
        import.meta.env.VITE_GITHUB_OWNER,
        import.meta.env.VITE_GITHUB_REPO,
        page
      );
      
      const mappedIssues = newIssues.map(mapGitHubIssueToSuggestion);
      
      if (page === 1) {
        setSuggestions(mappedIssues);
      } else {
        setSuggestions(prev => [...prev, ...mappedIssues]);
      }
      
      setHasMore(newIssues.length === 100);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      console.error('Failed to load issues:', err);
      setError('Failed to load issues. Please check your GitHub configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGitHubIssues();
    loadTasks();
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadGitHubIssues(currentPage + 1);
    }
  };

  const handleSubmitSuggestion = async (formData: ContentFormData) => {
    try {
      setLoading(true);
      const newSuggestion: DialogSuggestion = {
        ...formData,
        _id: new Date().getTime().toString(),
        createdAt: new Date().toISOString(),
      };
      await createContentRequest(
        import.meta.env.VITE_GITHUB_OWNER,
        import.meta.env.VITE_GITHUB_REPO,
        newSuggestion
      );
      await loadGitHubIssues(1);
    } catch (err) {
      setError('Failed to create content request. Please try again.');
      console.error('Error creating request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (issueId: string) => {
    try {
      setLoading(true);
      await deleteContentRequest(
        import.meta.env.VITE_GITHUB_OWNER,
        import.meta.env.VITE_GITHUB_REPO,
        issueId
      );
      await loadGitHubIssues(1);
    } catch (err) {
      setError('Failed to delete content request. Please try again.');
      console.error('Error deleting request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartProcess = async (suggestion: DialogSuggestion) => {
    try {
      const updatedSuggestion: DialogSuggestion = {
        ...suggestion,
        status: 'in_progress'
      };
      
      setSuggestions(prevSuggestions =>
        prevSuggestions.map(s =>
          s._id === suggestion._id ? updatedSuggestion : s
        )
      );

      console.log('Starting content generation for:', suggestion);
      
    } catch (err) {
      setError('Failed to start content generation. Please try again.');
      console.error('Error starting content generation:', err);
    }
  };

  return (
    <main className="flex-1 w-full overflow-y-auto">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          <div className="grid grid-cols-2 gap-8">

            {/* Left column */}
            <div>
              <ContentForm onSubmit={handleSubmitSuggestion} />
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