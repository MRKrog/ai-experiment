import { useState, useEffect } from 'react';
import SuggestionForm from './components/SuggestionForm';
import SuggestionTable from './components/SuggestionTable';
import { loadSuggestions, addSuggestion } from './utils/suggestionUtils';
import './App.css';

function App() {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Load suggestions from local storage on component mount
    setSuggestions(loadSuggestions());
  }, []);

  const handleSubmitSuggestion = (newSuggestion) => {
    setSuggestions(prevSuggestions => 
      addSuggestion(prevSuggestions, newSuggestion)
    );
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navbar */}
      <div className="navbar bg-base-300">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">AI Experiment</a>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Form Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Submit a Suggestion</h2>
            <SuggestionForm onSubmit={handleSubmitSuggestion} />
          </section>

          {/* Table Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Suggestions</h2>
              <span className="badge badge-primary badge-lg">
                {suggestions.length} Total
              </span>
            </div>
            {suggestions.length > 0 ? (
              <SuggestionTable suggestions={suggestions} />
            ) : (
              <div className="text-center py-8 bg-base-200 rounded-lg">
                <p className="text-lg">No suggestions yet. Be the first to submit one!</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;