import { useState, useEffect } from 'react';
import SuggestionForm from './components/SuggestionForm';
import SuggestionTable from './components/SuggestionTable';
import { loadSuggestions, addSuggestion } from './utils/suggestionUtils';
import './App.css';

// Sample data for initial display
const sampleSuggestions = [
  {
    id: 1,
    theme: 'Dark Cyberpunk Theme',
    description: 'A futuristic dark theme with neon accents and sci-fi inspired components. Perfect for modern applications.',
    priority: 'high',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  },
  {
    id: 2,
    theme: 'Nature Inspired Layout',
    description: 'Organic shapes and earth tones, with smooth animations mimicking natural movements.',
    priority: 'medium',
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: 3,
    theme: 'Minimalist White Design',
    description: 'Clean, crisp white spaces with subtle shadows and minimal color accents.',
    priority: 'low',
    status: 'rejected',
    createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  }
];

function App() {
  const [suggestions, setSuggestions] = useState(sampleSuggestions);

  useEffect(() => {
    // Load suggestions from local storage on component mount
    const stored = loadSuggestions();
    setSuggestions(stored.length ? stored : sampleSuggestions);
  }, []);

  const handleSubmitSuggestion = (newSuggestion) => {
    setSuggestions(prevSuggestions => 
      addSuggestion(prevSuggestions, newSuggestion)
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-white">AI Experiment</h1>
            </div>
            <div className="flex items-center">
              <span className="bg-blue-900/50 text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                {suggestions.length} Suggestions
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-6">New Suggestion</h2>
            <div className="sticky top-8">
              <SuggestionForm onSubmit={handleSubmitSuggestion} />
            </div>
          </section>

          {/* Table Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-6">Recent Suggestions</h2>
            <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
              {suggestions.length > 0 ? (
                <SuggestionTable suggestions={suggestions} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm text-gray-400">
                    No suggestions yet. Be the first to submit one!
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;