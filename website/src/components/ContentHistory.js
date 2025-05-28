// 📚 CONTENT HISTORY COMPONENT
// website/src/components/ContentHistory.js

import React, { useState } from 'react';

const ContentHistory = ({ historyContent, onLoadMore }) => {
  const [expandedItem, setExpandedItem] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getThemeColor = (dayOfWeek) => {
    const colors = {
      Monday: '#e74c3c',
      Tuesday: '#3498db',
      Wednesday: '#2ecc71',
      Thursday: '#9b59b6',
      Friday: '#f39c12',
      Saturday: '#1abc9c',
      Sunday: '#34495e'
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

  const toggleExpand = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  if (!historyContent || historyContent.length === 0) {
    return (
      <div className="content-history">
        <div className="history-header">
          <h2>📚 Content History</h2>
          <p>No historical content found yet. Come back after a few days of AI generation!</p>
          <button className="refresh-btn" onClick={onLoadMore}>
            🔄 Check Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-history">
      <div className="history-header">
        <h2>📚 Content History</h2>
        <p>Browse through your AI's creative journey over time</p>
        <div style={{ marginTop: '1rem' }}>
          <span style={{ 
            background: 'rgba(102, 126, 234, 0.1)', 
            padding: '0.5rem 1rem', 
            borderRadius: '15px',
            fontSize: '0.9rem',
            color: '#667eea'
          }}>
            📈 {historyContent.length} days of AI creativity
          </span>
        </div>
      </div>

      <div className="history-grid">
        {historyContent.map((item, index) => {
          const themeColor = getThemeColor(item.dayOfWeek);
          const themeEmoji = getThemeEmoji(item.dayOfWeek);
          const isExpanded = expandedItem === index;
          
          return (
            <div 
              key={item.date || index}
              className="history-item"
              style={{ borderLeftColor: themeColor }}
              onClick={() => toggleExpand(index)}
            >
              <div className="history-date">
                {formatDate(item.date)} • {item.dayOfWeek}
              </div>
              
              <div 
                className="history-theme"
                style={{ color: themeColor }}
              >
                {themeEmoji} {item.theme || item.dayOfWeek} Content
              </div>
              
              <div className="history-preview">
                {isExpanded ? item.content : `${item.content.substring(0, 150)}...`}
              </div>
              
              <div style={{ 
                marginTop: '1rem', 
                fontSize: '0.8rem', 
                color: '#999',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>
                  Generated: {new Date(item.timestamp).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                <span 
                  style={{ 
                    cursor: 'pointer', 
                    color: themeColor,
                    fontWeight: '500'
                  }}
                >
                  {isExpanded ? '📖 Click to collapse' : '👁️ Click to expand'}
                </span>
              </div>
              
              {item.category && (
                <div style={{ 
                  marginTop: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#666',
                  fontStyle: 'italic'
                }}>
                  Category: {item.category}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button 
          className="refresh-btn" 
          onClick={onLoadMore}
          style={{ background: 'rgba(102, 126, 234, 0.1)', color: '#667eea' }}
        >
          🔄 Load More History
        </button>
      </div>
    </div>
  );
};

export default ContentHistory;