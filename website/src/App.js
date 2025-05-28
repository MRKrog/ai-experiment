// 🌐 AI DAILY CONTENT WEBSITE
// website/src/App.js

import React, { useState, useEffect } from 'react';
import './App.css';

// Components
import DailyContent from './components/DailyContent';
import ContentHistory from './components/ContentHistory';
import StatsPanel from './components/StatsPanel';
import Navigation from './components/Navigation';

function App() {
  const [currentContent, setCurrentContent] = useState(null);
  const [historyContent, setHistoryContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today');
  const [error, setError] = useState(null);

  // Get base URL for content - use PUBLIC_URL in production, empty in development
  const getBaseUrl = () => {
    return process.env.NODE_ENV === 'production' ? process.env.PUBLIC_URL : '';
  };

  // Load today's content
  const loadLatestContent = React.useCallback(async () => {
    try {
      setLoading(true);
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`https://mrkrog.github.io/ai-experiment/content/${today}.json`);
      
      if (!response.ok) {
        throw new Error('Content not found');
      }
      
      const data = await response.json();
      setCurrentContent(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load latest content:', err);
      setError('Unable to load today\'s content. The AI might still be generating it!');
      
      // Fallback content for demo
      setCurrentContent({
        content: "Welcome to your AI Daily Content website! Your automated system will populate this with fresh content every day.",
        theme: "Welcome",
        date: new Date().toISOString().split('T')[0],
        dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Load recent content history
  const loadRecentHistory = React.useCallback(async () => {
    try {
      // Get the last 7 days
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      });

      // Try to fetch content for each date
      const historyPromises = dates.map(async (date) => {
        try {
          const response = await fetch(`https://mrkrog.github.io/ai-experiment/content/${date}.json`);
          if (response.ok) {
            return await response.json();
          }
          return null;
        } catch {
          return null;
        }
      });

      const historyData = await Promise.all(historyPromises);
      setHistoryContent(historyData.filter(Boolean));
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  }, []);

  // Load latest content on app start
  useEffect(() => {
    loadLatestContent();
    loadRecentHistory();
  }, [loadLatestContent, loadRecentHistory]);

  // Refresh content manually
  const refreshContent = () => {
    loadLatestContent();
    loadRecentHistory();
  };

  if (loading && !currentContent) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your AI-generated content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🤖 AI Daily Content</h1>
          <p>Fresh AI-generated content, delivered daily</p>
          <button className="refresh-btn" onClick={refreshContent}>
            🔄 Refresh
          </button>
        </div>
      </header>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
          </div>
        )}

        {activeTab === 'today' && (
          <DailyContent 
            content={currentContent} 
            onRefresh={refreshContent}
          />
        )}

        {activeTab === 'history' && (
          <ContentHistory 
            historyContent={historyContent}
            onLoadMore={loadRecentHistory}
          />
        )}

        {activeTab === 'stats' && (
          <StatsPanel 
            currentContent={currentContent}
            historyContent={historyContent}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>
          Powered by <strong>Claude AI</strong> • 
          Updated daily via <strong>GitHub Actions</strong> • 
          Built with ❤️ and 🤖
        </p>
        <p>
          <a href="https://github.com/MRKrog/ai-daily-content" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;