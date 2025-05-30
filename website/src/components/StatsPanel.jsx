// 📊 STATS PANEL COMPONENT
// website/src/components/StatsPanel.js

import React from 'react';

const StatsPanel = ({ currentContent, historyContent }) => {
  // Calculate statistics
  const calculateStats = () => {
    const totalDays = historyContent ? historyContent.length + (currentContent ? 1 : 0) : (currentContent ? 1 : 0);
    
    const allContent = [...(historyContent || [])];
    if (currentContent) allContent.push(currentContent);
    
    const totalWords = allContent.reduce((sum, item) => {
      return sum + (item.content ? item.content.split(' ').length : 0);
    }, 0);
    
    const averageWords = totalDays > 0 ? Math.round(totalWords / totalDays) : 0;
    
    // Theme distribution
    const themes = {};
    allContent.forEach(item => {
      const theme = item.dayOfWeek || item.theme || 'Unknown';
      themes[theme] = (themes[theme] || 0) + 1;
    });
    
    const mostCommonTheme = Object.keys(themes).reduce((a, b) => 
      themes[a] > themes[b] ? a : b, 'None'
    );
    
    // Calculate streak (days with content)
    const today = new Date();
    let streak = 0;
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toISOString().split('T')[0];
      
      const hasContent = allContent.some(item => item.date === dateString);
      if (hasContent) {
        streak++;
      } else if (i > 0) { // Don't break on today if no content yet
        break;
      }
    }
    
    return {
      totalDays,
      totalWords,
      averageWords,
      themes,
      mostCommonTheme,
      streak
    };
  };

  const stats = calculateStats();

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

  const getStreakEmoji = (streak) => {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '⚡';
    if (streak >= 7) return '🌟';
    if (streak >= 3) return '💪';
    return '🌱';
  };

  return (
    <div className="stats-panel">
      <div className="stats-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>📊 AI Activity Statistics</h2>
        <p>Your automated content generation journey</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalDays}</div>
          <div className="stat-label">Days Active</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{stats.totalWords.toLocaleString()}</div>
          <div className="stat-label">Total Words</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{stats.averageWords}</div>
          <div className="stat-label">Avg Words/Day</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{getStreakEmoji(stats.streak)} {stats.streak}</div>
          <div className="stat-label">Day Streak</div>
        </div>
      </div>

      {/* Theme Distribution */}
      <div style={{ 
        background: 'rgba(248, 249, 250, 0.8)', 
        borderRadius: '15px', 
        padding: '2rem', 
        marginTop: '2rem' 
      }}>
        <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>🎨 Content Themes</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem' 
        }}>
          {Object.entries(stats.themes).map(([theme, count]) => (
            <div 
              key={theme}
              style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '10px',
                borderLeft: `4px solid ${getThemeColor(theme)}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ fontWeight: '500' }}>{theme}</span>
              <span style={{ 
                background: getThemeColor(theme), 
                color: 'white', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '15px',
                fontSize: '0.9rem'
              }}>
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Timeline */}
      {historyContent && historyContent.length > 0 && (
        <div style={{ 
          background: 'rgba(248, 249, 250, 0.8)', 
          borderRadius: '15px', 
          padding: '2rem', 
          marginTop: '2rem' 
        }}>
          <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>📈 Recent Activity</h3>
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {historyContent.slice(0, 14).map((item, index) => (
              <div
                key={item.date || index}
                style={{
                  width: '30px',
                  height: '30px',
                  background: getThemeColor(item.dayOfWeek),
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  title: `${item.dayOfWeek} - ${item.date}`
                }}
              >
                {new Date(item.date).getDate()}
              </div>
            ))}
          </div>
          <p style={{ 
            textAlign: 'center', 
            marginTop: '1rem', 
            fontSize: '0.9rem', 
            color: '#666' 
          }}>
            Last 14 days of AI content generation
          </p>
        </div>
      )}

      {/* System Info */}
      <div style={{ 
        background: 'rgba(248, 249, 250, 0.8)', 
        borderRadius: '15px', 
        padding: '2rem', 
        marginTop: '2rem',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>🤖 System Information</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1rem',
          textAlign: 'left'
        }}>
          <div>
            <strong>🧠 AI Model:</strong> Claude 3.5 Sonnet
          </div>
          <div>
            <strong>⏰ Schedule:</strong> Daily at 10:00 AM UTC
          </div>
          <div>
            <strong>🔄 Last Update:</strong> {
              currentContent ? new Date(currentContent.timestamp).toLocaleDateString() : 'No recent update'
            }
          </div>
          <div>
            <strong>📈 Success Rate:</strong> {
              stats.totalDays > 0 ? Math.round((stats.totalDays / Math.max(stats.streak + 1, stats.totalDays)) * 100) : 100
            }%
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div style={{ 
        background: 'rgba(248, 249, 250, 0.8)', 
        borderRadius: '15px', 
        padding: '2rem', 
        marginTop: '2rem',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>🏆 Achievements</h3>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {stats.totalDays >= 1 && (
            <span style={{ 
              background: '#2ecc71', 
              color: 'white', 
              padding: '0.5rem 1rem', 
              borderRadius: '15px',
              fontSize: '0.9rem'
            }}>
              🌱 First Content
            </span>
          )}
          {stats.totalDays >= 7 && (
            <span style={{ 
              background: '#3498db', 
              color: 'white', 
              padding: '0.5rem 1rem', 
              borderRadius: '15px',
              fontSize: '0.9rem'
            }}>
              📅 Week Warrior
            </span>
          )}
          {stats.totalDays >= 30 && (
            <span style={{ 
              background: '#9b59b6', 
              color: 'white', 
              padding: '0.5rem 1rem', 
              borderRadius: '15px',
              fontSize: '0.9rem'
            }}>
              🗓️ Month Master
            </span>
          )}
          {stats.streak >= 14 && (
            <span style={{ 
              background: '#e74c3c', 
              color: 'white', 
              padding: '0.5rem 1rem', 
              borderRadius: '15px',
              fontSize: '0.9rem'
            }}>
              🔥 Streak Legend
            </span>
          )}
          {stats.totalWords >= 1000 && (
            <span style={{ 
              background: '#f39c12', 
              color: 'white', 
              padding: '0.5rem 1rem', 
              borderRadius: '15px',
              fontSize: '0.9rem'
            }}>
              📝 Word Wizard
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;