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
    <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700">
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Theme Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Theme
            </label>
            <input
              type="text"
              placeholder="Enter your theme idea"
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400
                focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={suggestion.theme}
              onChange={(e) => setSuggestion({ ...suggestion, theme: e.target.value })}
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400
                focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                transition-all min-h-[120px] resize-y"
              placeholder="Describe your theme idea in detail"
              value={suggestion.description}
              onChange={(e) => setSuggestion({ ...suggestion, description: e.target.value })}
              required
            ></textarea>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Priority Level
            </label>
            <div className="flex gap-3">
              {['low', 'medium', 'high'].map((priority) => (
                <button
                  key={priority}
                  type="button"
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm capitalize transition-all
                    ${suggestion.priority === priority
                      ? 'bg-blue-900/50 text-blue-200 ring-2 ring-blue-500'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  onClick={() => setSuggestion({ ...suggestion, priority })}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-medium 
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                focus:ring-offset-gray-800 transition-colors"
            >
              Submit Suggestion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuggestionForm; 