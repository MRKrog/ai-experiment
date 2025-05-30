import React, { useState, useEffect } from 'react';
import ContentForm from '../components/ContentForm';
import ContentHistory from '../components/ContentHistory';
import ContentPreview from '../components/ContentPreview';
import { fetchGitHubIssues, createContentRequest, deleteContentRequest } from '../utils/githubUtils';

function Dashboard() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadGitHubIssues = async (page = 1) => {
    try {
      setLoading(true);
      const newIssues = await fetchGitHubIssues(
        import.meta.env.VITE_GITHUB_OWNER,
        import.meta.env.VITE_GITHUB_REPO,
        page
      );
      console.log('Loaded issues:', newIssues);
      
      if (page === 1) {
        setSuggestions(newIssues);
      } else {
        setSuggestions(prev => [...prev, ...newIssues]);
      }
      
      setHasMore(newIssues.length === 100); // If we got less than 100 issues, we've reached the end
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
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadGitHubIssues(currentPage + 1);
    }
  };

  const handleSubmitSuggestion = async (newSuggestion) => {
    try {
      setLoading(true);
      await createContentRequest(
        import.meta.env.VITE_GITHUB_OWNER,
        import.meta.env.VITE_GITHUB_REPO,
        newSuggestion
      );
      await loadGitHubIssues(1); // Reload from first page after new submission
    } catch (err) {
      setError('Failed to create content request. Please try again.');
      console.error('Error creating request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (issueId) => {
    try {
      setLoading(true);
      await deleteContentRequest(
        import.meta.env.VITE_GITHUB_OWNER,
        import.meta.env.VITE_GITHUB_REPO,
        issueId
      );
      await loadGitHubIssues(1); // Reload the list after deletion
    } catch (err) {
      setError('Failed to delete content request. Please try again.');
      console.error('Error deleting request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartProcess = async (suggestion) => {
    try {
      // Here you would typically start your content generation process
      // For now, we'll just update the status to 'approved'
      const updatedSuggestion = {
        ...suggestion,
        status: 'approved'
      };
      
      // Update the suggestion in the list
      setSuggestions(prevSuggestions =>
        prevSuggestions.map(s =>
          s.id === suggestion.id ? updatedSuggestion : s
        )
      );

      // You can add your content generation logic here
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
            <div className="grid grid-cols-1 gap-8">
              <ContentForm onSubmit={handleSubmitSuggestion} />
              <ContentPreview />
            </div>
            
            {/* Right column */}
            <div>
              <ContentHistory 
                suggestions={suggestions}
                loading={loading}
                error={error}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                onDelete={handleDelete}
                onStartProcess={handleStartProcess}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard; 