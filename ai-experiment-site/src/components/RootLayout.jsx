import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';
import { fetchGitHubIssues } from '../utils/githubUtils';

function RootLayout() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGitHubIssues = async () => {
      try {
        setLoading(true);
        const issues = await fetchGitHubIssues(
          import.meta.env.VITE_GITHUB_OWNER,
          import.meta.env.VITE_GITHUB_REPO
        );
        setSuggestions(issues);
      } catch (err) {
        console.error('Error loading issues:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGitHubIssues();
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-900">
      <Navbar suggestionsCount={suggestions.length} loading={loading} />
      <Outlet />
    </div>
  );
}

export default RootLayout; 