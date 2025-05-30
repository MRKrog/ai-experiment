import React from 'react';
import SuggestionTable from './SuggestionTable';

function ContentHistory({ suggestions, loading, error, onDelete, onStartProcess }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-100 mb-4">Generation History</h2>
      <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 h-[80vh]">
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
        ) : suggestions.length > 0 || loading ? (
          <SuggestionTable 
            suggestions={suggestions} 
            isLoading={loading}
            onDelete={onDelete}
            onStartProcess={onStartProcess}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-400 mb-2">No issues yet. Be the first to create one!</p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ContentHistory;