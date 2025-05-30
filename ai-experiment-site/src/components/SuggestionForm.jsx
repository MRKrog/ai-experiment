import { useState } from 'react';

const SuggestionForm = ({ onSubmit }) => {
  const [suggestion, setSuggestion] = useState({
    theme: '',
    description: '',
    priority: 'medium'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...suggestion,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    });
    setSuggestion({ theme: '', description: '', priority: 'medium' });
  };

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-primary">Submit New Suggestion</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Theme</span>
            </label>
            <input
              type="text"
              placeholder="Enter theme suggestion"
              className="input input-bordered w-full"
              value={suggestion.theme}
              onChange={(e) => setSuggestion({ ...suggestion, theme: e.target.value })}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              placeholder="Describe your suggestion"
              value={suggestion.description}
              onChange={(e) => setSuggestion({ ...suggestion, description: e.target.value })}
              required
            ></textarea>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Priority</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={suggestion.priority}
              onChange={(e) => setSuggestion({ ...suggestion, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="card-actions justify-end">
            <button type="submit" className="btn btn-primary">
              Submit Suggestion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuggestionForm; 