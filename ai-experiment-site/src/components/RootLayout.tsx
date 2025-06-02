import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import ContentNavbar from './ContentNavbar';
import { fetchGitHubIssues } from '../utils/githubUtils.ts';
import type { GitHubIssueResponse } from '../types/suggestion.types';

const RootLayout: React.FC = () => {
  const [suggestions, setSuggestions] = useState<GitHubIssueResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

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

  const renderNavbar = () => {
    if (location.pathname === '/content') {
      // Return a different navbar for content page
      return <ContentNavbar />; // You'll need to create this component
    }
    
    // Default navbar for other routes
    return <Navbar suggestionsCount={suggestions.length} loading={loading} />;
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {renderNavbar()}
      <Outlet />
    </div>
  );
};

export default RootLayout; 