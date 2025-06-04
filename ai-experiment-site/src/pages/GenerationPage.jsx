import React from 'react';
import { CreateNewBlueButtonComponent, CreateNewHeaderComponent } from '../components/generated';

// Updated to trigger deployment - generated components will be live after this deploys
function GenerationPage() {
  return (
    <main className="flex-1 w-full overflow-y-auto">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <div>
          <h1 className="text-4xl font-semibold text-white mb-8">Generated Components</h1>
          

          {/* AUTO-GENERATED COMPONENTS APPEAR HERE */}
          {/* Auto-injected: Create New Header */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">🎉 Create New Header</h3>
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="bg-white rounded-lg p-6 mb-4">
                <CreateNewHeaderComponent onClose={() => alert("Clicked!")} />
              </div>
              <p className="text-gray-400 text-sm">
                ↗️ Auto-generated: Create a new interactive UI component (e.g., dropdown, modal, carousel)
              </p>
            </div>
          </div>

          {/* Auto-injected: Create New Blue Button */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">🎉 Create New Blue Button</h3>
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="bg-white rounded-lg p-6 mb-4">
                <CreateNewBlueButtonComponent  />
              </div>
              <p className="text-gray-400 text-sm">
                ↗️ Auto-generated: Create a new interactive UI component (e.g., dropdown, modal, carousel)
              </p>
            </div>
          </div>




          <div>
            <p className="text-gray-300">New components will automatically appear above as you generate them!</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default GenerationPage;