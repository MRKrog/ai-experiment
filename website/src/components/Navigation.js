// 🧭 NAVIGATION COMPONENT
// website/src/components/Navigation.js

import React from 'react';

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'today', label: '📅 Today', description: 'Current AI content' },
    { id: 'history', label: '📚 History', description: 'Past content archive' },
    { id: 'stats', label: '📊 Stats', description: 'Activity statistics' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            title={tab.description}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;