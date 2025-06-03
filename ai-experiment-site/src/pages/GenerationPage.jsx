import React from 'react';
import { HeaderComponent } from '../components/generated';

function GenerationPage() {
  return (
    <main className="flex-1 w-full overflow-y-auto">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <div>
          <h1 className="text-4xl font-semibold text-white mb-8">Generated Content</h1>
          <div>
            {/* Content will be added here */}
            <p className="text-gray-300">Content will be displayed here...</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default GenerationPage;