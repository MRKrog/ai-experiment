import React, { useState } from 'react';

const RequestForm = () => {
  const [request, setRequest] = useState({
    type: 'poem',
    prompt: '',
    anonymous: true
  });
  
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  
  const contentTypes = [
    { id: 'poem', label: '📝 Poem', description: 'A creative piece of verse' },
    { id: 'story', label: '📚 Story', description: 'A short narrative or tale' },
    { id: 'code', label: '💻 Code Example', description: 'A programming snippet or solution' },
    { id: 'advice', label: '💡 Tech Advice', description: 'Technical guidance or tips' }
  ];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      // For now, we'll just simulate the submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('success');
      setRequest({ ...request, prompt: '' }); // Clear prompt but keep other settings
      
      setTimeout(() => setStatus('idle'), 3000); // Reset status after 3 seconds
      
    } catch (error) {
      console.error('Submit error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };
  
  return (
    <div className="content-section">
      <div className="content-card">
        <h2 className="section-title">Request AI-Generated Content</h2>
        
        <form onSubmit={handleSubmit} className="request-form">
          {/* Content Type Selection */}
          <div className="form-section">
            <label className="form-label">Content Type</label>
            <div className="content-type-grid">
              {contentTypes.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setRequest({ ...request, type: type.id })}
                  className={`content-type-button ${request.type === type.id ? 'selected' : ''}`}
                >
                  <span className="content-type-label">{type.label}</span>
                  <span className="content-type-description">{type.description}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Prompt Input */}
          <div className="form-section">
            <label htmlFor="prompt" className="form-label">
              Your Request
            </label>
            <textarea
              id="prompt"
              value={request.prompt}
              onChange={(e) => setRequest({ ...request, prompt: e.target.value })}
              placeholder="Describe what you'd like the AI to generate..."
              className="request-textarea"
              required
            />
          </div>
          
          {/* Anonymous Toggle */}
          <div className="form-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={request.anonymous}
                onChange={(e) => setRequest({ ...request, anonymous: e.target.checked })}
                className="checkbox-input"
              />
              <span>Submit anonymously</span>
            </label>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className={`submit-button ${status === 'submitting' ? 'submitting' : ''}`}
          >
            {status === 'submitting' ? '🔄 Submitting...' : '✨ Submit Request'}
          </button>
          
          {/* Status Messages */}
          {status === 'success' && (
            <div className="status-message success">
              ✅ Request submitted successfully! We'll process it soon.
            </div>
          )}
          {status === 'error' && (
            <div className="status-message error">
              ❌ Failed to submit request. Please try again.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RequestForm; 