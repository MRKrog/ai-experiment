import React from 'react';

function ContentPage() {
  return (
    <main className="flex-1 w-full overflow-y-auto bg-gray-900">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-8">
          <h1 className="text-4xl font-semibold text-white mb-8">Generated Content</h1>
          <div className="prose prose-invert max-w-none">
            {/* Content will be added here */}
            <p className="text-gray-300">Content will be displayed here...</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ContentPage; 