// 📅 DAILY CONTENT COMPONENT
// website/src/components/DailyContent.js

import React from 'react';

const DailyContent = ({ content, onRefresh }) => {
  if (!content) {
    return (
      <div className="daily-content">
        <div className="content-header">
          <p>No content available yet. The AI system might still be generating today's content!</p>
          <button className="refresh-btn" onClick={onRefresh}>
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const getThemeColor = (dayOfWeek) => {
    const colors = {
      Monday: '#e74c3c',    // Red - Motivation
      Tuesday: '#3498db',   // Blue - Tech
      Wednesday: '#2ecc71', // Green - Creativity
      Thursday: '#9b59b6',  // Purple - Thoughts
      Friday: '#f39c12',    // Orange - Fun
      Saturday: '#1abc9c',  // Teal - Poetry
      Sunday: '#34495e'     // Gray - Reflection
    };
    return colors[dayOfWeek] || '#667eea';
  };

  const getThemeEmoji = (dayOfWeek) => {
    const emojis = {
      Monday: '💪',
      Tuesday: '🔧',
      Wednesday: '📚',
      Thursday: '🤔',
      Friday: '😄',
      Saturday: '🌿',
      Sunday: '🔄'
    };
    return emojis[dayOfWeek] || '🤖';
  };

  const themeColor = getThemeColor(content.dayOfWeek);
  const themeEmoji = getThemeEmoji(content.dayOfWeek);

  return (
    <div className="daily-content">
      <div className="content-header">
        <div 
          className="theme-badge"
          style={{ background: themeColor }}
        >
          {themeEmoji} {content.dayOfWeek} Content
        </div>
        <div className="content-date">
          {formatDate(content.date)}
        </div>
        <h1 className="content-title">
          Today's AI Creation
        </h1>
      </div>

      <div 
        className="content-body"
        style={{ borderLeftColor: themeColor }}
      >
        <div className="content-text">
          {content.content}
        </div>
      </div>

      <div className="content-meta">
        <div>
          <strong>Theme:</strong> {content.theme || content.dayOfWeek}
          {content.category && (
            <span> • <strong>Category:</strong> {content.category}</span>
          )}
        </div>
        <div>
          <strong>Generated:</strong> {formatTime(content.timestamp)}
        </div>
      </div>

      {content.fallback && (
        <div className="fallback-notice" style={{ 
          background: 'rgba(255, 193, 7, 0.1)',
          border: '1px solid rgba(255, 193, 7, 0.3)',
          borderRadius: '10px',
          padding: '1rem',
          marginTop: '1rem',
          textAlign: 'center',
          color: '#856404'
        }}>
          ⚠️ This is fallback content. The AI system encountered an issue but will retry tomorrow.
        </div>
      )}

      <div className="content-actions" style={{ 
        marginTop: '2rem', 
        textAlign: 'center' 
      }}>
        <button 
          className="refresh-btn" 
          onClick={onRefresh}
          style={{ marginRight: '1rem' }}
        >
          🔄 Refresh Content
        </button>
        <button 
          className="share-btn"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${content.dayOfWeek} AI Content`,
                text: content.content,
                url: window.location.href
              });
            } else {
              navigator.clipboard.writeText(
                `${content.content}\n\n- AI Generated on ${formatDate(content.date)}`
              );
              alert('Content copied to clipboard!');
            }
          }}
          style={{
            background: 'none',
            border: `2px solid ${themeColor}`,
            color: themeColor,
            padding: '0.75rem 1.5rem',
            borderRadius: '25px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          📤 Share
        </button>
      </div>
    </div>
  );
};

export default DailyContent;