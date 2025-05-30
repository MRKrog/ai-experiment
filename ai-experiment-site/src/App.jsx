import { useState, useEffect } from 'react';
import SuggestionForm from './components/SuggestionForm';
import SuggestionTable from './components/SuggestionTable';
import { fetchGitHubIssues } from './utils/githubUtils';
import './App.css';


// Sample data for initial display
// const sampleSuggestions = [
//   {
//     id: 1,
//     theme: 'Dark Cyberpunk Theme',
//     description: 'A futuristic dark theme with neon accents and sci-fi inspired components. Perfect for modern applications.',
//     priority: 'high',
//     status: 'pending',
//     createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
//   },
//   {
//     id: 2,
//     theme: 'Nature Inspired Layout',
//     description: 'Organic shapes and earth tones, with smooth animations mimicking natural movements.',
//     priority: 'medium',
//     status: 'approved',
//     createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
//   },
//   {
//     id: 3,
//     theme: 'Minimalist White Design',
//     description: 'Clean, crisp white spaces with subtle shadows and minimal color accents.',
//     priority: 'low',
//     status: 'rejected',
//     createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
//   }
// ];

function App() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGitHubIssues = async () => {
      try {
        setLoading(true);
        const issues = await fetchGitHubIssues(
          import.meta.env.VITE_GITHUB_OWNER,
          import.meta.env.VITE_GITHUB_REPO
        );
        setSuggestions(issues);
        setError(null);
      } catch (err) {
        setError('Failed to load issues. Please check your GitHub configuration.');
        console.error('Error loading issues:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGitHubIssues();
  }, []);

  const handleSubmitSuggestion = async (newSuggestion) => {
    // You can implement this to create a new GitHub issue
    console.log('Creating new issue:', newSuggestion);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Navbar */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-white">GitHub Issues Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-blue-900/50 text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                {suggestions.length} Issues
              </span>
              {loading && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700/50 text-gray-200">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refreshing...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-6">New Issue</h2>
            <div className="sticky top-8">
              <SuggestionForm onSubmit={handleSubmitSuggestion} />
            </div>
          </section>

          {/* Table Section */}
          <section className="lg:h-[calc(100vh-8rem)] flex flex-col">
            <h2 className="text-xl font-semibold text-gray-100 mb-6">Recent Issues</h2>
            <div className="flex-1 bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
              {error ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center px-6 py-8 bg-red-900/20 rounded-lg border border-red-700/50">
                    <p className="text-red-400 mb-2">⚠️ {error}</p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="text-sm text-red-300 hover:text-red-200 underline"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : suggestions.length > 0 ? (
                <SuggestionTable suggestions={suggestions} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-gray-400 mb-2">
                      {loading ? 'Loading issues...' : 'No issues yet. Be the first to create one!'}
                    </p>
                    {!loading && (
                      <button 
                        onClick={() => window.location.reload()} 
                        className="text-sm text-blue-400 hover:text-blue-300"
                      >
                        Refresh
                      </button>
                    )}
                  </div>
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